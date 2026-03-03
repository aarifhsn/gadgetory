import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const { name, email, password, mobile, userType, shopName } =
      await request.json();
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }
    await dbConnect();
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      authProvider: "credentials",
      userType: userType || "customer",
    };
    if (mobile) {
      userData.mobile = {
        countryCode: "+880",
        number: mobile,
      };
    }
    if (userType === "shopOwner" && shopName) {
      userData.shopName = shopName;
    }
    const user = await User.create(userData);
    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user._id,
        userType: user.userType,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
