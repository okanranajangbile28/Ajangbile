import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  customStyle?: string;
}

const FormInput = ({ customStyle = "", ...props }: FormInputProps) => {
  return (
    <div className="bg-white border border-[#868686] grid rounded-[10px]">
      <input
        className={`font-Open text-[16px] leading-[26px] bg-[#f9f9f9] rounded-[10px] p-[12px] focus:outline-none ${customStyle}`}
        {...props}
      />
    </div>
  );
};

export default FormInput;
