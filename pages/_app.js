import Layout from "@/components/layout/layout";
import { UIContextProvider } from "@/store/ui-context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <UIContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UIContextProvider>
  );
}
