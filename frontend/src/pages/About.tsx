import { useEffect } from 'react';

const About = () => {
	useEffect(() => {
		document.title = 'Okanran Ajangbile | About';
	}, []);
	return (
		<div className='md:pl-[84px] px-[16px] sm:px-[32px] md:pr-[62px] pt-[20px] pb-[80px] flex flex-col gap-[17px]'>
			<div className='font-Open text-[20px] leading-[32px] self-stretch text-[#c4c4c4]'>
				About Us
			</div>
			<div className='flex flex-col self-stretch gap-[32px]'>
				<div className='flex flex-col gap-[16px]'>
					<div className='capitalize font-Manrope text-[24px] sm:text-[32px] leading-[125%] self-stretch text-[#4b0082]'>
						Get to know about us
					</div>
					{/* <div className='grid'>
						<img
							src={blogThumbnail}
							alt=''
							className='w-full object-contain'
						/>
					</div> */}
					<div className='font-Open font-light text-[14px] sm:text-[18px] leading-[178%] text-[rgba(0,0,0,0.5)]'>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut
						voluptatum itaque eius. Delectus sit adipisci perspiciatis,
						laudantium sapiente modi aut numquam blanditiis perferendis at harum
						quam nulla laboriosam ducimus iste quidem sequi impedit mollitia
						quisquam eos. Eveniet deserunt dolores totam atque harum ad, culpa
						voluptatem soluta sunt, consequuntur consectetur error? Aliquid
						veritatis fugit sapiente in qui cum minima vel totam minus
						voluptates libero ipsam doloremque doloribus eveniet amet sunt dicta
						expedita, harum commodi, iure optio autem laboriosam pariatur ipsum.
						Exercitationem sint quos sed aliquam! Tempore facere magnam
						laudantium ut minima harum at molestias, itaque a, dolorem ad quos
						facilis neque.
					</div>
				</div>
				<div className='flex flex-col gap-[16px]'>
					<div className='capitalize font-Manrope text-[24px] sm:text-[32px] leading-[125%] self-stretch text-[#4b0082]'>
						who we are
					</div>
					<div className='font-Open font-light gtext-[14px] sm:text-[18px] leading-[178%] text-[rgba(0,0,0,0.5)]'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
						officia dolores nam accusantium magni nesciunt unde, natus
						perspiciatis mollitia illum quod adipisci repellat ipsum, suscipit
						corporis voluptatem cupiditate deleniti. Optio officiis, eum
						deserunt distinctio magnam quidem voluptatum, tempore pariatur
						officia ratione illum quae odio adipisci numquam laudantium in
						maiores exercitationem.
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
