import Link from "next/link";
import { Button } from "./ui/button";

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center">
      <Button asChild className="px-8 py-4 text-lg font-semibold">
        <Link href="/search">View All Products</Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
