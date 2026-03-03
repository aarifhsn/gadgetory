import CategoryGrid from "@/components/shop/CategoryGrid";
import CategorySingle from "@/components/shop/CategorySingle";
import SignInPromo from "@/components/shop/SignInPromo";
import categories from "@/data/categories";

// Server component - receives isLoggedIn from homepage
export default function CategorySection({ isLoggedIn }) {
  // Only show first 3 categories on homepage row
  // The 4th slot is the SignInPromo card
  const visibleCategories = categories.slice(0, 3);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleCategories.map((category) => (
          <div key={category.slug} className="">
            {category.type === "grid" ? (
              <CategoryGrid category={category} />
            ) : (
              <CategorySingle category={category} />
            )}
          </div>
        ))}

        {/* Sign In Promo or Deals card */}
        <SignInPromo isLoggedIn={isLoggedIn} />
      </div>
    </>
  );
}
