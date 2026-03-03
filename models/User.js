import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    // User type
    userType: {
      type: String,
      enum: ["customer", "shopOwner"],
      required: [true, "User type is required"],
      default: "customer",
    },

    // Contact information
    mobile: {
      countryCode: {
        type: String,
        default: "+880",
      },
      number: {
        type: String,
        trim: true,
      },
    },

    // Authentication methods
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      required: true,
      default: "credentials",
    },

    // For credential-based authentication
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
    },

    city: {
      type: String,
      default: "Dhaka",
    },
    address: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // For Google OAuth
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Shop owner specific fields
    shopName: {
      type: String,
      trim: true,
      required: function () {
        return this.userType === "shopOwner";
      },
    },

    shopProfile: {
      description: String,
      address: String,
      city: String,
      specialization: String,
      banner: String,
      yearEstablished: Number,
      numberOfEmployees: Number,
      brandPartnerships: [String],
      website: String,
      rating: Number,
      verified: {
        type: Boolean,
        default: false,
      },
      logo: String,
      location: String,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // Profile image
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
