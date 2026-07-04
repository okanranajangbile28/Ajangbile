import { Link } from "react-router-dom";
import { links } from "../../../utils/constants";
import { FaShoppingCart } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { closeSidebar } from "../../../features/productFeature/productSlice";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import { useEffect } from "react";
import { countCartTotal } from "../../../features/cartFeature/cartSlice";

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const { isSidebarOpen } = useAppSelector((state) => state.product);

  const { cart, total_items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(countCartTotal());
  }, [cart, dispatch]);

  const navlinks = links.map((x) => (
    <li
      key={x.id}
      className="font-Roboto text-[14px] leading-[16px] text-[#4b0082]"
    >
      <Link to={x.url} onClick={() => dispatch(closeSidebar())}>
        {x.text}
      </Link>
    </li>
  ));

  return (
    <aside
      className={`
        fixed
        inset-y-0
        left-0
        z-[100000]
        w-full
        max-w-[320px]
        bg-white
        rounded-r-xl
        py-7
        px-5
        flex
        flex-col
        gap-8
        shadow-2xl
        transition-transform
        duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="font-Manrope font-bold text-[#4b0082] text-[20px] leading-tight">
        Okanran
        <br />
        Ajangbile
      </div>

      {/* Navigation */}
      <ul className="flex flex-col gap-6">{navlinks}</ul>

      {/* Cart */}
      <Link
        to="/cart"
        onClick={() => dispatch(closeSidebar())}
        className="relative w-fit mt-2 text-[#4b0082]"
      >
        <FaShoppingCart size={20} />

        <span
          className="
            absolute
            -right-3
            -top-2
            w-5
            h-5
            rounded-full
            bg-[#4b0082]
            text-white
            text-[10px]
            flex
            items-center
            justify-center
            font-semibold
          "
        >
          {total_items}
        </span>
      </Link>

      {/* Close Button */}
      <button
        onClick={() => dispatch(closeSidebar())}
        className="
          absolute
          top-5
          right-5
          text-[#4b0082]
          hover:text-red-700
          text-[30px]
        "
      >
        <MdClose />
      </button>
    </aside>
  );
};

export default Sidebar;
