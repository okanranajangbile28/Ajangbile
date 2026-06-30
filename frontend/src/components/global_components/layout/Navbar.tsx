import { links as navlinksData } from '../../../utils/constants';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { openSidebar } from '../../../features/productFeature/productSlice';

const Navbar = () => {
	const location = useLocation();
	const { total_items } = useAppSelector((state) => state.cart);
	const isAdmin = location.pathname.startsWith('/admin');
	const dispatch = useAppDispatch();
	const navlinks = navlinksData.map((data) => (
		<Link
			to={data.url}
			className={`font-semibold font-Open text-[12px] md:text-[14px] lg:text-[16px] leading-[28px] flex items-center
			  ${
					'contact' === data.text.toLowerCase()
						? `py-[4px] lg:py-[8px] px-[24px] md:px-[24px] rounded-[24px] lg:px-[40px] border-2  ${'border-[#4b0082] order-last'}`
						: `hover:border-b-2 ${'text-[#4b0082] hover:border-[#4b0082] '}`
				}`}
			key={data.id}
		>
			{data.text}
		</Link>
	));
	return (
		<div
			className={`top-0 left-0 flex items-center w-full px-[24px] md:px-[50px] xl:px-[100px] justify-between z-[7]`}
		>
			<Link
				to={isAdmin ? '/admin' : '/'}
				className={`font-Manrope text-[20px] sm:text-[28px]  md:text-[36px] leading-[78%] xl:text-[43.25px] font-bold xl-leading-[34px] py-[20px] ${'text-[#4b0082]'}`}
			>
				Okanran
				<br />
				Ajangbile
			</Link>
			{/* <div className='relative w-[25vh] h-[56px] lg:min-w-[360px] max-w-[720px] flex items-center max-md:hidden'>
				<label
					htmlFor='searchBtn'
					// className='text-[20px] text-white w-full flex-end flex items-center gap-[4px] top-1/5 border border-white  absolute'
				>
					<CiSearch />
				</label>
				<input
					id='searchBtn'
					type='text'
					placeholder='Search'
					className={`w-full rounded-[28px] focus:outline-none gap-[10px] flex items-center font-Roboto font-normal text-[16px] leading-[24px] tracking-[0.5px] py-2 px-4 ${
						condition
							? 'placeholder:text-white bg-[rgba(255,255,255,0.08)] text-[#fef7ff]'
							: 'placeholder:text-[#4b0082] bg-[rgba(73,69,79,0.08)] text-[#4b0082]'
					}`}
				/>
			</div> */}
			{isAdmin ? (
				''
			) : (
				<>
					<nav className='flex justify-center items-center p-0 gap-x-[32px] lg:gap-[40px] max-md:hidden'>
						{navlinks}
						<Link
							to={'/cart'}
							className={`order-3 ${'text-[#4b0082] hover:border-[#4b0082] '} text-[16px] p-2 relative`}
						>
							<FaCartShopping />
							<div className='absolute text-[0.75rem] flex items-center font-Manrope justify-center w-[16px] aspect-square right-[-12px] top-[-10px] bg-white py-[2px] px-[10px] font-semibold text-[#4b0082] rounded-[50%]'>
								{total_items}
							</div>
						</Link>
					</nav>
					<div className={`text-[#4b0082] px-[10px] text-[30px] md:hidden`}>
						<button onClick={() => dispatch(openSidebar())}>
							<FaBars />
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default Navbar;
