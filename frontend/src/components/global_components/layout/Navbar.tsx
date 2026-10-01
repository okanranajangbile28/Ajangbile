import { links as navlinksData } from "../../../utils/constants";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import { openSidebar } from "../../../features/productFeature/productSlice";

import { useTranslation } from "../../../translation/TranslationContext";

const Navbar = () => {
  const location = useLocation();
  const { total_items } = useAppSelector((state) => state.cart);
  const isAdmin = location.pathname.startsWith("/admin");
  const dispatch = useAppDispatch();

  const { language, languages, setLanguage } = useTranslation();

  const navlinks = navlinksData.map((data) => (
    <Link
      key={`${data.id}-${data.url}`}
      to={data.url}
      className={`font-semibold font-Open text-[12px] lg:text-[13px] xl:text-[14px] leading-[24px] transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
        data.text.toLowerCase() === "contact"
          ? "py-1.5 px-3 lg:px-4 rounded-full border-2 border-[#4b0082] text-[#4b0082] hover:bg-[#4b0082] hover:text-white"
          : "text-[#4b0082] hover:border-b-2 hover:border-[#4b0082]"
      }`}
    >
      {data.text}
    </Link>
  ));

  return (
    <header className="w-full bg-white z-[100]">
      <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-4">
        {/* ==================== LOGO ==================== */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          data-no-translate="true"
          className="flex items-center gap-0 flex-shrink-0"
        >
          <img
            src="/images/ajangbile-logo.png"
            alt="Àjàngbìlẹ̀ Heritage Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
          />

          <div className="font-Manrope font-bold text-[#4b0082] leading-none">
            <div className="text-[20px] sm:text-[26px] lg:text-[32px]">
              Okanran
            </div>

            <div className="text-[18px] sm:text-[24px] lg:text-[30px]">
              Àjàngbìlẹ̀
            </div>
          </div>
        </Link>

        {!isAdmin && (
          <>
            {/* ==================== DESKTOP NAVBAR ==================== */}
            <nav className="hidden md:flex flex-1 min-w-0 items-center gap-3">
              {/* Navigation Links */}
              <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden">
                <div className="flex items-center justify-end gap-2 lg:gap-3 xl:gap-4 w-max min-w-full pr-1">
                  {navlinks}
                </div>
              </div>

              {/* ==================== DESKTOP LANGUAGE ==================== */}
              <div data-no-translate="true" className="flex-shrink-0">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  aria-label="Select language"
                  className="w-[82px] bg-white border border-[#4b0082] text-[#4b0082] rounded-full px-2 py-2 text-[12px] font-semibold font-Open outline-none cursor-pointer hover:bg-[#4b0082] hover:text-white transition-all duration-200"
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* ==================== DESKTOP CART ==================== */}
              <Link
                to="/cart"
                data-no-translate="true"
                aria-label="Shopping cart"
                className="relative flex-shrink-0 text-[#4b0082] text-[22px] hover:scale-110 transition-transform"
              >
                <FaCartShopping />

                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#4b0082] text-white text-[10px] font-semibold">
                  {total_items}
                </span>
              </Link>
            </nav>

            {/* ==================== MOBILE RIGHT SIDE ==================== */}
            <div className="md:hidden ml-auto flex items-center gap-2">
              {/* MOBILE LANGUAGE */}
              <div data-no-translate="true" className="flex-shrink-0">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  aria-label="Select language"
                  className="w-[70px] h-[38px] bg-white border border-[#4b0082] text-[#4b0082] rounded-full px-2 text-[11px] font-semibold font-Open outline-none cursor-pointer"
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* MOBILE MENU */}
              <button
                onClick={() => dispatch(openSidebar())}
                aria-label="Open menu"
                className="flex items-center justify-center w-[38px] h-[38px] text-[#4b0082] text-[25px] flex-shrink-0"
              >
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
