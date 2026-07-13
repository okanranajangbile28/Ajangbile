import { ChangeEvent, KeyboardEvent } from "react";
import { Trash2, Minus, Plus } from "lucide-react";

import { useAppDispatch } from "../../../App/hooks";
import { removeItem, setAmount } from "../cartSlice";

import ImageWithSkeleton from "../../../components/global_components/ImageWithSkeleton";

import { CartItemType } from "../../../types/cart";
import { priceFormat } from "../../../utils/constants";

const CartItem = ({ data }: { data: CartItemType }) => {
  const dispatch = useAppDispatch();

  const { productID, image, productName, price, amount } = data;

  const remove = () => {
    dispatch(removeItem(data));
  };

  const increase = () => {
    dispatch(
      setAmount({
        id: productID,
        value: Number(amount) + 1,
      }),
    );
  };

  const decrease = () => {
    dispatch(
      setAmount({
        id: productID,
        value: Number(amount) <= 1 ? 1 : Number(amount) - 1,
      }),
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.target instanceof HTMLInputElement) {
      let value: number | string = Number(e.target.value);

      value = value < 1 ? "" : value;

      dispatch(
        setAmount({
          id: productID,
          value,
        }),
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}

        <div className="w-full md:w-44 h-44 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
          <ImageWithSkeleton
            src={image}
            alt={productName}
            customStyle="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black text-purple-950">
              {productName}
            </h2>

            <p className="text-gray-500 mt-2">
              Authentic spiritual product from Ajangbile Heritage.
            </p>

            <div className="mt-5 text-3xl font-black text-yellow-600">
              {priceFormat(price)}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-6 mt-8">
            {/* Quantity */}

            <div className="flex items-center border-2 border-purple-200 rounded-2xl overflow-hidden">
              <button
                onClick={decrease}
                className="w-14 h-14 flex justify-center items-center hover:bg-purple-100 transition"
              >
                <Minus size={18} />
              </button>

              <input
                type="number"
                value={amount}
                onChange={handleChange}
                className="w-20 text-center font-bold text-xl outline-none"
              />

              <button
                onClick={increase}
                className="w-14 h-14 flex justify-center items-center hover:bg-purple-100 transition"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Remove */}

            <button
              onClick={remove}
              className="flex items-center gap-3 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-5 py-3 rounded-xl transition font-semibold"
            >
              <Trash2 size={18} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
