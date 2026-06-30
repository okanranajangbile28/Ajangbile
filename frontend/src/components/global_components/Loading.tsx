import { FadeLoader } from 'react-spinners';
const Loading = () => {
	return (
		<div className='grid items-center justify-center min-h-[50vh] w-full'>
			<FadeLoader color='#4b0082' />
		</div>
	);
};

export default Loading;
