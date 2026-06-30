import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

import { priceFormat } from '../../../utils/constants';

import { CartItemType } from '../../../types/cart';
import { useAppDispatch } from '../../../App/hooks';
import { removeItem, setAmount } from '../cartSlice';
import { ChangeEvent, KeyboardEvent } from 'react';
import ImageWithSkeleton from '../../../components/global_components/ImageWithSkeleton';

const CartItem = ({ data }: { data: CartItemType }) => {
	const { productID, image, productName, price, amount } = data;
	const dispatch = useAppDispatch();
	const deleteCart = () => {
		dispatch(removeItem(data));
	};

	const handleChange = (
		e: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
	) => {
		if (e.target instanceof HTMLInputElement) {
			let value: number | string = +e.target.value;
			value = value < 1 ? '' : Number(value);

			dispatch(setAmount({ id: productID, value }));
		}
	};

	const increase = () => {
		dispatch(
			setAmount({
				id: productID,
				value: Number(amount) + 1,
			})
		);
	};
	const decrease = () => {
		dispatch(
			setAmount({
				id: productID,
				value: Number(amount) - 1 < 1 ? 1 : Number(amount) - 1,
			})
		);
	};

	return (
		<div className='flex flex-col gap-[8px]'>
			<div className='flex gap-[10px] sm:gap-[16px] lg:gap-[24px] h-[150px]'>
				<div className='aspect-square h-[150px] rounded-[4px] relative'>
					<ImageWithSkeleton
						src={image}
						alt=''
						customStyle='object-cover'
					/>
				</div>
				<div className='flex flex-col justify-between w-full'>
					<div className='flex items-center justify-between gap-[24px] sm:gap-[48px] lg:gap-[93px]'>
						<div className='font-Manrope font-bold sm:text-[18px] lg:text-[24px] leading-[150%]  text-[#4b0082]'>
							{productName}
						</div>
						<div className='font-Manrope font-extrabold text-[16px] sm:text-[24px] lg:text-[32px] leading-[150%] text-black'>
							{priceFormat(price)}
						</div>
					</div>
					<div className='flex flex-col justify-between py-[10px] gap-[8px] relative group'>
						{/* <div className='font-Manrope font-extrabold text-[22px] leading-[19px] text-[rgba(75,0,130,0.7)] capitalize'>
							count
						</div> */}
						<button
							className='self-end text-[16px] text-[#4b0082] group-hover:text-rose-700'
							onClick={deleteCart}
						>
							<FaTrash />
						</button>
						<div className='flex relative justify-center items-center px-[10px] gap-[8px] bg-[rgba(237,229,229,0.4)] rounded-[4px]'>
							<button
								className='p-[10px] text-[14px]'
								onClick={decrease}
							>
								<FaMinus />
							</button>
							<div className='flex items-center justify-center gap-[10px] rounded-[4px]'>
								<input
									type='number'
									className='bg-transparent focus:outline-none text-center text-[24px] h-[40px] py-[14px] w-[80px] font-semibold'
									value={amount}
									onChange={handleChange}
								/>
							</div>
							<button
								className='p-[10px] text-[14px]'
								onClick={increase}
							>
								<FaPlus />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
