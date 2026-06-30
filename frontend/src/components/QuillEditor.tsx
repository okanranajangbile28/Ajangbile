import { useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Register custom fonts with Quill
const Font = Quill.import('formats/font');
Font.whitelist = [
	'dm-sans',
	'manrope',
	'open-sans',
	'roboto',
	'monda',
	'inter',
]; // Define your fonts here
Quill.register(Font, true);

const QuillEditor = ({
	label,
	handleEditorChange,
	value,
}: {
	label: string;
	handleEditorChange: (value: string) => void;
	value: string;
}) => {
	const quillRef = useRef<ReactQuill | null>(null);

	// Quill modules with custom font options
	const modules = {
		toolbar: [
			[
				{
					font: ['dm-sans', 'manrope', 'open-sans', 'roboto', 'monda', 'inter'],
				},
			],
			[{ header: [1, 2, 3, 4, 5, false] }],

			[{ color: ['#4b0082', '#c4c4c4'] }],
			['clean'],
			[{ header: '1' }, { header: '2' }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['link', 'image'],
		],
	};
	return (
		<div className='flex flex-col gap-[24px] pb-[32px]'>
			<div className='font-Manrope font-bold text-[16px] sm:text-[24px] leading-[33px] text-[#01248c] capitalize'>
				{label}
			</div>
			<ReactQuill
				theme='snow'
				ref={quillRef}
				value={value}
				onChange={handleEditorChange}
				modules={modules}
				className='min-h-[20vh]'
			/>
		</div>
	);
};

export default QuillEditor;
