"use server";

import categories from "@/data/categories";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";

export async function getCategoryImages() {
  try {
    await dbConnect();

    // Get the unique dbCategory values from config
    const dbCategoryNames = [...new Set(categories.map((c) => c.value))];

    // Single query — fetch up to 4 latest active products per category
    const products = await Product.aggregate([
      {
        $match: {
          category: { $in: dbCategoryNames },
          status: "Active",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$category",
          images: { $push: "$mainImage" },
        },
      },
      {
        $project: {
          category: "$_id",
          // Take max 4 images (for grid type)
          images: { $slice: ["$images", 4] },
        },
      },
    ]);

    // Convert to a simple map: { "Laptops & Computers": ["img1", "img2", ...] }
    const imageMap = {};
    products.forEach((p) => {
      imageMap[p.category] = p.images;
    });

    return { success: true, data: imageMap };
  } catch (error) {
    console.error("Get category images error:", error);
    return { success: false, error: error.message };
  }
}
