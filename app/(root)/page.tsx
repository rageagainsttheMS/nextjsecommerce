import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { Product } from "../types";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
const Home = async () => {
  const latestProducts: Product[] = await getLatestProducts();

  const featuredProducts = await getFeaturedProducts();


  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts}/>
      )}
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
      <ViewAllProductsButton/>
    </>
  );
};

export default Home;
