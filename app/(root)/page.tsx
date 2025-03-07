import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { Product } from "../types";
const Home = async () => {
  const latestProducts: Product[] = await getLatestProducts();
  return <ProductList data={latestProducts} title='Newest Arrivals' limit={LATEST_PRODUCTS_LIMIT}/>
}
 
export default Home;