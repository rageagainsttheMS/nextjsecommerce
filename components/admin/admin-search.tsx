"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const AdminSearch = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');
  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
      ? "/admin/users"
      : "/admin/products";


 useEffect(() => {
    setQueryValue(searchParams.get('query') || '');

 }, [searchParams])

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        className="md:w-[100px] lg:w-[300px]"
        onChange={(e) => setQueryValue(e.target.value)}
      />
    <Button className="sr-only" type="submit">
        Search
    </Button>
    </form>
  );
};

export default AdminSearch;
