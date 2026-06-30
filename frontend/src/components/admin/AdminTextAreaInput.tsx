import { useState } from 'react';
import { useAppSelector } from '../../App/hooks';

type FormTextAreaProps = {
	onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	[key: string]:
		| ((event: React.ChangeEvent<HTMLTextAreaElement>) => void)
		| string
		| boolean
		| number;
};

const AdminTextAreaInput = (props: FormTextAreaProps) => {
	const [focused, setFocused] = useState(false);
	const { form } = useAppSelector((state) => state.admin);
	const { onChange, ...inputProps } = props;
	const handleFocus = () => {
		setFocused(true);
	};
	return (
		<div className='flex flex-col gap-[8px] items-start'>
			{props.label && (
				<label
					htmlFor={props.name as string}
					className='font-Manrope font-bold text-[16px] sm:text-[24px] leading-[33px] text-center text-[#01248c] capitalize'
				>
					{props.label as string}
				</label>
			)}
			<textarea
				{...inputProps}
				id={props.name as string}
				cols={30}
				rows={10}
				onChange={onChange}
				className='py-[18px] pl-[20px] bg-[#f2f4f7] rounded-[8px] self-stretch font-Manrope text-[14px] leading-[19px] text-[rgba(0,0,0,0.5)]'
				onBlur={handleFocus}
				onFocus={() => setFocused(true)}
				data-focused={focused.toString()}
				readOnly={
					props.mode === 'detail'
						? form.fieldMode === 'fixed'
							? true
							: false
						: false
				}
			/>
		</div>
	);
};

export default AdminTextAreaInput;
