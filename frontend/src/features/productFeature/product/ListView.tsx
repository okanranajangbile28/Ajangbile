import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { priceFormat } from '../../../utils/constants';
import { SingleProductType } from '../../../types/product';
const ListView = ({ products }: { products: SingleProductType[] }) => {
	return (
		<Wrapper className='flex flex-col tablet:hidden'>
			{products.map((product) => {
				const {
					_id: id,
					images,
					productName: name,
					price,
					totalQuantity,
				} = product;
				return (
					<Link
						to={`/shop/${id}`}
						key={id}
						className='border-b border-black flex flex-col h-[50vh] px-[24px] py-2'
					>
						<figure className='place-items-center h-3/4 flex justify-center'>
							<img
								src={images[0] as string}
								alt={name}
								className='aspect-[230/317] h-full object-contain'
							/>
						</figure>
						<div className='h-1/4 flex flex-col gap-2 justify-center'>
							<h4 className='text-baz-black font-baz2 text-[16px] font-semibold tracking-[1.6px]'>
								{name}
							</h4>
							<div
								className={`text-black font-normal leading-normal text-[20.926px] font-baz1 flex gap-1`}
							>
								<div className={`${totalQuantity > 0 ? '' : 'line-through'}`}>
									{priceFormat(price)}
								</div>
								<div>{totalQuantity > 0 ? '' : ' Sold-Out'}</div>
							</div>
						</div>
					</Link>
				);
			})}
		</Wrapper>
	);
};

const Wrapper = styled.section``;

export default ListView;
