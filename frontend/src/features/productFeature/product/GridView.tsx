import { SingleProductType } from '../../../types/product';
import Product from './Product';

const GridView = ({
	products,
	customStyle,
	productStyle,
}: {
	products: SingleProductType[];
	customStyle?: string;
	productStyle?: string;
}) => {
	return (
		<div
			className={`grid grid-cols-4 py-[24px] md:px-[42px] gap-x-[24px] gap-y-[48px] justify-items-start ${customStyle}`}
		>
			{products.map((product) => {
				const { _id: id } = product;

				return (
					<Product
						key={id}
						{...product}
						customStyle={productStyle}
					/>
				);
			})}
		</div>
	);
};

export default GridView;
