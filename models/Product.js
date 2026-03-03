import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product Identity
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String, // category slug
      required: [true, "Category is required"],
      index: true,
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["new", "renewed"],
      default: "new",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    // Pricing & Inventory
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    availability: {
      type: String,
      required: [true, "Availability is required"],
      enum: ["In Stock", "Pre-Order", "Out of Stock"],
      default: "In Stock",
    },
    warrantyPeriod: {
      type: String,
      default: "No Warranty",
      enum: ["No Warranty", "6 Months", "1 Year", "2 Years", "3 Years"],
    },

    // Product Images
    mainImage: {
      type: String,
      required: [false, "Main product image is required"],
    },
    additionalImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 4;
        },
        message: "Cannot have more than 4 additional images",
      },
    },

    // Technical Specifications (Optional)
    specifications: {
      processor: String,
      ram: String,
      storage: String,
      displaySize: String,
      otherSpecs: String,
    },

    // Seller Information
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller ID is required"],
    },
    sellerName: {
      type: String,
      required: [true, "Seller name is required"],
    },

    // Product Status
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval might be needed
    },

    // Ratings and Reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // Sales Metrics
    totalSales: {
      type: Number,
      default: 0,
    },

    unitsSold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Prevent model recompilation in Next.js development
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
