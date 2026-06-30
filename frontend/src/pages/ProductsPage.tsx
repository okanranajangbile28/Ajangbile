import { Link, useSearchParams } from 'react-router-dom';
import GridView from '../features/productFeature/product/GridView';
import { productCategory } from '../utils/constants';
import { FaPlus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../App/hooks';
import Pagination from '../components/Pagination';
import {
	updateFilters,
	updatePageChange,
} from '../features/filterFeature/filterSlice';
import { Loading } from '../components/global_components';
import { ChangeEvent, useEffect } from 'react';

const ProductsPage = ({ admin }: { admin?: boolean }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useAppDispatch();
	useEffect(() => {
		document.title = 'Okanran Ajangbile | Product';
	}, []);
	const { filtered_product, pagination, filters } = useAppSelector(
		(state) => state.filter
	);
	const { products_loading, products_error } = useAppSelector(
		(state) => state.product
	);
	const tabs = productCategory.map((tab, index) => {
		return (
			<option
				key={index}
				className='cursor-pointer flex flex-col justify-center items-center p-[8px] bg-white font-DM tabsEffect font-medium text-[16px] leading-[18px] text-center tracking-[0.05em]  text-[#4b0082] hover:underline underline-offset-8 h-full'
				value={tab.value.toLowerCase()}
			>
				{tab.title}
			</option>
		);
	});

	const onPageChange = (index: number) => {
		dispatch(updatePageChange(index));
	};
	useEffect(() => {
		const category = searchParams.get('category');
		if (category) {
			dispatch(
				updateFilters({ name: 'category', value: category.toLowerCase() })
			);
		}
	}, [dispatch, searchParams]);

	const handleChange = (
		e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.name === 'category') {
			dispatch(
				updateFilters({ name: 'category', value: e.target.value.toLowerCase() })
			);
			if (e.target.value === 'all') {
				searchParams.delete('category');
			} else {
				searchParams.set('category', e.target.value.toLowerCase());
			}
			setSearchParams(searchParams);
		} else {
			dispatch(
				updateFilters({ name: 'text', value: e.target.value.toLowerCase() })
			);
		}
	};

	return (
		<div
			className={`flex flex-col items-center pt-[20px] pb-[80px] px-[10px] bg-white bg-[rgba(70,0,130,0.1)] ${
				admin ? 'bg-[rgba(70,0,130,0.1)]' : ''
			}`}
		>
			{admin && (
				<div className='text-[16px] sm:text-[24px] md:text-[28px] xl:text-[32px] font-bold font-Manrope text-[#4b0082] self-start md:px-[46px] xl:px-[72px] flex flex-col gap-[10px]'>
					<div>
						<Link
							to={'/admin'}
							className='text-[rgba(0,0,0,0.5)] hover'
						>
							<span className='hover:underline underline-offset-8 font-semibold'>
								Admin
							</span>{' '}
							<span>{'> '}</span>
						</Link>
						Product
					</div>
					<Link
						to={'/admin/createproduct'}
						className='text-[14px] bg-[#4b0082] text-white p-2 rounded-sm hover:bg-transparent hover:text-[#4b0082] hover:border-2 hover:border-[#4b0082] flex gap-2 justify-center items-center'
					>
						<FaPlus />
						Create Product
					</Link>
				</div>
			)}
			<div className='flex pt-[18px] md:pt-[40px] md:pl-[46px] items-start w-full'>
				<div className='flex flex-col gap-[10px] md:gap-[17px] items-start'>
					{!admin && (
						<>
							<div className='font-Open text-[14px] sm:text-[16px] md:text-[20px] leading-[32px] text-[#4b0082]'>
								Products
							</div>

							<div className='font-Manrope text-[24px] sm:text-[36px] md:text-[48px] leading-[28px] sm:leading-[42px] md:leading-[60px] text-[#4b0082]'>
								Buy from our collections of products
							</div>
						</>
					)}
				</div>
			</div>
			<div className='flex max-sm:flex-col justify-center gap-2 md:gap-10 p-[10px] md:items-center font-Monda mt-4'>
				<div className='flex justify-center gap-[8px]'>
					<select
						name='category'
						id=''
						className='h-full p-2 cursor-pointer bg-[rgba(75,0,130,0.05)] outline-[#4b0082] text-[#4b0082] w-full text-left max-sm:text-[12px]'
						value={filters.category}
						onChange={handleChange}
					>
						<option
							value='all'
							className='h-full p-2 cursor-pointer bg-[rgba(75,0,130,0.05)] text-center outline-[#4b0082] text-[#4b0082] w-full'
						>
							All
						</option>
						{tabs}
					</select>
				</div>
				<div className=''>
					<input
						type='text'
						value={filters.text}
						onChange={handleChange}
						placeholder='Search'
						className='px-5 py-2 bg-[rgba(75,0,130,0.05)] placeholder:text-[#4b0082] text-[#4b0082] outline-none max-sm:text-[12px]'
					/>
				</div>
			</div>

			{products_loading ? (
				<div className='py-[24px] lg:px-[44px] min-h-[60vh]'>
					<Loading />
				</div>
			) : products_error ? (
				<div className='min-h-[50vh] pt-[50px] font-DM text-[#4b0082] font-semibold'>
					Something Went Wrong
				</div>
			) : filtered_product.length < 1 ? (
				<div className='min-h-[50vh] pt-[50px] font-DM text-[#4b0082] font-semibold'>
					Sorry, no product found
				</div>
			) : (
				<>
					<div className='flex flex-col py-[24px] lg:px-[44px] gap-[24px]'>
						<GridView
							products={filtered_product}
							customStyle={
								'max-md:py-[10px] px-0 grid max-md:grid-cols-2 md:grid-cols-3 min-[1200px]:grid-cols-4'
							}
							productStyle='w-full'
						/>
					</div>
					<Pagination
						totalItems={filtered_product.length}
						itemsPerPage={pagination.itemsPerPage}
						currentPage={pagination.currentPage}
						onPageChange={onPageChange}
					/>
				</>
			)}
			{/* <div className=''>pagination</div> */}
		</div>
	);
};

export default ProductsPage;
