export default function AuthFooter() {
  return (
    <footer className="mt-auto w-full border-t border-gray-300 bg-gray-50">
      <div className="max-w-[1000px] mx-auto py-6 px-4 text-center text-xs text-gray-600">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="text-amazon-blue hover:underline">
            Conditions of Use
          </a>
          <a href="#" className="text-amazon-blue hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="text-amazon-blue hover:underline">
            Help
          </a>
        </div>
        <p className="text-gray-500">
          &copy; 2025 gadgetory - Premium Tech Marketplace. All rights reserved
          by LWS.
        </p>
      </div>
    </footer>
  );
}
