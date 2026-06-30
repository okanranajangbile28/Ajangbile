import GridView from './GridView';
// import ListView from './ListView';
import { useAppSelector } from '../../../App/hooks';
import { Fragment } from 'react';

const ProductList = () => {
	const { filtered_product: products } = useAppSelector(
		(state) => state.filter
	);

	if (products.length < 1)
		return (
			<h5
				style={{
					textTransform: 'none',
					fontFamily: 'Bell MT',
					marginTop: '5em',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				Sorry, no product match your search
			</h5>
		);
	return (
		<Fragment>
			{/* <ListView products={products} /> */}
			<GridView products={products} />
		</Fragment>
	);
};

export default ProductList;
