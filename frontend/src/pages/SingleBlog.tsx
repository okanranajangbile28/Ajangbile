import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../App/hooks';
import { useParams } from 'react-router-dom';
import { fetchSingleBlog } from '../features/blogFeature/blogSlice';
import styled from 'styled-components';
import BlogBlock from '../features/blogFeature/blog/blogBlock';
import ImageWithSkeleton from '../components/global_components/ImageWithSkeleton';
import { Loading } from '../components/global_components';

const SingleBlog = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const { single_blog, blogs, single_blog_loading } = useAppSelector(
		(state) => state.blog
	);
	useEffect(() => {
		dispatch(fetchSingleBlog(id!));
	}, [id]);

	useEffect(() => {
		document.title = `Okanran Ajangbile | ${single_blog.title}`;
	}, [single_blog.title]);

	return single_blog_loading ? (
		<Loading />
	) : (
		<div className='px-[20px] md:px-[40px] xl:px-[84px] pt-[20px] pb-[80px] flex flex-col gap-[20px] lg:gap-[24px]'>
			<div className='font-Open text-[14px] lg:text-[20px] flex items-center leading-[160%] text-[#c4c4c4] self-stretch'>
				Article
			</div>
			<div className='font-Manrope text-[32px] lg:text-[48px] leading-[125%] text-[#4b0082] self-stretch'>
				{single_blog.title}
			</div>
			<div className='grid grid-cols-3 gap-8'>
				<div className='col-span-3 lg:col-span-2 gap-[40px] grid '>
					<div className='h-[400px] relative'>
						<ImageWithSkeleton
							src={single_blog.thumbnail}
							customStyle='object-cover object-top w-full h-full'
							alt={single_blog.title}
						/>
					</div>
					<ContentContainer
						dangerouslySetInnerHTML={{ __html: single_blog.content }}
						className='flex flex-col gap-[10px]'
					/>
				</div>
				<div className='max-lg:hidden flex flex-col gap-[20px]'>
					{blogs
						.filter((x) => id != x._id)
						.map((blog) => (
							<BlogBlock
								data={blog}
								key={blog._id}
								customContainer='h-[400px]'
							/>
						))}
				</div>
			</div>
		</div>
	);
};

const ContentContainer = styled.div`
	font-family: Open Sans;
	color: #4b0082;
	ol {
		list-style-type: decimal !important;
		margin-left: 20px;
		padding-left: 20px;
	}
`;
export default SingleBlog;
