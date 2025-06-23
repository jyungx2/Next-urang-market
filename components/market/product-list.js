import ProductItem from "@/components/market/product-item";
import { useRouter } from "next/router";

export default function ProductList({ products }) {
  const router = useRouter();

  const linkToproductDetailPageHandler = (productId, rcode) => {
    router.push({ pathname: `/market/${productId}`, query: { rcode } });
  };

  return (
    <>
      {/* 너비 100%는 block 상속 때문 (ul은 기본적으로 block 요소고, 가로로 100% 너비를 갖고 있음, 따라서 li에 w-full을 주면 → ul의 전체 너비를 상속해서 쭉 늘어남) */}
      {/* 높이 정렬은 flexbox의 기본값(stretch) 때문 */}
      <ul className="flex flex-col gap-10">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex gap-8 bg-[var(--color-primary-50)] rounded-2xl px-4 py-8 cursor-pointer"
            onClick={() =>
              linkToproductDetailPageHandler(product._id, product.rcode)
            }
          >
            <ProductItem
              key={product._id}
              productImage={product.productImage}
              title={product.title}
              price={product.price}
              type={product.type}
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
