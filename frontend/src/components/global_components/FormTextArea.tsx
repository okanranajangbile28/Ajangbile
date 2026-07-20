import type { TextareaHTMLAttributes } from "react";

type FormTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const FormTextArea = (props: FormTextAreaProps) => {
  return (
    <div className="bg-white border border-[#868686] grid rounded-[10px]">
      <textarea
        rows={5}
        className="font-Open text-[16px] leading-[26px] bg-[#f9f9f9] rounded-[10px] p-[12px] focus:outline-none"
        {...props}
      />
    </div>
  );
};

export default FormTextArea;
