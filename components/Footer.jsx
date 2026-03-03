"use client";

export default function Footer() {
  const date = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-amazon-light text-white mt-8">
      <button
        type="button"
        onClick={handleBackToTop}
        className="bg-[#37475A] py-4 text-center hover:bg-[#485769] transition cursor-pointer inline-block w-full"
      >
        <span className="text-sm font-medium">Back to top</span>
      </button>

      <div className="max-w-[1000px] mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-bold mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="about.html" className="hover:underline">
                About Gadgets BD
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="shops.html" className="hover:underline">
                Our Top Brands
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Make Money with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="register.html" className="hover:underline">
                Sell on Gadgets BD
              </a>
            </li>
            <li>
              <a href="create.html" className="hover:underline">
                Supply to Gadgets BD
              </a>
            </li>
            <li>
              <a href="manageList.html" className="hover:underline">
                Become an Affiliate
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Payment Products</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:underline">
                Gadgets BD Business Card
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shop with Points
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Reload Your Balance
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:underline">
                Your Account
              </a>
            </li>
            <li>
              <a href="bookings.html" className="hover:underline">
                Your Orders
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shipping Rates & Policies
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Returns & Replacements
              </a>
            </li>
            <li>
              <a href="forgot-password.html" className="hover:underline">
                Manage Your Content and Devices
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Help
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-600 text-center py-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <span className="text-2xl font-bold tracking-tighter">
            gadgets<span className="italic text-gray-400">BD</span>
          </span>
        </div>
        <p className="text-xs text-gray-400">
          &copy; {date} Gadgets BD - Premium Tech Marketplace. All rights
          reserved by LWS.
        </p>
      </div>
    </footer>
  );
}
