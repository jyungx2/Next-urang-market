import Image from "next/image";

export default function RelatedListings() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10">
      <div className="flex flex-col gap-2">
        <div className="relative w-full aspect-[5/3]">
          <Image
            src="/images/product-2.jpg"
            alt="product"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p>거울</p>
          <p>50,000원</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative w-full aspect-[5/3]">
          <Image
            src="/images/product-3.jpg"
            alt="product"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p>손목시계</p>
          <p>120,000원</p>
        </div>
      </div>
    </div>
  );
}
