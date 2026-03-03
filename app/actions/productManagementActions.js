"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { Types } from "mongoose";

export async function getProducts(filters = {}) {
  const session = await auth();

  try {
    await dbConnect();
    // Build query based on filters
    let query = {};

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      query.category = filters.category;
    }

    // Brand filter (multiple brands)
    if (filters.brands && filters.brands.length > 0) {
      query.brand = { $in: filters.brands };
    }

    // Price range filter
    if (filters.minPrice != null || filters.maxPrice != null) {
      query.price = {};
      if (filters.minPrice !== null) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== null) {
        query.price.$lte = filters.maxPrice;
      }
    }

    // Rating filter
    if (filters.rating) {
      // Get product IDs that have reviews >= rating
      const reviewedProducts = await Review.aggregate([
        { $match: { rating: { $gte: filters.rating } } },
        { $group: { _id: "$productId" } },
      ]);
      const productIds = reviewedProducts.map((r) => r._id);
      query._id = { $in: productIds };
    }

    // Stock filter
    if (filters.inStock === true || filters.inStock === "true") {
      query.stockQuantity = { $gt: 0 }; // stock > 0
    }

    if (filters.preOrder === true || filters.preOrder === "true") {
      query.availability = "Pre-Order";
    }

    // Condition filter
    if (filters.condition) {
      query.condition = filters.condition;
    }

    // Sorting
    let sort = {};
    switch (filters.sort) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "rating":
        sort = { rating: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Fetch products from database
    const products = await Product.find(query).sort(sort).lean();
    // const products = await Product.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
    };
  }
}

export async function getSellerProducts() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await dbConnect();

    const products = await Product.find({
      sellerId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
    };
  }
}

export async function getProductById(productId) {
  try {
    await dbConnect();

    // Validate if the id is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(productId)) {
      return {
        success: false,
        error: "Invalid product ID format",
      };
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error("Get product by ID error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch product",
    };
  }
}

export async function getProductBySlug(slug) {
  try {
    await dbConnect();

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return {
      success: true,
      data: {
        ...product,
        _id: product._id.toString(),
        sellerId: product.sellerId?.toString(),
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(productId, updateData) {
  try {
    await dbConnect();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: updateData.name,
        category: updateData.category,
        brand: updateData.brand,
        condition: updateData.condition.toLowerCase(),
        description: updateData.description,
        price: parseFloat(updateData.price),
        stockQuantity: parseInt(updateData.stockQuantity),
        sku: updateData.sku || `SKU-${Date.now()}`,
        availability: updateData.availability,
        warrantyPeriod: updateData.warrantyPeriod,
        mainImage: updateData.mainImage,
        specifications: updateData.specifications,
      },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      data: {
        message: "Product updated successfully",
        product: JSON.parse(JSON.stringify(updatedProduct)),
      },
    };
  } catch (error) {
    console.error("Update product error:", error);
    return {
      success: false,
      error: error.message || "Failed to update product",
    };
  }
}

export async function deleteProduct(productId) {
  try {
    await dbConnect();

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      data: {
        message: "Product deleted successfully",
      },
    };
  } catch (error) {
    console.error("Delete product error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete product",
    };
  }
}

export async function toggleProductStatus(productId, currentStatus) {
  try {
    await dbConnect();

    // Toggle between "Active" and "Inactive"
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status: newStatus },
      { new: true },
    );

    if (!updatedProduct) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      data: {
        message: `Product ${newStatus === "Active" ? "published" : "unpublished"} successfully`,
        product: JSON.parse(JSON.stringify(updatedProduct)),
        newStatus: newStatus,
      },
    };
  } catch (error) {
    console.error("Toggle product status error:", error);
    return {
      success: false,
      error: error.message || "Failed to update product status",
    };
  }
}

export async function getRelatedProducts(productId, category, limit = 6) {
  try {
    await dbConnect();

    const products = await Product.find({
      _id: { $ne: productId }, // Exclude current product
      category,
      status: "Active",
    })
      .limit(limit)
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.error("Get related products error:", error);
    return { success: false, error: "Failed to fetch related products" };
  }
}

export async function updateProductRatingFromReviews(productId) {
  try {
    await dbConnect();

    const reviews = await Review.find({ productId });

    if (reviews.length === 0) {
      return { success: true, rating: 0, count: 0 };
    }

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    return {
      success: true,
      rating: Math.round(avgRating * 10) / 10,
      count: reviews.length,
    };
  } catch (error) {
    return { success: false };
  }
}
