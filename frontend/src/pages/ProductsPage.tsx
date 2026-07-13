import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../App/hooks";

import {
  updateFilters,
  updatePageChange,
} from "../features/filterFeature/filterSlice";

import ProductHero from "../components/shop/ProductHero";
import ProductFilters from "../components/shop/ProductFilters";
import ProductGrid from "../components/shop/ProductGrid";
import EmptyProducts from "../components/shop/EmptyProducts";
import ProductSkeleton from "../components/shop/ProductSkeleton";

import Pagination from "../components/Pagination";

const ProductsPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const { filtered_product, filters, pagination } = useAppSelector(
    (state) => state.filter,
  );

  const { products_loading, products_error } = useAppSelector(
    (state) => state.product,
  );

  useEffect(() => {
    document.title = "Ajangbile Heritage | Shop";
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");

    if (category) {
      dispatch(
        updateFilters({
          name: "category",
          value: category.toLowerCase(),
        }),
      );
    }
  }, [dispatch, searchParams]);

  const setSearch = (value: string) => {
    dispatch(
      updateFilters({
        name: "text",
        value: value.toLowerCase(),
      }),
    );
  };

  const setCategory = (value: string) => {
    const category = value.toLowerCase();

    dispatch(
      updateFilters({
        name: "category",
        value: category,
      }),
    );

    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }

    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHero />

      <ProductFilters
        search={filters.text}
        setSearch={setSearch}
        category={filters.category}
        setCategory={setCategory}
      />

      <section className="max-w-7xl mx-auto px-6 pb-20">
        {products_loading ? (
          <ProductSkeleton />
        ) : products_error ? (
          <div className="py-24 text-center text-red-600 font-semibold">
            Something went wrong while loading products.
          </div>
        ) : filtered_product.length === 0 ? (
          <EmptyProducts />
        ) : (
          <>
            <ProductGrid products={filtered_product} />

            <div className="mt-14 flex justify-center">
              <Pagination
                totalItems={filtered_product.length}
                itemsPerPage={pagination.itemsPerPage}
                currentPage={pagination.currentPage}
                onPageChange={(page) => dispatch(updatePageChange(page))}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
