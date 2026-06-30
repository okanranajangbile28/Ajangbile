// import { FaMinus, FaPlus } from 'react-icons/fa6';
import { priceFormat } from '../utils/constants';
// import { mockProduct1 } from '../assets';
import SuggestedProducts from '../features/productFeature/product/SuggestedProducts';
import { AddToCart } from '../features/cartFeature/cart';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../App/hooks';
import { useParams } from 'react-router-dom';
import { fetchSingleProduct } from '../features/productFeature/productSlice';
import { Loading } from '../components/global_components';
import ImageWithSkeleton from '../components/global_components/ImageWithSkeleton';

const SingleProductPage = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const { single_product, single_product_loading } = useAppSelector(
		(state) => state.product
	);

	useEffect(() => {
		document.title = `Okanran Ajangbile | ${single_product.productName}`;
	}, [single_product.productName]);

	useEffect(() => {
		dispatch(fetchSingleProduct(id!));
	}, [id]);
	return single_product_loading ? (
		<Loading />
	) : (
		<div className='flex flex-col pt-[20px] pb-[80px] bg-white'>
			<div className='flex flex-col items-center pt-[24px] px-[10px] pr-[10px] gap-[24px] bg-white'>
				<div className='grid md:grid-cols-2 pt-[24px] px-[12px] sm:px-[24px] md:pr-[52px] pb-[24px] md:pl-[53px] gap-[24px] md:gap-[82px] justify-between'>
					<div className='flex flex-col gap-[16px]'>
						<div className='rounded-[4px] aspect-square w-full md:min-w-[300px] xl:max-w-[509px] xl:max-h-[509px] relative'>
							<ImageWithSkeleton
								src={single_product.images[0]}
								alt=''
								customStyle='w-full h-full object-contain'
							/>
						</div>
						<div className='grid grid-cols-4 items-center gap-[16px]'>
							{/* variation block */}
							<div className='rounded-[4px] w-full min-h-[50px] aspect-square md:min-h-[109px] relative'>
								<ImageWithSkeleton
									src={single_product.images[0]}
									alt=''
									customStyle='object-cover'
								/>
							</div>
						</div>
					</div>
					<div className='flex flex-col gap-[18px]'>
						<div className='flex flex-col gap-[12px]'>
							<div className='flex flex-col'>
								{/* <div className='font-Open text-[20px] leading-[32px] text-[rgba(0,0,0,0.6)] items-center flex'>
									Products
								</div> */}
								<div className='font-Manrope font-semibold text-[22px] leading-[100%] sm:leading-[60px] flex items-center text-[#ccb0e0]'>
									{single_product.productName}
								</div>
							</div>
							<div className='flex flex-col gap-[4px]'>
								<div className='font-Manrope font-extrabold text-[24px] md:text-[32px] leading-[60px] text-black'>
									{priceFormat(single_product.price)}
								</div>
								<div className='font-Open text-[14px] md:text-[18px] leading-[32px] flex items-center text-[rgba(134,68,180,0.7)]'>
									{single_product.description}
								</div>
							</div>
						</div>
						{/* <div className='flex flex-col justify-center items-start gap-[12px]'>
							<div className='flex justify-between w-full font-Manrope font-extrabold text-[22px] leading-[19px] text-[#4b0082] capitalize'>
								<div>count</div>
								{single_product.unit && (
									<div className='text-[16px]'>Per {single_product.unit}</div>
								)}
							</div>
							<div className='flex justify-center items-center p-[24px] gap-[8px] bg-[rgba(237,229,229,0.4)] rounded-[4px] w-full'>
								<div className='flex justify-center items-center p-[10px] gap-[10px] text-[14px] text-black'>
									<FaMinus />
								</div>
								<div className='justify-center items-center py-[4px] px-[11px] gap-[10px] border-2 border-black rounded-[4px]'>
									<input
										type='number'
										className='bg-transparent w-[35px] text-center focus:outline-none'
									/>
								</div>
								<div className='flex justify-center items-center p-[10px] gap-[10px] text-[14px] text-black'>
									<FaPlus />
								</div>
							</div>
						</div> */}
						<AddToCart product={single_product} />
					</div>
				</div>
			</div>
			<SuggestedProducts />
		</div>
	);
};

export default SingleProductPage;
