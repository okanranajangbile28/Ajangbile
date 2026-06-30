import { Link, useLocation } from 'react-router-dom';

import { BlogType } from '../../../types/blog';
import ImageWithSkeleton from '../../../components/global_components/ImageWithSkeleton';

const BlogBlock = ({
	data,
	customContainer,
	customImage,
}: {
	data: BlogType;
	customContainer?: string;
	customImage?: string;
}) => {
	const location = useLocation();
	const isAdmin = location.pathname.startsWith('/admin');

	return (
		<Link
			to={`${isAdmin ? `/admin/blog/${data._id}` : `/blog/${data._id}`}`}
			className={`group flex-col flex max-w-[391px] rounded-[12px] opacity-[0.94] hover:rounded-[4px] hover:bg-[#4b0082] min-w-[250px] h-[500px] shadow-lg ${customContainer}`}
		>
			<div
				className={`flex flex-col gap-[10px] w-full h-1/2 ${customImage} relative`}
			>
				<ImageWithSkeleton
					src={data.thumbnail}
					alt={data.title}
					customStyle={`object-cover h-full object-center`}
				/>
			</div>
			<div className='flex flex-col gap-[20px] justify-between h-[50%] p-3 overflow-hidden overflow-ellipsis'>
				<div className='flex flex-col gap-[8px] '>
					<div className='flex flex-col gap-[5px]'>
						<div className='flex justify-between'>
							<div className='font-Open font-bold text-[12px] md:text-[16px] leading-[28px] text-[#5a87b1] group-hover:text-white'>
								Date
							</div>
							<div className='font-Monda text-[12px] md:text-[16px] leading-[28px] text-[#1f1c1c] group-hover:text-white'>
								{`${new Date(data.createdAt).toLocaleString('default', {
									month: 'long',
								})}, ${new Date(data.createdAt).getFullYear()}`}
							</div>
						</div>
						<div className='font-Open text-[12px] md:text-[16px] leading-5 md:leading-[32px] text-[#4b0082] group-hover:text-white'>
							{data.title}
						</div>
					</div>
					<div className='font-Open text-[10px] md:text-[12px] leading-[18px] md:leading-[32px] text-[rgba(75,0,130,0.7)] group-hover:text-white'>
						{data.summary}
					</div>
				</div>
				{/* <div className='flex gap-[12px]'>
					<div className='aspect-square h-[32px]'>
						<img
							src={authorThumbnail}
							alt=''
						/>
					</div>
					<div className='font-Open text-[12px] md:text-[16px] leading-[28px] text-black group-hover:text-white'>
						{data.author}
					</div>
				</div> */}
			</div>
		</Link>
	);
};

export default BlogBlock;
