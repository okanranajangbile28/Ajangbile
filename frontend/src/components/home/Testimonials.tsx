import TestimonialsBlock from './TestimonialsBlock';
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6';
const Testimonials = () => {
	return (
		<div className='flex flex-col py-[12px] sm:pt-[20px] lg:pt-[40px] pb-[10px] sm:pb-[50px] lg:pb-[150px] max-sm:px-[32px] px-[10px] gap-[40px] bg-[#4b0082]'>
			<div className='flex pt-[20px] lg:px-[50px] justify-between'>
				<div className='flex flex-col gap-[17px]'>
					<div className='font-Open text-[16px] md:text-[20px] leading-[32px] text-[#c4c4c4]'>
						Testimonials
					</div>
					<div className='font-Manrope text-[24px] sm:text-[32px] lg:text-[48px] leading-[36px] sm:leading-[48px] lg:leading-[72px] text-white w-3/4'>
						See some of what our happy clients are saying
					</div>
				</div>
				<div className='grid items-end max-sm:hidden'>
					<div className='flex justify-end gap-[14px] sm:gap-[28px] md:gap-[38px] text-[20px] sm:text-[40px] md:text-[72px] pr-[30px] md:pr-[100px] lg:pr-[100px]'>
						<button className=''>
							<FaCircleArrowLeft color='white' />
						</button>
						<button className='bg-transparent'>
							<FaCircleArrowRight color='white' />
						</button>
					</div>
				</div>
			</div>
			<div className='grid grid-col sm:flex sm:overflow-x-auto scrollbar-thin scrollbar-thumb-white scrollbar-w-6 scrollbar-thumb-rounded-md scrollbar-track-transparent lg:px-[50px] gap-[20px]'>
				<TestimonialsBlock
					name='firstname lastname'
					position='position'
					quote='“Things started to work for me when i bought some totems”'
				/>
				<TestimonialsBlock
					name='firstname lastname'
					position='position'
					quote='“The fabric i bought stood out so much that every one kept on asking where i got it .”'
				/>
				<TestimonialsBlock
					name='firstname lastname'
					position='position'
					quote='“I have been suffering with some illness but the moment i took the herb i bought from them i got well.”'
				/>
				<TestimonialsBlock
					name='firstname lastname'
					position='position'
					quote='“Things started to work for me when i bought some totems”'
				/>
			</div>
		</div>
	);
};

export default Testimonials;
