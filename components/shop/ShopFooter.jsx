export default function ShopFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto py-6 bg-white border-t border-gray-300">
      <div className="max-w-[1200px] mx-auto text-center text-xs text-gray-500">
        <p>
          &copy; {year} Gadgets BD Seller Central. All rights reserved by LWS.
        </p>
      </div>
    </footer>
  );
}
