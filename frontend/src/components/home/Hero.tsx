import { Link } from 'react-router-dom';
import ImageWithSkeleton from '../global_components/ImageWithSkeleton';

const Hero = () => {
	return (
		<div className='relative h-[931px] p-[25px] sm:p-[100px] md:p-[50px] lg:p-[100px] items-center justify-between gap-[30px] lg:gap-[93px] grid md:grid-cols-2'>
			<div className='absolute top-0 left-0 h-full w-full -z-20'>
				<img
					src={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057102/OA/HeroBg.webp'
					}
					alt=''
					className='object-cover h-full w-full blur-[4.5px]'
				/>
			</div>
			<div className='absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.2)] -z-10'></div>
			<div className='flex flex-col justify-center items-start gap-[22px]'>
				<h2 className='font-Manrope font-bold text-[48px] leading-[72px] text-white'>
					Discover the intriguing culture of the Yorubas
				</h2>
				<p className='font-open text-[16px] leading-[28px] text-[rgba(255,255,255,0.9)] self-stretch'>
					Explore the rich traditions, vibrant artistry, and deep spirituality
					of the Yoruba people, a culture steeped in history, wisdom, and
					timeless heritage.
				</p>
				<Link
					to={'/shop'}
					className='flex justify-center items-center px-[24px] py-[12px] gap-[8px] border-2 border-white rounded-[56px] font-Open text-[20px] font-bold leading-[28px] text-white'
				>
					Explore
				</Link>
			</div>
			<div className='grid justify-center items-center h-full max-[768px]:hidden relative'>
				<ImageWithSkeleton
					src='https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731056794/OA/culturalWoman.webp'
					alt=''
					customStyle='object-contain h-full'
					customPlaceholder='rounded-full'
				/>
			</div>
		</div>
	);
};

export default Hero;
