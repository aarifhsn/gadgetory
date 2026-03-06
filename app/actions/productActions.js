"use server";

import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

import { generateSlug, normalizeEnum, verifyShopOwner } from "@/utils/util";

export async function createProduct(formData) {
  try {
    // 1. Verify authentication and authorization
    const { isAuthorized, user, error: authError } = await verifyShopOwner();

    if (!isAuthorized) {
      return {
        success: false,
        error: authError || "Unauthorized access",
      };
    }

    // 2. Connect to database
    await dbConnect();

    // 3. Extract and generate slug
    const productName = formData.get("name");
    let slug = generateSlug(productName);

    // 4. Check if slug already exists and make it unique
    let counter = 1;
    let finalSlug = slug;
    let slugExists = await Product.findOne({ slug: finalSlug });

    while (slugExists) {
      finalSlug = `${slug}-${counter}`;
      slugExists = await Product.findOne({ slug: finalSlug });
      counter++;
    }

    // 5. Extract form data
    const productData = {
      // Product Identity
      name: productName,
      slug: finalSlug, // Add the unique slug here
      category: formData.get("category"),
      brand: normalizeEnum(formData.get("brand")),
      condition: normalizeEnum(formData.get("condition")),
      description: formData.get("description"),

      // Pricing & Inventory
      price: parseFloat(formData.get("price")),
      stockQuantity: parseInt(formData.get("stockQuantity")),
      sku: formData.get("sku") || undefined,
      availability: formData.get("availability"),
      warrantyPeriod: formData.get("warrantyPeriod"),

      // Product Images
      mainImage: formData.get("mainImage"),
      additionalImages: JSON.parse(formData.get("additionalImages") || "[]"),

      // Technical Specifications
      specifications: {
        processor: formData.get("processor") || undefined,
        ram: formData.get("ram") || undefined,
        storage: formData.get("storage") || undefined,
        displaySize: formData.get("displaySize") || undefined,
        otherSpecs: formData.get("otherSpecs") || undefined,
      },
      status: "Active",

      // Seller Information
      sellerId: user.id || user._id,
      sellerName: user.name || user.email,
    };

    // 6. Validate required fields
    if (!productData.name || !productData.category || !productData.brand) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    if (!productData.price || productData.price <= 0) {
      return {
        success: false,
        error: "Please enter a valid price",
      };
    }

    if (!productData.mainImage) {
      return {
        success: false,
        error: "Please upload a main product image",
      };
    }

    // 7. Create the product
    const newProduct = await Product.create(productData);

    // 8. Revalidate the products list page
    revalidatePath("/seller/products");
    revalidatePath("/products");

    return {
      success: true,
      data: {
        id: newProduct._id.toString(),
        slug: newProduct.slug,
        name: newProduct.name,
        message: "Product created successfully!",
      },
    };
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle duplicate slug error (shouldn't happen, but just in case)
    if (error.code === 11000 && error.keyPattern?.slug) {
      return {
        success: false,
        error:
          "A product with a similar name already exists. Please use a different name.",
      };
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return {
        success: false,
        error: errors.join(", "),
      };
    }

    return {
      success: false,
      error: "Failed to create product. Please try again.",
    };
  }
}

export async function uploadProductImage(file) {
  try {
    // Placeholder implementation
    return {
      success: true,
      url: "/placeholder-image.jpg", // Replace with actual upload logic
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}
