import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

const categories = [
  "All",
  "Books",
  "Herbs",
  "Spiritual Materials",
  "Jewelry",
  "Clothing",
  "Accessories",
];

const ProductFilters = ({
  search,
  setSearch,
  category,
  setCategory,
}: Props) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Search */}

        <div className="relative">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        {/* Categories */}

        <div className="flex flex-wrap gap-4 mt-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-6 py-3 rounded-full font-semibold transition ${
                category === item
                  ? "bg-purple-900 text-white"
                  : "bg-gray-100 hover:bg-yellow-400 hover:text-purple-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFilters;
