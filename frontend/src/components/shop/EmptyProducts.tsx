const EmptyProducts = () => {
  return (
    <div className="py-24 text-center">
      <h2 className="text-3xl font-bold text-purple-900">No Products Found</h2>

      <p className="mt-4 text-gray-600">
        Try changing your search or selecting another category.
      </p>
    </div>
  );
};

export default EmptyProducts;
