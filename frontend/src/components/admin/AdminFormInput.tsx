import { useState } from 'react';
import { useAppSelector } from '../../App/hooks';

interface FormInputProps {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	[key: string]:
		| string
		| boolean
		| null
		| RegExp
		| number
		| ((event: React.ChangeEvent<HTMLInputElement>) => void);
}

const AdminFormInput = (props: FormInputProps) => {
	const [focused, setFocused] = useState(false);
	const { form } = useAppSelector((state) => state.admin);
	const { onChange, ...inputProps } = props;

	const handleFocus = () => {
		setFocused(true);
	};
	return (
		<div className='flex flex-col gap-[8px] items-start'>
			{props.id && (
				<label
					htmlFor={props.id as string}
					className={`font-Manrope font-bold text-[16px] sm:text-[24px] leading-[33px] text-center text-[#01248c] capitalize ${props.labelcustomstyle}`}
				>
					{props.label as string}
				</label>
			)}
			<input
				{...inputProps}
				onChange={onChange}
				onBlur={handleFocus}
				onFocus={() => setFocused(true)}
				data-focused={focused.toString()}
				// required
				readOnly={
					props.mode === 'detail'
						? form.fieldMode === 'fixed'
							? true
							: false
						: false
				}
				className={`flex items-center py-[18px] pl-[20px] bg-[#f2f4f7] rounded-[8px] self-stretch font-Manrope text-[14px] leading-[19px] text-[rgba(0,0,0,0.5)] ${props.inputcustomstyle}`}
			/>
		</div>
	);
};

export default AdminFormInput;
