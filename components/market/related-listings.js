import Image from "next/image";

export default function RelatedListings({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-400">No other listings</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10">
      {items.map((item) => (
        <div key={item._id} className="flex flex-col gap-2">
          <div className="relative w-full aspect-[5/3] rounded-md overflow-hidden bg-[var(--color-grey-100)]">
            <Image
              src={item.productImage || "/images/fallback.jpg"}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[1.8rem] font-semibold truncate">{item.title}</p>
            <p className="text-[2rem] text-gray-700">
              {item.price ? `${item.price.toLocaleString()}원` : "Free"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
