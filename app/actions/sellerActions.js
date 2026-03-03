"use server";

import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";

export async function getShops(page = 1, limit = 9) {
  try {
    await dbConnect();

    const skip = (page - 1) * limit;

    // Find all users who are shop owners
    const shops = await User.find({ userType: "shopOwner", isActive: true })
      .select("name email shopName shopProfile avatar createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalShops = await User.countDocuments({
      userType: "shopOwner",
      isActive: true,
    });

    // Get product count and rating for each shop
    const shopsWithStats = await Promise.all(
      shops.map(async (shop) => {
        const productCount = await Product.countDocuments({
          sellerId: shop._id,
        });

        // Calculate average rating from shop's products
        const products = await Product.find({ sellerId: shop._id })
          .select("rating reviews")
          .lean();

        const totalRatings = products.reduce(
          (sum, p) => sum + (p.reviews || 0),
          0,
        );
        const avgRating =
          products.length > 0
            ? products.reduce((sum, p) => sum + (p.rating || 0), 0) /
              products.length
            : 0;

        return {
          _id: shop._id.toString(),
          name: shop.name,
          email: shop.email,
          shopName: shop.shopName,
          shopDescription: shop.shopProfile?.description,
          shopLogo: shop.shopProfile?.logo || shop.avatar,
          shopBanner: shop.shopProfile?.banner,
          location: shop.shopProfile?.location || shop.shopProfile?.city,
          createdAt: shop.createdAt,
          productCount,
          totalRatings,
          avgRating: Math.round(avgRating * 10) / 10,
        };
      }),
    );

    return {
      success: true,
      data: shopsWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalShops / limit),
        totalShops,
        hasMore: skip + shops.length < totalShops,
      },
    };
  } catch (error) {
    console.error("Error fetching shops:", error);
    return {
      success: false,
      error: "Failed to fetch shops",
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalShops: 0,
        hasMore: false,
      },
    };
  }
}

export async function getShopById(shopId) {
  try {
    await dbConnect();

    const shop = await User.findOne({
      _id: shopId,
      userType: "shopOwner",
      isActive: true,
    })
      .select("name email shopName shopProfile avatar createdAt")
      .lean();

    if (!shop) {
      return {
        success: false,
        error: "Shop not found",
      };
    }

    // Get shop's products
    const products = await Product.find({ sellerId: shop._id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate stats
    const totalRatings = products.reduce((sum, p) => sum + (p.reviews || 0), 0);
    const avgRating =
      products.length > 0
        ? products.reduce((sum, p) => sum + (p.rating || 0), 0) /
          products.length
        : 0;

    return {
      success: true,
      data: {
        shop: {
          _id: shop._id.toString(),
          name: shop.name,
          email: shop.email,
          shopName: shop.shopName,
          shopDescription: shop.shopProfile?.description,
          shopLogo: shop.shopProfile?.logo || shop.avatar,
          shopBanner: shop.shopProfile?.banner,
          location: shop.shopProfile?.location || shop.shopProfile?.city,
          website: shop.shopProfile?.website,
          verified: shop.shopProfile?.verified,
          yearEstablished: shop.shopProfile?.yearEstablished,
          specialization: shop.shopProfile?.specialization,
          createdAt: shop.createdAt,
        },
        products: JSON.parse(JSON.stringify(products)),
        stats: {
          totalProducts: products.length,
          totalRatings,
          avgRating: Math.round(avgRating * 10) / 10,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching shop:", error);
    return {
      success: false,
      error: "Failed to fetch shop",
    };
  }
}

export async function getSellerById(sellerId) {
  try {
    await dbConnect();

    const seller = await User.findById(sellerId)
      .select("name shopName shopProfile avatar createdAt")
      .lean();

    if (!seller) return null;

    return {
      id: seller._id.toString(),
      name: seller.name,
      shopName: seller.shopName,
      shopProfile: seller.shopProfile,
      avatar: seller.avatar,
      createdAt: seller.createdAt,
    };
  } catch (error) {
    console.error("Error fetching seller:", error);
    return null;
  }
}

export async function getSellerProductsCount(sellerId) {
  try {
    await dbConnect();

    const count = await Product.countDocuments({ sellerId });
    return count;
  } catch (error) {
    console.error("Error fetching seller products count:", error);
    return 0;
  }
}
