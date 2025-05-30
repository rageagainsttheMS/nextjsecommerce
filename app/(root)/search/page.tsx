import ProductCard from "@/components/shared/product/product-card";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import Link from "next/link";
import { Button } from '@/components/ui/button';

export async function generateMetadata(props : {
      searchParams : Promise<{q : string; price : string; category : string; rating : string}>
    }){
      const { q = 'all', category = 'all', price = 'all', rating = 'all' } = await props.searchParams;
      
      const isQuerySet = q && q !== 'all' && q.trim() !== '';
      const isCategorySet = category && category !== 'all' && category.trim() !== '';
      const isPriceSet = price && price !== 'all' && price.trim() !== '';
      const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

      if(isQuerySet || isCategorySet || isPriceSet || isRatingSet){
        return {
          title : `Search ${isQuerySet ? q : ''} ${isCategorySet ? category : ''} ${isPriceSet ? price : ''} ${isRatingSet ? rating : ''}`
        }
      } else {
        return {
          title : 'Search'
        }
      }
    }

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

  const getFilterUrl = ({
    q,
    category,
    sort,
    price,
    rating,
    page,
  }: {
    q?: string;
    category?: string;
    sort?: string;
    price?: string;
    rating?: string;
    page?: string;
  }) => {
    const params = {
      q: "",
      category: "",
      sort: "",
      price: "",
      rating: "",
      page: "1",
    };

    if (category) params.category = category;
    if (q) params.q = q;
    if (sort) params.sort = sort;
    if (price) params.price = price;
    if (rating) params.rating = rating;
    if (page) params.page = page;

    return `/search?${new URLSearchParams(params)}`;
  };

  const products = await getAllProducts({
    query: q,
    category: category,
    price: price,
    rating: rating,
    page: Number(page),
    sort: sort,
  });

  const categories = await getAllCategories();

  const prices = [
    {
      name: "$1 to $50",
      value: "1-50",
    },
    {
      name: "$51 to $100",
      value: "51-100",
    },
    {
      name: "$101 to $200",
      value: "101-200",
    },
  ];

    const ratings = [4,3,2,1];

    const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(category === "all" || category === "") && "font-bold"}`}
                href={getFilterUrl({ category: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${category === x.category && "font-bold"}`}
                  href={getFilterUrl({ category: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-3">Prices</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(price === "all") && "font-bold"}`}
                href={getFilterUrl({ price: "all" })}
              >
                Any
              </Link>
            </li>
            {prices.map((x) => (
              <li key={x.value}>
                <Link
                  className={`${price === x.value && "font-bold"}`}
                  href={getFilterUrl({ price: x.value })}
                >
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-3">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(rating === "all") && "font-bold"}`}
                href={getFilterUrl({ rating: "all" })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && "font-bold"}`}
                  href={getFilterUrl({ rating: r.toString()})}
                >
                  {`${r} stars and up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
            <div className="flex items-center">
              {q !== 'all' && q !== '' && 'Query: ' + q}
              {category !== 'all' && category !== '' && 'Category: ' + category}
              {price !== 'all' && price !== '' && 'Price: ' + price}
              {rating !== 'all' && rating !== '' && 'Rating : ' + rating + ' stars and up'}
              &nbsp;
              {(q !== 'all' && q !== '') || 
                (category !== 'all' && category !== '') ||
                rating !== 'all' || price !== 'all' ? (
                  <Button asChild variant ='link'>
                    <Link href='/search'>Clear</Link>
                  </Button>
                ) : null}
            </div>
            <div>
              Sort by {' '}
              {sortOrders.map((s) => (
                <Link key={s} className={`mx-2 ${sort === s && 'font-bold'}`} href={getFilterUrl({sort : s})}>
                  {s}
                </Link>
              ))}
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
