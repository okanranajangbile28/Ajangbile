import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../App/hooks';
import { SyntheticEvent } from 'react';
import { disablePreviewProduct } from '../../adminSlice';

const AdminProductPreview = ({
	handleSubmit,
	loading,
}: {
	handleSubmit: (e: SyntheticEvent<HTMLButtonElement>) => void;
	loading: boolean;
}) => {
	const { form } = useAppSelector((state) => state.admin);
	const { productName, description, price, totalQuantity, discount, category } =
		form.tempProduct;
	const previewLinks = [
		{ label: 'Product Name', value: productName },
		{ label: 'description', value: description },
		{ label: 'price', value: price },
		{ label: 'Stock', value: totalQuantity },
		{ label: 'discount', value: discount },
		{ label: 'category', value: category },
	];
	const previewLinksBlock = previewLinks.map((data, index) => (
		<p
			key={index}
			className='flex flex-col gap-[8px]'
		>
			<div className='capitalize text-[24px] text-[#4b0082] font-semibold font-DM'>
				{data.label}
			</div>
			<div className='bg-[rgba(0,0,0,0.05] text-[16px] font-Monda'>
				{data.value as string}
			</div>
		</p>
	));
	const dispatch = useAppDispatch();
	return (
		<div className='flex flex-col pt-[24px] px-[24px] md:px-[48px] pb-[100px] gap-[24px] bg-[rgba(75,0,130,0.1)]'>
			<div className='text-[36px] font-bold font-Manrope text-[#4b0082] md:w-3/4'>
				<Link
					to={'/admin'}
					className='text-[rgba(0,0,0,0.5)] hover'
				>
					<span className='hover:underline underline-offset-8 font-semibold'>
						Admin
					</span>{' '}
					<span>{'> '}</span>
				</Link>
				<Link
					to={'/createproduct'}
					className='text-[rgba(0,0,0,0.5)] hover'
				>
					<span className='hover:underline underline-offset-8 font-semibold'>
						Create Product
					</span>{' '}
					<span>{'> '}</span>
				</Link>
				Preview Product
			</div>
			{previewLinksBlock}
			<p className='flex flex-wrap gap-[10px] flex-col'>
				<div className='capitalize text-[24px] text-[#4b0082] font-semibold font-DM'>
					Images
				</div>
				{form.images.map((image, index) => (
					<div
						key={index}
						className='w-[200px] aspect-square'
					>
						<img
							src={image as string}
							alt=''
							className='object-cover'
						/>
					</div>
				))}
			</p>
			<div className='flex gap-[24px]'>
				<Link
					className='flex items-center justify-center py-[12px] px-[32px] bg-[rgba(0,0,0,0.05)] rounded-[8px] font-Inter font-semibold text-[14px] leading-[100%] text-[#4b0082]'
					to={'/createproduct'}
					onClick={() => {
						dispatch(disablePreviewProduct());
					}}
				>
					Continue Editing Product
				</Link>
				<button
					className='flex items-center justify-center py-[12px] px-[32px] bg-[#4b0082] rounded-[8px] font-Inter font-semibold text-[14px] leading-[100%] text-[#f3f3f3]'
					onClick={handleSubmit}
					disabled={loading}
				>
					Publish Product
				</button>
			</div>
		</div>
	);
};

export default AdminProductPreview;
