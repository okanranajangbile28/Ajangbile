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
      className={`font-semibold font-Open text-[14px] lg:text-[16px] leading-[28px] flex items-center transition-all duration-200 ${
        data.text.toLowerCase() === "contact"
          ? "py-[8px] px-[28px] lg:px-[40px] rounded-full border-2 border-[#4b0082] hover:bg-[#4b0082] hover:text-white"
          : "text-[#4b0082] hover:border-b-2 hover:border-[#4b0082]"
      }`}
    >
      {data.text}
    </Link>
  ));

  return (
    <header className="w-full z-[7]">
      <div className="flex items-center justify-between w-full px-6 md:px-12 xl:px-24 py-5">
        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="font-Manrope font-bold text-[#4b0082] text-[22px] sm:text-[30px] md:text-[38px] xl:text-[44px] leading-[0.9] flex-shrink-0"
        >
          Okanran
          <br />
          Ajangbile
        </Link>

        {!isAdmin && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-6 xl:ml-10 gap-8 lg:gap-10 xl:gap-12">
              {navlinks}

              <Link
                to="/cart"
                className="relative text-[#4b0082] text-[20px] hover:scale-110 transition-transform"
              >
                <FaCartShopping />

                <span className="absolute -right-3 -top-3 flex items-center justify-center w-5 h-5 rounded-full bg-[#4b0082] text-white text-[11px] font-semibold">
                  {total_items}
                </span>
              </Link>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden text-[#4b0082] text-[30px]">
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
