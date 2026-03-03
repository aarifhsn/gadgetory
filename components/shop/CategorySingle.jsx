import Image from "next/image";
import Link from "next/link";

export default function CategorySingle({ category }) {
  return (
    <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20">
      <div>
        <h3 className="text-lg font-bold">{category.name}</h3>
        <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <Image
            src={category.images[0]}
            alt={category.name}
            className="w-full h-full object-cover"
            width={300}
            height={300}
          />
        </div>
      </div>
      <Link
        href={`/category/${category.slug}`}
        className="text-amazon-blue text-sm hover:underline hover:text-red-700 mt-auto"
      >
        {category.linkText}
      </Link>
    </div>
  );
}
