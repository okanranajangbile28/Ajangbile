import { Link } from 'react-router-dom';
import ImageWithSkeleton from '../global_components/ImageWithSkeleton';

const ExploreBlock = ({
	img,
	title,
	desc,
	category,
}: {
	img: string;
	title: string;
	desc: string;
	category?: string;
}) => {
	return (
		<Link
			to={
				title.toLowerCase() === 'initiations'
					? '/contact'
					: `/shop?category=${category}`
			}
			className='flex flex-col items-center pt-[10px] px-[10px] pb-[29px] sm:p-[32px] md:p-[64px] gap-[18px] md:gap-[64px] bg-white rounded-[32px] shadowEffect w-[350px] md:h-[465px] h-[250px]'
		>
			<div className='w-[54px] h-[54px] sm:w-[80px] sm:h-[80px] md:w-[120px] md:h-[120px] rounded-[200px] relative'>
				<ImageWithSkeleton
					src={img}
					alt=''
					customStyle=''
					customPlaceholder='rounded-full'
				/>
			</div>
			<div className='flex flex-col items-center p-0 gap-[10px] min-:gap-[24px] md:gap-[32px] self-stretch grow-0'>
				<div className='font-Monda font-bold text-[16px] md:text-[28px] leading-[34px] text-center text-[#191825]'>
					{title}
				</div>
				<div className='font-Inter text-[12px] md:text-[18px] leading-[29px] text-center text-[rgba(25,24,37,0.5)] self-stretch grow-0'>
					{desc}
				</div>
			</div>
		</Link>
	);
};

export default ExploreBlock;
