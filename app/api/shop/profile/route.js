import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only shop owners can update shop profile
    if (session.user.userType !== "shopOwner") {
      return NextResponse.json(
        { error: "Only shop owners can update shop profile" },
        { status: 403 },
      );
    }

    const data = await request.json();

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update basic info
    if (data.avatar) user.avatar = data.avatar;
    if (data.shopName) user.shopName = data.shopName;
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.mobile) {
      user.mobile = {
        countryCode: data.mobile.countryCode || "+880",
        number: data.mobile.number,
      };
    }

    // Update shop profile
    user.shopProfile = {
      ...user.shopProfile,
      description: data.description,
      address: data.address,
      city: data.city,
      specialization: data.specialization,
      banner: data.banner || user.shopProfile?.banner,
      yearEstablished: data.yearEstablished,
      numberOfEmployees: data.numberOfEmployees,
      brandPartnerships: data.brandPartnerships || [],
      website: data.website,
      verified: user.shopProfile?.verified || false,
    };

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        shopName: user.shopName,
        mobile: user.mobile,
        shopProfile: user.shopProfile,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      shopName: user.shopName,
      mobile: user.mobile,
      shopProfile: user.shopProfile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
