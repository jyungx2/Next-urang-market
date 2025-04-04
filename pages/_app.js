import Layout from "@/components/layout/layout";
import { UIContextProvider } from "@/store/ui-context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  // 페이지에 getLayout이 있으면 그걸 사용, 없으면 기본적으로 그냥 렌더링(<Layout/>으로 감싸지 않고 페이지 자체만 렌더링해 메인네비 안보이도록..)
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <UIContextProvider>
      {getLayout(<Component {...pageProps} />)}
    </UIContextProvider>
  );
}
