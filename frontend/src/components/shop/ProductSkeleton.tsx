const ProductSkeleton = () => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl overflow-hidden shadow animate-pulse"
        >
          <div className="aspect-square bg-gray-300"></div>

          <div className="p-6 space-y-4">
            <div className="h-5 bg-gray-300 rounded"></div>

            <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
