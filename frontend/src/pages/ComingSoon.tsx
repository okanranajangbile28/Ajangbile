const ComingSoon = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[rgba(75,0,130,0.05)] px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#4b0082] mb-6">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-gray-700 leading-8">{message}</p>

        <div className="mt-10">
          <span className="inline-block px-6 py-3 rounded-full bg-[#4b0082] text-white font-semibold">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
