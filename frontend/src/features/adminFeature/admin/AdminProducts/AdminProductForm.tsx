import { ChangeEvent, SyntheticEvent, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../App/hooks';
import { fetchSingleProduct } from '../../../productFeature/productSlice';

import { SingleProductType } from '../../../../types/product';
import {
	changeSideMenuValue,
	clearFormImages,
	createProduct,
	// enablePreviewProduct,
	loadFormProduct,
	resetFormProduct,
	setFieldMode,
	setFormImages,
	setFormValidity,
	setShowErrorMessage,
	updateFormProduct,
	updateProduct,
} from '../../adminSlice';
import FormInput from '../../../../components/admin/AdminFormInput';
import { FaTrash } from 'react-icons/fa';
import FormTextArea from '../../../../components/admin/AdminTextAreaInput';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { productCategory } from '../../../../utils/constants';
import { Loading } from '../../../../components/global_components';

const AdminProductForm = ({
	type,
}: {
	type: 'detail' | 'create';
	product?: SingleProductType;
}) => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { form, error, loading } = useAppSelector((state) => state.admin);
	const { isValid, errorMessage, tempProduct, images } = form;

	const { single_product } = useAppSelector((state) => state.product);

	useEffect(() => {
		localStorage.setItem('product', JSON.stringify(tempProduct));
	}, [tempProduct]);

	useEffect(() => {
		dispatch(changeSideMenuValue('product'));
	}, []);

	useEffect(() => {
		if (id) {
			dispatch(fetchSingleProduct(id));
		} else {
			dispatch(resetFormProduct());
			dispatch(clearFormImages());
		}
	}, [dispatch, id]);

	useEffect(() => {
		if (id && single_product) {
			dispatch(loadFormProduct({ ...single_product }));
			dispatch(setFormImages(single_product.images));
		}
	}, [dispatch, id, single_product]);

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(setShowErrorMessage(false));
		}, 10000);
		return () => clearTimeout(timer);
	}, [errorMessage]);

	const enableEdit = (e: SyntheticEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(setFieldMode('update'));
	};

	const onChange = (
		e:
			| ChangeEvent<HTMLInputElement>
			| ChangeEvent<HTMLTextAreaElement>
			| ChangeEvent<HTMLSelectElement>
	) => {
		const { name, value, validity } = e.target;

		if (validity.valid) dispatch(setFormValidity(true));

		dispatch(
			updateFormProduct({
				detail: name,
				info: value,
			})
		);
	};

	const handleSubmit = async (e: SyntheticEvent<HTMLButtonElement>) => {
		e.preventDefault();

		// Get all form elements
		const form = e.currentTarget.form;
		if (!form) {
			console.error('Form not found');
			return;
		}

		const formElements = form.elements;

		// Check validity for each form element
		for (let i = 0; i < formElements.length; i++) {
			const element = formElements[i] as HTMLInputElement | HTMLTextAreaElement;

			if (
				element instanceof HTMLInputElement ||
				element instanceof HTMLTextAreaElement
			) {
				if (!element.validity.valid && element.name !== 'image') {
					dispatch(setFormValidity(false));
					dispatch(setShowErrorMessage(true));

					console.log('form is not valid');

					return;
					// Stop checking if any field is invalid
				} else if (
					!element.validity.valid &&
					element.name === 'image' &&
					!images
				) {
					dispatch(setFormValidity(false));
					dispatch(setShowErrorMessage(true));
					console.log('form is not valid');

					return;
				}
			}
		}

		dispatch(setShowErrorMessage(true));

		const getExtension = (contentType: string) => {
			const match = contentType.match(/\/(.+)$/);
			return match ? match[1] : '';
		};

		// If all fields are valid, navigate to the next stage
		if (isValid) {
			const formData: FormData = new FormData();
			let item: keyof SingleProductType;
			for (item in tempProduct) {
				if (item !== 'images' && item !== '_id') {
					formData.append(item, tempProduct[item] as string);
				} else if (item === 'images') {
					if (images) {
						for (let i = 0; i < images.length; i++) {
							const img = images[i];

							if (img.startsWith('blob')) {
								const response = await axios.get(img, { responseType: 'blob' });
								const contentType = response.headers['content-type'];
								const file = new File(
									[response.data],
									`file${i}.${getExtension(contentType)}`,
									{
										type: contentType,
									}
								);
								formData.append(`images`, file);
							} else {
								formData.append(`images`, img);
							}
						}
					}
				}
			}

			try {
				if (id) {
					await dispatch(updateProduct({ id, data: formData }));
				} else {
					await dispatch(createProduct(formData));
				}
				if (!error.submit_product) {
					dispatch(clearFormImages());
					dispatch(setFieldMode('fixed'));
					navigate('/admin/product');
				}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				dispatch(setShowErrorMessage(true));
			}
		}
	};

	const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files;
		if (!selectedFiles) {
			return;
		}
		const selectedFilesUrl = [...selectedFiles].map((file: File) =>
			URL.createObjectURL(file)
		);
		dispatch(setFormImages([...images, ...selectedFilesUrl]));
	};

	const deleteImage = (position: number) => {
		const filteredImages = images.filter((_, index) => position !== index);
		dispatch(setFormImages([...filteredImages]));
	};

	return loading ? (
		<Loading />
	) : (
		<div className='bg-[rgba(75,0,130,0.1)]'>
			<form className='flex flex-col pt-[24px] px-[24px] md:px-[48px] pb-[100px]  md:w-3/4 gap-[24px] '>
				<div className='text-[16px] sm:text-[24px] md:text-[28px] xl:text-[36px] font-bold font-Manrope text-[#4b0082]'>
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
						to={'/admin/product'}
						className='text-[rgba(0,0,0,0.5)] hover'
					>
						<span className='hover:underline underline-offset-8 font-semibold'>
							Product
						</span>{' '}
						<span>{'> '}</span>
					</Link>
					Create Product
				</div>
				<FormInput
					type='text'
					name='productName'
					label='Product Name'
					id='productName'
					placeholder='Enter Product Name'
					value={form.tempProduct.productName || ''}
					mode={type}
					required
					onChange={onChange}
				/>
				<FormTextArea
					name='description'
					label='Description'
					id='description'
					placeholder='Enter Product Description'
					value={form.tempProduct.description || ''}
					mode={type}
					required
					onChange={onChange}
				/>

				{/* <FormInput
					type='number'
					name='totalQuantity'
					label='Total Quantity'
					id='totalQuantity'
					placeholder='Enter Stock Availabe'
					value={form.tempProduct.totalQuantity || ''}
					mode={type}
					required
					onChange={onChange}
				/> */}
				<div className='grid grid-cols-2 gap-3'>
					<FormInput
						type='number'
						name='price'
						label='Price'
						id='price'
						placeholder='Enter Product Price'
						value={form.tempProduct.price || ''}
						mode={type}
						required
						onChange={onChange}
					/>
					<FormInput
						type='text'
						name='unit'
						label='Price Unit'
						id='unit'
						placeholder='Enter Product Price Unit'
						value={form.tempProduct.unit || ''}
						mode={type}
						onChange={onChange}
					/>
				</div>
				<div className='flex flex-col gap-[8px] items-start'>
					<label
						htmlFor='category'
						className={`font-Manrope font-bold text-[16px] sm:text-[24px] leading-[33px] text-center text-[#01248c] capitalize`}
					>
						Category
					</label>
					<select
						onChange={onChange}
						className='flex items-center py-[18px] px-[20px] bg-[#f2f4f7] rounded-[8px] self-stretch font-Manrope text-[14px] leading-[19px] text-[rgba(0,0,0,0.5)] appearance-none'
						id='category'
						name='category'
						value={form.tempProduct.category || ''}
						required
					>
						<option
							value=''
							disabled
						>
							Category
						</option>
						{productCategory.map((x, index) => (
							<option
								key={index}
								value={x.value}
							>
								{x.title}
							</option>
						))}
					</select>
				</div>
				{/* <FormInput
					type='number'
					name='discount'
					label='Discount'
					id='discount'
					max={'100'}
					placeholder='Enter Product Discount Percentage'
					value={form.tempProduct.discount || ''}
					mode={type}
					onChange={onChange}
				/> */}
				<FormInput
					label='image'
					type='file'
					name='image'
					id='image'
					accept='.avif, .webp, .jpg, .png'
					multiple
					onChange={onSelectFile}
					max={4}
					mode={type}
				/>

				{images && (
					<div className='grid grid-cols-4'>
						{images.map((image, index) => (
							<div
								key={index}
								className='h-[200px] aspect-square'
							>
								<img
									src={image as string}
									alt=''
									className='object-contain h-full'
								/>
								<button
									className='text-[#4b0082]'
									onClick={(e) => {
										e.preventDefault();
										deleteImage(index);
									}}
								>
									<FaTrash />
								</button>
							</div>
						))}
					</div>
				)}
				<div className='flex gap-[8px]'>
					<button
						className='flex items-center justify-center py-[12px] px-[32px] bg-[#f2f2f2] shadow-sm rounded-[8px] font-Inter font-semibold text-[14px] leading-[100%] text-[#4b0082]'
						onClick={enableEdit}
					>
						Edit Product
					</button>
					<button
						className='flex items-center justify-center py-[12px] px-[32px] bg-[#4b0082] rounded-[8px] font-Inter font-semibold text-[14px] leading-[100%] text-[#f3f3f3]'
						onClick={handleSubmit}
					>
						{type === 'create' ? 'Publish' : 'Update'} Product
					</button>
					{error.submit_product && (
						<div className='font-DM'>Something went wrong</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default AdminProductForm;
