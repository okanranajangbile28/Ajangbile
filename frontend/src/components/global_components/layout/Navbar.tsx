import { links as navlinksData } from "../../../utils/constants";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import { openSidebar } from "../../../features/productFeature/productSlice";

const Navbar = () => {
  const location = useLocation();
  const { total_items } = useAppSelector((state) => state.cart);
  const isAdmin = location.pathname.startsWith("/admin");
  const dispatch = useAppDispatch();

  const navlinks = navlinksData.map((data) => (
    <Link
      key={data.id}
      to={data.url}
      className={`font-semibold font-Open text-[14px] lg:text-[15px] leading-[28px] transition-all duration-200 whitespace-nowrap ${
        data.text.toLowerCase() === "contact"
          ? "py-2 px-6 lg:px-8 rounded-full border-2 border-[#4b0082] text-[#4b0082] hover:bg-[#4b0082] hover:text-white"
          : "text-[#4b0082] hover:border-b-2 hover:border-[#4b0082]"
      }`}
    >
      {data.text}
    </Link>
  ));

  return (
    <header className="w-full bg-white z-[100]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="flex items-center gap-0 flex-shrink-0"
        >
          <img
            src="/images/ajangbile-logo.png"
            alt="Ajangbile Heritage Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
          />

          <div className="font-Manrope font-bold text-[#4b0082] leading-none">
            <div className="text-[20px] sm:text-[26px] lg:text-[32px]">
              Okanran
            </div>

            <div className="text-[18px] sm:text-[24px] lg:text-[30px]">
              Ajangbile
            </div>
          </div>
        </Link>

        {!isAdmin && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-end items-center gap-5 lg:gap-7 xl:gap-8 min-w-0">
              {navlinks}

              <Link
                to="/cart"
                className="relative text-[#4b0082] text-[22px] hover:scale-110 transition-transform flex-shrink-0"
              >
                <FaCartShopping />

                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#4b0082] text-white text-[10px] font-semibold">
                  {total_items}
                </span>
              </Link>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden text-[#4b0082] text-3xl">
              <button onClick={() => dispatch(openSidebar())}>
                <FaBars />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
