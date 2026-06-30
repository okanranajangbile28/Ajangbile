import { Link } from 'react-router-dom';
import BlogBlock from '../features/blogFeature/blog/blogBlock';
import { FaPlus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../App/hooks';
import { useEffect } from 'react';
import { fetchBlogs } from '../features/blogFeature/blogSlice';
import { Loading } from '../components/global_components';

const BlogPage = ({ admin }: { admin?: boolean }) => {
	const dispatch = useAppDispatch();
	const { blogs, blogs_loading } = useAppSelector((state) => state.blog);

	useEffect(() => {
		dispatch(fetchBlogs());
	}, []);

	useEffect(() => {
		document.title = 'Okanran Ajangbile | Blog';
	}, []);

	return (
		<div className='flex flex-col pt-[20px] pb-[80px] bg-[rgba(75,0,130,0.05)] gap-[30px]'>
			{admin && (
				<div className='text-[16px] pl-[20px] xl:pl-[82px] sm:text-[24px] md:text-[28px] xl:text-[36px] font-bold font-Manrope text-[#4b0082]'>
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
						Blog
					</div>
					<Link
						to={'/admin/blog/editor'}
						className='text-[14px] bg-[#4b0082] text-white p-2 rounded-sm hover:bg-transparent hover:text-[#4b0082] hover:border-2 hover:border-[#4b0082] inline-flex gap-2 justify-center items-center px-5'
					>
						<FaPlus /> Create Blog
					</Link>
				</div>
			)}
			<div className=' px-[10px] pb-[10px] flex flex-col gap-[32px]'>
				{!admin && (
					<div className='flex pt-[20px] xl:pl-[100px]'>
						<div className='flex flex-col gap-[17px]'>
							<div className='font-Open text-[20px] leading-[32px] text-[#4b0082]'>
								Blog
							</div>
							<div className='font-Manrope text-[24px] sm:text-[32px] lg:text-[48px] leading-[60px] text-[#4b0082]'>
								Read our engaging stories
							</div>
						</div>
					</div>
				)}
				{blogs_loading ? (
					<Loading />
				) : blogs.length < 1 ? (
					<h5 className='grid min-h-[40vh] justify-center font-semibold text-[24px] text-[#783da1] font-Monda'>
						Sorry, no blogs available
					</h5>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center xl:px-[100px] flex-wrap gap-y-10 gap-x-[20px]'>
						{blogs.map((blog) => (
							<BlogBlock
								key={blog._id}
								data={blog}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default BlogPage;
