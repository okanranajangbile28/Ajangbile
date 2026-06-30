import { ChangeEvent, SyntheticEvent, useEffect, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
	clearFormImages,
	createBlog,
	// enablePreviewBlog,
	loadFormBlog,
	resetFormBlog,
	setFieldMode,
	setFormImages,
	setFormValidity,
	setShowErrorMessage,
	updateBlog,
	updateFormBlog,
} from '../../adminSlice';

import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../../App/hooks';
import { BlogType } from '../../../../types/blog';
import { fetchSingleBlog } from '../../../blogFeature/blogSlice';
import AdminFormInput from '../../../../components/admin/AdminFormInput';
import AdminTextAreaInput from '../../../../components/admin/AdminTextAreaInput';
import QuillEditor from '../../../../components/QuillEditor';
import { Link } from 'react-router-dom';

const AdminBlogForm = ({
	type,
}: {
	type: 'detail' | 'create';
	blog?: BlogType;
}) => {
	const { id } = useParams();
	const ref = useRef<HTMLFormElement>(null);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { form, error } = useAppSelector((state) => state.admin);
	const { errorMessage, tempBlog, isValid, images } = form;
	const { single_blog } = useAppSelector((state) => state.blog);

	useEffect(() => {
		localStorage.setItem('blog', JSON.stringify(tempBlog));
	}, [tempBlog]);

	useEffect(() => {
		if (id) {
			dispatch(fetchSingleBlog(id));
		} else {
			dispatch(resetFormBlog());
			dispatch(clearFormImages());
		}
	}, [dispatch, id]);

	useEffect(() => {
		if (id && single_blog) {
			dispatch(loadFormBlog({ ...single_blog }));
			dispatch(setFormImages(single_blog.thumbnail));
		}
	}, [dispatch, id, single_blog]);

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
			updateFormBlog({
				detail: name,
				info: value,
			})
		);
	};

	const handleEditorChange = (value: string) => {
		dispatch(updateFormBlog({ detail: 'content', info: value }));
	};

	const handleSubmit = async (e: SyntheticEvent<HTMLButtonElement>) => {
		e.preventDefault();
		// Get all form elements
		const form = ref.current;
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
			let item: keyof BlogType;
			for (item in tempBlog) {
				if (item !== 'thumbnail' && item !== '_id') {
					formData.append(item, tempBlog[item] as string);
				} else if (item === 'thumbnail') {
					if (images) {
						for (let i = 0; i < images.length; i++) {
							const img = images[0][i];

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
					await dispatch(updateBlog({ id, data: formData }));
				} else {
					await dispatch(createBlog(formData));
				}
				if (!error.submit_blog) {
					dispatch(clearFormImages());
					dispatch(setFieldMode('fixed'));
					localStorage.removeItem('blog');
					navigate('/admin/blog');
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
		dispatch(setFormImages([selectedFilesUrl]));
	};

	const deleteImage = (position: number) => {
		const filteredImages = images.filter((_, index) => position !== index);
		dispatch(setFormImages([...filteredImages]));
	};

	return (
		<div className='bg-[rgba(75,0,130,0.1)] py-[24px]'>
			<form
				className='flex flex-col pt-[24px] px-[20px] sm:px-[84px] lg:w-4/5 gap-[24px]'
				ref={ref}
			>
				<div className='text-[16px] sm:text-[24px] md:text-[28px] xl:text-[32px] font-bold font-Manrope text-[#4b0082] self-start'>
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
						to={'/admin/blog'}
						className='text-[rgba(0,0,0,0.5)] hover'
					>
						<span className='hover:underline underline-offset-8 font-semibold'>
							Blog
						</span>{' '}
						<span>{'> '}</span>
					</Link>
					Create Blog
				</div>
				<AdminFormInput
					type='text'
					name='title'
					label='title'
					id='title'
					labelCustomStyle=''
					inputCustomStyle=''
					placeholder='Enter Blog Title'
					value={tempBlog.title || ''}
					onChange={onChange}
					mode={type}
					required
				/>
				<AdminFormInput
					type='text'
					name='author'
					label='author'
					id='author'
					labelCustomStyle=''
					inputCustomStyle=''
					placeholder='Enter Blog Author'
					value={tempBlog.author || ''}
					onChange={onChange}
					mode={type}
					required
				/>
				<AdminTextAreaInput
					label='summary'
					name='summary'
					labelCustomStyle=''
					inputCustomStyle=''
					placeholder='Enter short summary of blog'
					value={tempBlog.summary || ''}
					onChange={onChange}
					mode={type}
					required
				/>
				<AdminFormInput
					label='image'
					type='file'
					name='image'
					id='image'
					accept='.avif, .webp, .jpg, .png'
					inputCustomStyle=''
					labelCustomStyle=''
					multiple
					onChange={onSelectFile}
					max={1}
					mode={type}
				/>
				<AdminFormInput
					type='text'
					name='keywords'
					label='Keywords'
					id='keywords'
					labelCustomStyle=''
					inputCustomStyle=''
					placeholder='Enter keywords'
					value={form.tempBlog.keywords || ''}
					mode={type}
					required
					onChange={onChange}
				/>
				{images && (
					<div>
						{images.map((image, index) => (
							<div
								key={index}
								className='h-[200px]'
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
				<QuillEditor
					label='Content'
					handleEditorChange={handleEditorChange}
					value={form.tempBlog.content}
				/>

				<div className='flex gap-[8px]'>
					<button
						className='flex items-center justify-center py-[12px] px-[32px] bg-[#f2f2f2] shadow-sm rounded-[8px] font-Inter font-semibold text-[14px] leading-[100%] text-[#4b0082]'
						onClick={enableEdit}
					>
						Edit Blog
					</button>
					<button
						className='flex items-center justify-center py-[12px] px-[32px] bg-[#4b0082] rounded-[8px] font-Inter font-semibold text-[14px] leading-[100%] text-[#f3f3f3]'
						onClick={handleSubmit}
					>
						{type === 'create' ? 'Publish' : 'Update'} Blog
					</button>
				</div>
			</form>
		</div>
	);
};

export default AdminBlogForm;
