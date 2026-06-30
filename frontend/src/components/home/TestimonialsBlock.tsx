const TestimonialsBlock = ({
	quote,
}: // position,
Record<'name' | 'quote' | 'position', string>) => {
	return (
		<div
			className='flex flex-col p-[20px] min-[350px]:p-[40px] gap-[40px] bg-white sm:min-w-[350px] rounded-[12px] h-fit'
			style={{ boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)' }}
		>
			<div className='font-Open max-sm:text-[16px] max-sm:leading-[26px] text-[24px] leading-[36px] text-black'>
				{quote}
			</div>
			{/* <div className='flex items-center gap-[10px]'>
				<div className='w-[58px] aspect-square'>
					<img
						src={img}
						alt=''
						className='h-full'
					/>
				</div>
				<div className='font-open'>
					<div className='font-bold max-sm:text-[12px] text-[16px] leading-[32px] text-[#0a2640]'>
						{name}
					</div>
					 <div className='max-sm:text-[12px] max-sm:leading-[16px] text-[14px] leading-[32px] text-[#0a2640] font-Open capitalize '>
						{position}
					</div> 
				</div>
			</div> */}
		</div>
	);
};

export default TestimonialsBlock;
