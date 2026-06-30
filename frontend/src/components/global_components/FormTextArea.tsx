const FormTextArea = (props: Record<string, string>) => {
	return (
		<div className='bg-white border border-[#868686] grid'>
			<textarea
				className='font-Open text-[16px] leading-[26px] bg-[#f9f9f9] rounded-[10px] p-[12px] focus:outline-none'
				rows={5}
				{...props}
			/>
		</div>
	);
};

export default FormTextArea;
