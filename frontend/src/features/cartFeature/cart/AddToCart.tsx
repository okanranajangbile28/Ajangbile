import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ShoppingCart, ShieldCheck, Truck } from "lucide-react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch } from "../../../App/hooks";
import { addToCart } from "../../cartFeature/cartSlice";

import { SingleProductType } from "../../../types/product";

const AddToCart = ({ product }: { product: SingleProductType }) => {
  const { _id: id } = product;

  const [amount, setAmount] = useState(1);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const increase = () => setAmount((prev) => prev + 1);

  const decrease = () => {
    if (amount > 1) {
      setAmount((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (id) {
      dispatch(
        addToCart({
          id,
          amount,
          product,
        }),
      );

      navigate("/cart");
    }
  };

  return (
    <div className="space-y-8">
      {/* Quantity */}

      <div>
        <h3 className="text-lg font-bold text-purple-950 mb-4">Quantity</h3>

        <div className="inline-flex items-center border-2 border-purple-200 rounded-2xl overflow-hidden">
          <button
            onClick={decrease}
            className="w-14 h-14 text-xl hover:bg-purple-100 transition"
          >
            −
          </button>

          <div className="w-16 text-center text-xl font-bold">{amount}</div>

          <button
            onClick={increase}
            className="w-14 h-14 text-xl hover:bg-purple-100 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Button */}

      <button
        onClick={handleAddToCart}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-purple-950 rounded-2xl py-5 font-black text-lg transition flex justify-center items-center gap-3 shadow-lg hover:shadow-xl"
      >
        <ShoppingCart size={22} />
        Add To Cart
      </button>

      {/* Features */}

      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center gap-3 text-gray-700">
          <ShieldCheck className="text-green-600" size={20} />
          Secure Checkout
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Truck className="text-purple-900" size={20} />
          Nationwide Delivery
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
};

export default AddToCart;
