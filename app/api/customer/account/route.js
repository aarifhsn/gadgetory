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

    // Only customers can update customer account
    if (session.user.userType === "shopOwner") {
      return NextResponse.json(
        { error: "Shop owners should use profile page" },
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
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.avatar) user.avatar = data.avatar;

    // Update mobile
    if (data.mobileNumber) {
      user.mobile = {
        countryCode: "+880",
        number: data.mobileNumber,
      };
    }

    // Update location
    if (data.city) user.city = data.city;
    if (data.address) user.address = data.address;

    await user.save();

    return NextResponse.json({
      message: "Account updated successfully",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        mobile: user.mobile,
        city: user.city,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
      avatar: user.avatar,
      mobile: user.mobile,
      city: user.city,
      address: user.address,
    });
  } catch (error) {
    console.error("Get account error:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 },
    );
  }
}
