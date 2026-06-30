import { Link } from 'react-router-dom';
import { links } from '../../../utils/constants';
import { FaShoppingCart } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { closeSidebar } from '../../../features/productFeature/productSlice';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { useEffect } from 'react';
import { countCartTotal } from '../../../features/cartFeature/cartSlice';

const Sidebar = () => {
	const dispatch = useAppDispatch();
	const { isSidebarOpen } = useAppSelector((state) => state.product);
	const { cart, total_items } = useAppSelector((state) => state.cart);
	useEffect(() => {
		dispatch(countCartTotal());
	}, [cart]);
	const navlinks = links.map((x) => (
		<li
			key={x.id}
			className='font-Roboto text-[14px] leading-[16px] text-[#4b0082]'
		>
			<Link
				to={x.url}
				onClick={() => dispatch(closeSidebar())}
			>
				{x.text}
			</Link>
		</li>
	));

	return (
		<aside
			className={`transition ${
				isSidebarOpen ? '' : '-translate-x-full'
			} flex flex-col py-[28px] px-[20px] gap-[32px] bg-white rounded-[5px] w-screen z-[100000] absolute top-0`}
		>
			<div className='font-Manrope font-bold text-[14px] leading-[11px] flex items-center text-[#4b0082]'>
				Okanran
				<br />
				Ajangbile
			</div>
			<ul className='flex flex-col gap-[24px]'>{navlinks}</ul>
			<Link
				to={'/cart'}
				className='font-Roboto text-[14px] leading-[16px] text-[#4b0082] w-fit relative mt-4'
				onClick={() => dispatch(closeSidebar())}
			>
				<FaShoppingCart />

				<div className='absolute text-[0.75rem] flex items-center font-Manrope justify-center w-[16px] aspect-square right-[-16px] top-[-10px] bg-white font-semibold text-[#4b0082] rounded-[50%]'>
					{total_items}
				</div>
			</Link>
			<div className='absolute right-5 text-[#4b0082] font-extrabold hover:cursor-pointer hover:text-red-700 top-5 text-[30px]'>
				<button onClick={() => dispatch(closeSidebar())}>
					<MdClose />
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
