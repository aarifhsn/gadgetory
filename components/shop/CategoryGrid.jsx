import Image from "next/image";
import Link from "next/link";

export default function CategoryGrid({ categories }) {
  return (
    <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20">
      <div>
        <h3 className="text-lg font-bold">{category.name}</h3>
        <div className="grid grid-cols-2 gap-2 h-full">
          {category.images.map((image, index) => (
            <div key={index} className="h-32 overflow-hidden">
              <Image
                src={image}
                alt={`${category.name} ${index + 1}`}
                className="w-full h-full object-cover mb-1"
                width={300}
                height={300}
              />
            </div>
          ))}
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
