const Pagination = ({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}: {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (pageNumber: number) => void;
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const pageNumbers = Array.from(
		{ length: totalPages },
		(_, index) => index + 1
	);
	return (
		<div className='flex gap-[10px] mt-[32px]'>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className=' px-2 text-[#4b0082] font-bold flex items-center'
			>
				{'<'}
			</button>
			<div className=''>
				{pageNumbers.map((number) => {
					return (
						<button
							key={number}
							onClick={() => onPageChange(number)}
							className={`px-2 py-1 rounded-sm text-[12px]  hover:bg-[#4b0082] hover:text-white ${
								currentPage === number
									? 'bg-[#4b0082] text-white'
									: 'text-[#4b0082] bg-[#c4c4c4]'
							}`}
						>
							{number}
						</button>
					);
				})}
			</div>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className=' px-2 text-[#4b0082] font-bold flex items-center'
			>
				{'>'}
			</button>
		</div>
	);
};

export default Pagination;
