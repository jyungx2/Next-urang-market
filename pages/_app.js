import Layout from "@/components/layout/layout";
import { SearchPageContextProvider } from "@/store/searchPage-context";
import { SidebarContextProvider } from "@/store/sidebar-context";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <SearchPageContextProvider>
      <SidebarContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SidebarContextProvider>
    </SearchPageContextProvider>
  );
}
