import Image from "next/image";
import classes from "./ads-section.module.css";
import Link from "next/link";

export default function AdsSection({ list }) {
  return (
    <section className="mb-10">
      <div className={classes.grid}>
        <Link href="/" className="relative w-full aspect-[4/1] flex-shrink-0">
          <Image
            src="/ad/ca-ad-1.jpg"
            alt="ad-image"
            fill
            className="object-cover"
          />
        </Link>
        <Link href="/" className="relative w-full aspect-[4/1] flex-shrink-0">
          <Image
            src="/ad/ca-ad-2.jpg"
            alt="ad-image"
            fill
            className="object-cover"
          />
        </Link>
        <Link href="/" className="relative w-full aspect-[4/1] flex-shrink-0">
          <Image
            src="/ad/ca-ad-3.jpg"
            alt="ad-image"
            fill
            className="object-cover"
          />
        </Link>
        <Link href="/" className="relative w-full aspect-[4/1] flex-shrink-0">
          <Image
            src="/ad/ca-ad-4.jpg"
            alt="ad-image"
            fill
            className="object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
