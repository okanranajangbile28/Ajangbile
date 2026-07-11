import { Link } from "react-router-dom";

const IlediAjangbile = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#4b0082] mb-6">
          Iledi Ajangbile
        </h1>

        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-8">
          Welcome to the official members' portal of Iledi Ajangbile. Existing
          members can log in to access exclusive resources, while new members
          who have already been approved can create their accounts here.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-20">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-bold text-[#4b0082] mb-4">Login</h2>

          <p className="text-gray-600 mb-8">Access your member dashboard.</p>

          <Link
            to="/login"
            className="inline-block bg-[#4b0082] text-white px-8 py-3 rounded-full hover:bg-purple-900 transition"
          >
            Login
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-bold text-[#4b0082] mb-4">Sign Up</h2>

          <p className="text-gray-600 mb-8">
            Create your account after your application has been approved.
          </p>

          <Link
            to="/signup"
            className="inline-block border-2 border-[#4b0082] text-[#4b0082] px-8 py-3 rounded-full hover:bg-[#4b0082] hover:text-white transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IlediAjangbile;
