import { Link } from 'react-router-dom';
import BlogBlock from '../../features/blogFeature/blog/blogBlock';
import { useAppSelector } from '../../App/hooks';
import { Loading } from '../global_components';

const FeaturedBlogs = () => {
	const { blogs_loading, blog_error, featured_blogs } = useAppSelector(
		(state) => state.blog
	);

	return (
		<div className='flex flex-col items-start md:pt-[40px] pb-[10px] pl-[10px] md:pl-[10px] lg:pl-[56px] pr-[10px] gap-[32px] bg-white'>
			<div className='flex flex-col w-full gap-[17px] pt-[20px]'>
				<div className='font-Open text-[18px] sm:text-[20px] leading-[32px] text-[#c4c4c4] max-sm:text-center'>
					Blog
				</div>
				<div className='font-Manrope text-[24px] sm:text-[32px] lg:text-[48px] leading-[28px] sm:leading-[40px] md:leading-[60px] text-[#4b0082] max-sm:text-center'>
					Read our engaging stories
				</div>
			</div>

			{blogs_loading ? (
				<Loading />
			) : blog_error ? (
				<div className='h-[20vh] w-full grid items-center justify-center font-Manrope'>
					Something Went Wrong
				</div>
			) : (
				<>
					<div className='flex max-sm:w-[95vw] max-sm:overflow-x-scroll sm:grid-cols-2 sm:grid min-[910px]:grid-cols-3 min-[1250px]:grid-cols-4 overflow-hidden gap-3 py-3 min-h-[250px]'>
						{featured_blogs.map((blog) => (
							<BlogBlock
								key={blog._id}
								data={blog}
							/>
						))}
					</div>
					<div className='flex justify-end sm:px-[88px] w-full'>
						<Link
							to={'/blog'}
							className='py-[8px] px-[12px] md:py-[14px] md:px-[32px] items-center justify-center border-2 border-[#4b0082] rounded-[56px] font-Open font-bold text-[14px] md:text-[20px] leading-[28px] text-[#3f3843]'
						>
							Load More
						</Link>
					</div>
				</>
			)}
		</div>
	);
};

export default FeaturedBlogs;
