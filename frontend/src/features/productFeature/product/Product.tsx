import { Link, useLocation } from 'react-router-dom';
import { priceFormat } from '../../../utils/constants';

// import { BiCartAdd } from 'react-icons/bi';

import { SingleProductType } from '../../../types/product';
import ImageWithSkeleton from '../../../components/global_components/ImageWithSkeleton';

const Product = ({
	images,
	_id: id,
	productName: name,
	price,
	// totalQuantity,
	// isNew,
	customStyle,
}: SingleProductType & { customStyle?: string }) => {
	const location = useLocation();
	const isAdmin = location.pathname.startsWith('/admin');
	return (
		<Link
			to={`${isAdmin ? `/admin/product/${id}` : `/shop/${id}`}`}
			className={`flex flex-col isolate bg-[#EFEBE7] hover:bg-[rgba(75,0,130,0.87)] max-[430px]:h-[250px] rounded-[4px] aspect-[297/411] h-full xs:w-[297px] xs:h-[411px] text-[#4b0082] hover:text-white ${customStyle}`}
		>
			<div className='rounded-l-[6px] rounded-t-[6px] z-[1000] h-[70%] flex items-start aspect-square min-w-full relative'>
				{/* <img
					src={images[0]}
					alt=''
					className='h-full w-full object-cover'
				/> */}
				<ImageWithSkeleton
					src={images[0]}
					alt=''
					customStyle='h-full w-full object-cover'
				/>
			</div>
			<div className='flex justify-between items-center px-[10px] lg:px-[14px] gap-[8px] lg:gap-[10px] my-auto w-full'>
				<div className='flex flex-col gap-[10px] justify-center w-[60%] sm:w-[4/5]'>
					<div
						className='font-Monda leading-[21px] text-[12px] lg:text-[16px] capitalize whitespace-nowrap overflow-hidden overflow-ellipsis'
						title={name}
					>
						{name}
					</div>
					<div className='flex gap-[4px] font-Monda font-semibold text-[14px] lg:text-[18px] leading-[20px] capitalize '>
						{priceFormat(price)}
					</div>
				</div>
				{/* {!isAdmin && (
					<button className='text-[16px] lg:text-[24px] flex justify-center items-center py-[12px] px-[12px] lg:px-[24px] gap-[8px] bg-[#cdcdcd] rounded-[8px] font-Inter leading-[16px] text-[#2c2c2c]' onClick={()=>{dispatch(addToCart({props}))}}>
						<BiCartAdd />
					</button>
				)} */}
			</div>
		</Link>
	);
};

export default Product;
