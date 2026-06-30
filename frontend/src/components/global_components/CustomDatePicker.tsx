import { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useAppDispatch } from '../../App/hooks';
import { setCustomDate } from '../../features/adminFeature/adminSlice';

const CustomDatePicker = () => {
	const dispatch = useAppDispatch();
	const [selectedRange, setSelectedRange] = useState([
		{ startDate: new Date(), endDate: new Date(), key: 'selection' },
	]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSelect = (ranges: any) => {
		setSelectedRange([ranges.selection]);
	};

	useEffect(() => {
		const start = new Date(
			selectedRange[0].startDate.toISOString()
		).toLocaleDateString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		const end = selectedRange[0].endDate.toLocaleDateString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		dispatch(setCustomDate({ start, end }));
	}, [selectedRange]);

	const maxDate = new Date();
	const minDate = new Date(2024, 0, 1);

	return (
		<DateRangePicker
			ranges={selectedRange}
			onChange={handleSelect}
			showPreview
			moveRangeOnFirstSelection={false}
			maxDate={maxDate}
			minDate={minDate}
		/>
	);
};

export default CustomDatePicker;
