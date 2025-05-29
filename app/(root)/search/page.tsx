import ProductCard from "@/components/shared/product/product-card";
import { getAllProducts } from "@/lib/actions/product.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results",
};

const SearchPage = async (props: {
  searchParams: Promise<{
    q: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    page = "1",
    price = "all",
    rating = "all",
    sort = "newest",
  } = await props.searchParams;

  const getFilterUrl = ({q,
    category, sort, price, rating, page
  }: {q? : string; category? : string; sort?: string, price? : string; rating?: string; page? : string}) => {
    const params = {q, category, sort, price, rating, page}

    if(category) params.category = category;
    if(q) params.q = q;
    if(sort) params.sort = sort;
    if(price) params.price = price;
    if(rating) params.rating = rating;
    if(page) params.page = page;

    return `/search?${new URLSearchParams(params)}`;
  }

  const products = await getAllProducts({
    query: q,
    category: category,
    price: price,
    rating: rating,
    page: Number(page),
    sort: sort,
  });

  return <div className="grid md:grid-cols-5 md:gap-5">
    <div className="filter-links">

    </div>
    <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.data.length === 0 && (
                <div>No products found</div>
            )}
            {products.data.map((product) => (
                <ProductCard product={product} key={product.id}/>
            ))}
        </div>
    </div>

  </div> ;
};

export default SearchPage;
