const FormInput = (props: Record<string, string>) => {
	const { customStyle, ...otherProps } = props;
	return (
		<div className='bg-white  border border-[#868686] grid'>
			<input
				type='text'
				className={`font-Open text-[16px] leading-[26px] bg-[#f9f9f9] rounded-[10px] p-[12px] focus:outline-none ${customStyle}`}
				{...otherProps}
			/>
		</div>
	);
};

export default FormInput;
