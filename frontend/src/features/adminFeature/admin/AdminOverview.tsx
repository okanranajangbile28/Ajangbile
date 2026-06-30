import { Link } from 'react-router-dom';
import { adminBlogThumbnail, adminProductThumbnail } from '../../../assets';
import ImageWithSkeleton from '../../../components/global_components/ImageWithSkeleton';

const AdminOverview = () => {
	return (
		<div className='pt-[50px] pb-[120px] px-[20px] md:px-[40px] lg:px-[82px] flex flex-col gap-10 bg-[rgba(70,0,130,0.1)]'>
			<div className='text-[24px] md:text-[32px] lg:text-[42px] font-Manrope font-bold text-[#4b0082] capitalize self-start'>
				Welcome, admin
			</div>
			<div className='flex gap-[32px] justify-center max-sm:flex-col max-sm:items-center'>
				<div className='w-3/4 md:w-2/3 lg:w-1/4 group flex flex-col gap-4'>
					<div className='relative shadow-xl'>
						<ImageWithSkeleton
							src={adminProductThumbnail}
							alt=''
							customStyle=''
						/>
						<Link
							className='absolute hidden group-hover:grid top-0 left-0 w-full h-full justify-center items-center backdrop-blur-sm bg-opacity-[0.15] p-4 cursor-pointer text-[32px] font-Open text-[#4b0082] font-semibold'
							to={'/admin/product'}
						>
							{/* Admin Product */}
						</Link>
					</div>
					<div className='text-[16px] lg:text-[24px] text-center font-semibold text-[#4b0082]'>
						Product
					</div>
				</div>
				<div className='w-9/12 md:w-2/3 lg:w-1/4 group flex flex-col gap-4'>
					<div className='relative group transition-all shadow-xl'>
						<ImageWithSkeleton
							src={adminBlogThumbnail}
							alt=''
							customStyle=''
						/>
						<Link
							className='absolute hidden group-hover:grid top-0 left-0 w-full h-full justify-center items-center backdrop-blur-sm bg-opacity-[0.15] p-4 cursor-pointer text-[32px] font-Open text-[#4b0082] font-semibold'
							to={'/admin/blog'}
						>
							{/* Blog */}
						</Link>
					</div>
					<div className='text-[16px] lg:text-[24px] text-center font-semibold text-[#4b0082]'>
						Blog
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminOverview;
