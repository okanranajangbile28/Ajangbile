import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import AmountButtons from './AmountButtons';
import { addToCart } from '../../cartFeature/cartSlice';

import { useAppDispatch } from '../../../App/hooks';

import { SingleProductType } from '../../../types/product';

const AddToCart = ({ product }: { product: SingleProductType }) => {
	const { _id: id } = product;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [amount, _setAmount] = useState(1);

	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	return (
		<div className='grid'>
			<button
				className='flex justify-center items-center py-[12px] px-[32px] gap-[8px] bg-[#4b0082] rounded-[8px] font-Inter text-[16px] leading-[100%] text-[#f3f3f3]'
				onClick={() => {
					if (id) dispatch(addToCart({ id, amount, product }));
					navigate('/cart');
				}}
			>
				Add To Cart
			</button>
			<ToastContainer
				position='bottom-center'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
				style={{ fontFamily: 'Poppins', textAlign: 'center' }}
			/>
		</div>
	);
};

export default AddToCart;
