import ProductItem from "@/components/market/product-item";
import { useRouter } from "next/router";

export default function ProductList({ products }) {
  const router = useRouter();

  const linkToproductDetailPageHandler = (productId) => {
    router.push(`/market/${productId}`);
  };

  return (
    <>
      <ul className="flex flex-col gap-10">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex gap-8 bg-[var(--color-primary-50)] rounded-2xl px-4 py-8 cursor-pointer"
            onClick={() => linkToproductDetailPageHandler(product._id)}
          >
            <ProductItem
              key={product._id}
              productImage={product.productImage}
              title={product.title}
              price={product.price}
              description={product.description}
              createdAt={product.createdAt}
              location={product.location}
              // chatNum={product.chatNum}
              // likeNum={product.likeNum}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

{
  /* <Link
  href={{ pathname: "/market/[id]", query: { id: product.id } }}
  onClick={toggleProductPage}
></Link>; */
}
