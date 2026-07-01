import { SingleProductType } from "../product";

export type FilterStatetype = {
  filtered_product: SingleProductType[];
  all_products: SingleProductType[];
  featured_product: SingleProductType[];
  grid_view: boolean;
  sort: string;
  openFilter: boolean;
  openSearchBar: boolean;
  filters: FilterType;
  pagination: {
    itemsPerPage: number;
    currentPage: number;
  };
};

export type FilterType = {
  text: string;
  category: string;
  min_price?: number;
  max_price?: number;
  price: number;
  shipping: boolean;
  collection: string;
};

export type FilterActionType = {
  type: string;
  payload?:
    | { products: SingleProductType[] }
    | Pick<FilterStatetype, "sort">
    | { value: string }
    | Record<string, string | boolean | number | null>;
};
