import {
  getProductBySlug,
  getRelatedProducts,
} from "@/app/actions/productManagementActions";
import { getProductReviews } from "@/app/actions/reviewActions";
import {
  getSellerById,
  getSellerProductsCount,
} from "@/app/actions/sellerActions";
import BuyNowSection from "@/components/products/BuyNowSection";
import ImageGallery from "@/components/products/ImageGallery";
import RelatedProductsCard from "@/components/products/RelatedProductsCard";
import ProductTabs from "@/components/shop/ProductTabs";
import { formatSpecifications } from "@/utils/formatSpecifications";
import { Breadcrumbs } from "@/utils/util";
import { Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  // Fetch related products
  const relatedResult = await getRelatedProducts(
    product._id,
    product.category,
    6,
  );
  const relatedProducts = relatedResult.success ? relatedResult.data : [];

  const specsArray = formatSpecifications(product?.specifications);

  const seller = await getSellerById(product.sellerId);

  // Fetch reviews with pagination
  const reviewsResult = await getProductReviews(product._id, {
    page: 1,
    limit: 10,
    sortBy: "recent",
  });

  const reviewsData = reviewsResult.success
    ? reviewsResult.data
    : {
        reviews: [],
        userReview: null,
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalReviews: 0,
          hasMore: false,
        },
      };

  // Calculate average rating from reviews
  const averageRating =
    reviewsData.reviews.length > 0
      ? reviewsData.reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviewsData.reviews.length
      : 0;

  const totalReviews = reviewsData.pagination.totalReviews;

  // Update product with calculated rating
  const productWithRating = {
    ...product,
    rating: averageRating,
    reviews: totalReviews,
  };

  // get products count by seller
  const sellerProductsCount = await getSellerProductsCount(product.sellerId);

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          {
            label: "Laptops & Computers",
            href: "/products?category=laptops",
          },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-5 flex gap-4">
          <ImageGallery product={product} />
        </div>

        {/* Center: Product Info */}
        <div className="lg:col-span-4">
          <h1 className="text-2xl font-normal mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-3">
            Visit Seller Page:
            <Link
              href={`/shops/${product.sellerId}`}
              className="text-amazon-blue hover:underline"
            >
              {" "}
              {seller?.shopName || "Official Store"}
            </Link>
          </p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amazon-secondary">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating || 0) ? "fill-current" : ""
                  }`}
                />
              ))}
            </div>
            <Link
              href={`/products/${product.slug}/#reviews`}
              className="text-sm text-amazon-blue hover:underline cursor-pointer"
            >
              {averageRating} ({totalReviews}{" "}
              {productWithRating.reviews === 1 ? "review" : "reviews"})
            </Link>
          </div>
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-sm">Price:</span>
              <span className="text-3xl text-amazon-orange">
                ৳{product.price}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">Inclusive of all taxes</p>
          </div>
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="font-bold text-base mb-2">About this item</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {specsArray.map((spec, index) => (
                <li key={index}>
                  {spec.label && (
                    <span className="font-semibold">{spec.label}:</span>
                  )}{" "}
                  {spec.value}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm mb-2">
              <span className="font-bold">Category:</span> {product.category}
            </p>
            <p className="text-sm mb-2">
              <span className="font-bold">Brand:</span>{" "}
              <span className="uppercase">{product.brand}</span>
            </p>
            <p className="text-sm">
              <span className="font-bold">Stock:</span>
              <span className="text-green-600 font-semibold">
                {product.stockQuantity} units available
              </span>
            </p>
          </div>
        </div>

        {/* Right: Buy Box */}
        <BuyNowSection product={product} />
      </div>

      {/* Tabs Section */}
      <ProductTabs
        product={product}
        seller={seller}
        reviewsData={reviewsData}
        averageRating={averageRating}
        totalReviews={totalReviews}
        sellerProductsCount={sellerProductsCount}
      />

      {/* Related Products */}
      <RelatedProductsCard products={relatedProducts} />
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result?.success || !result?.data) {
    return {
      title: "Product Not Found | Gadgets BD",
      robots: { index: false, follow: false },
    };
  }

  const product = result.data;

  return {
    title: product.name,
    description:
      product.shortDescription || `Buy ${product.name} online in Bangladesh.`,
  };
}
