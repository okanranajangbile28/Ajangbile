import ImageWithSkeleton from '../global_components/ImageWithSkeleton';
import ExploreBlock from './ExploreBlock';

const Explore = () => {
	return (
		<div className='min-h-screen bg-white flex flex-col gap-[48px] relative pb-[32px]'>
			<div className='relative flex flex-col items-center justify-center gap-[12px] p-[14px]'>
				<h5 className='font-Open text-[20px] leading-[32px] text-[#555]'>
					Our Services
				</h5>
				<h1 className='font-Manrope text-[48px] leading-[72px] text-[#4b0082] max-[1100px]:text-[40px] max-[900px]:text-[32px] max-sm:text-[24px] text-center'>
					Explore our products and services
				</h1>
				<div className='absolute left-0 top-0 max-[900px]:h-[150px] max-[1100px]:h-[250px] max-xl:h-[300px] xl:h-[350px] overflow-hidden max-[700px]:hidden'>
					<img
						src={
							'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057468/OA/topLeftId.webp'
						}
						alt=''
						className='object-contain h-full'
					/>
				</div>
				<div className='absolute right-0 top-0 max-[900px]:h-[150px] max-[1100px]:h-[250px] max-xl:h-[300px] xl:h-[350px] overflow-hidden max-[700px]:hidden'>
					<img
						src={
							'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057471/OA/topRightId.webp'
						}
						alt=''
						className='object-contain h-full'
					/>
				</div>
			</div>
			{/* <div> */}
			<div className='flex items-start justify-center gap-[20px] sm:gap-[40px] md:gap-[90px] px-[30px]'>
				<ExploreBlock
					img={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057471/OA/African%20Totem.webp'
					}
					title='African Totems'
					desc='Experience and buy a wide variety of our African totems'
					category='totem'
				/>
				<ExploreBlock
					img={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057470/OA/African%20Fabric.webp'
					}
					title='African Fabrics'
					desc='Buy our beautiful fabric from all around the world'
					category='fabrics'
				/>
			</div>
			<div className='flex items-start justify-center gap-[20px] sm:gap-[40px] md:gap-[90px] px-[30px] '>
				<ExploreBlock
					img={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057468/OA/iseseBK.webp'
					}
					title='Isese Related Books'
					desc='Expand your knowledge with our books'
					category='isese'
				/>
				<div className='max-[870px]:hidden xl:h-[350px] relative'>
					<ImageWithSkeleton
						src={
							'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057468/OA/middleIdol.webp'
						}
						customStyle='h-full'
						alt=''
						customPlaceholder='rounded-full'
					/>
				</div>
				<ExploreBlock
					img={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057469/OA/initiation.webp'
					}
					title='Initiations'
					desc='Get initiated into the Orisa fraternity'
				/>
			</div>
			<div className='flex items-start justify-center gap-[20px] sm:gap-[40px] md:gap-[90px] px-[30px]'>
				<ExploreBlock
					img={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057471/OA/African%20Totem.webp'
					}
					title='Enchanted Items'
					desc='Square, was moving across the sand in their direction.'
					category='enchanted'
				/>
				<ExploreBlock
					img={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057470/OA/Root%20and%20Herb.webp'
					}
					title='Herbs and Roots'
					desc='Square, was moving across the sand in their direction.'
					category='herbs'
				/>
			</div>
			{/* </div> */}
			<div className='absolute left-0 bottom-0 max-[900px]:h-[150px] max-[1100px]:h-[250px] max-xl:h-[300px] xl:h-[330px] overflow-hidden max-[1024px]:hidden'>
				<img
					src={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057471/OA/bottomLeftId.webp'
					}
					alt=''
					className='object-contain h-full'
				/>
			</div>
		</div>
	);
};

export default Explore;
