import { useState } from 'react';

const ImageWithSkeleton = ({
	src,
	alt,
	customStyle,
	customPlaceholder,
}: {
	src: string;
	alt: string;
	customStyle: string;
	customPlaceholder?: string;
}) => {
	const [isLoading, setIsLoading] = useState(true);
	return (
		<>
			{isLoading && (
				<div
					className={`inset-0 bg-gray-300 animate-pulse absolute h-full w-full ${customPlaceholder}`}
				></div>
			)}
			<img
				src={src}
				alt={alt}
				loading='lazy'
				onLoad={() => setIsLoading(false)}
				onError={() => setIsLoading(false)}
				className={`transition-opacity duration-300 ${
					isLoading ? 'opacity-0' : 'opacity-100'
				} ${customStyle}`}
			/>
		</>
	);
};

export default ImageWithSkeleton;
