import Image from "next/image";

// This is a server component - receives isLoggedIn as prop from parent
export default function SignInPromo({ isLoggedIn }) {
  <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20 justify-between">
    <div className="shrink-0">
      <h2 className="text-xl font-bold">Sign in for the best tech deals</h2>
      <button className="bg-amazon-yellow w-full py-2 rounded-md shadow-sm mt-4 text-sm hover:bg-amazon-yellow_hover">
        Sign in securely
      </button>
    </div>
    <div className="mt-4 grow h-full">
      <Image
        alt="image"
        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500"
        className="w-full h-full object-cover"
        width={500}
        height={500}
      />
    </div>
  </div>;
}
