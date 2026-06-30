import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItemType, CartStateType } from '../../types/cart';
import { SingleProductType } from '../../types/product';
import { toast } from 'react-toastify';

export const handlePayStack = createAsyncThunk(
	'cart/handlePayStack',
	async ({
		shippingInfo,
		cart,
		total_amount,
		subtotal,
		total_items,
	}: Pick<
		CartStateType,
		'shippingInfo' | 'cart' | 'total_amount' | 'total_items' | 'subtotal'
	>) => {
		const response = await axios.post(
			`${import.meta.env.VITE_SERVER_URL}/order/paystack/checkout-session`,
			{
				shippingInfo: { ...shippingInfo },
				orderItems: cart,
				total_amount,
				subtotal,
				total_items,
			},
			{
				withCredentials: true,
			}
		);

		return response.data.data;
	}
);

export const handleStripe = createAsyncThunk(
	'cart/handleStripe',
	async ({ cart }: { cart: CartItemType[] }) => {
		const response = await axios.post(
			`${import.meta.env.VITE_SERVER_URL}/order/stripe-checkout`,
			{
				orderItems: cart,
			},
			{
				withCredentials: true,
			}
		);

		return response.data.session;
	}
);

const shippingInfoJSON = JSON.stringify({
	firstName: '',
	lastName: '',
	address: '',
	city: '',
	state: '',
	country: '',
	countryCode: '',
	phoneNumber: '',
	postCode: '',
	email: '',
	shippingMethod: '',
	shippingFee: 0,
	additionalInfo: '',
});

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		cart: JSON.parse(localStorage.getItem('cart') || '[]'),
		loading: true,
		handle_stripe_error: '',
		handle_paystack_error: '',
		checkout_loading: false,
		total_items: 0,
		subtotal: 0,
		total_amount: 0,
		create_order_error: '',
		shippingInfo: JSON.parse(
			localStorage.getItem('shipping') || shippingInfoJSON
		),
	} as CartStateType,
	reducers: {
		addToCart: (
			state,
			action: {
				type: string;
				payload: {
					id: string;
					amount: number;
					product: SingleProductType;
				};
			}
		) => {
			const { id, amount, product } = action.payload;
			const tempItem = state.cart.find((i) => i.productID === id);

			if (tempItem) {
				const tempCart = state.cart.map((cartItem) => {
					if (cartItem.productID === id) {
						const newAmount = cartItem.amount + Number(amount);
						// if (newAmount > cartItem.max) {
						// 	newAmount = cartItem.max;
						// }
						return { ...cartItem, amount: Number(newAmount) };
					} else {
						return cartItem;
					}
				});
				state.cart = tempCart;
			} else {
				const newItem = {
					productName: product.productName,
					amount: Number(amount),
					image: product.images[0],
					price: product.price,
					max: product.totalQuantity,
					productID: id,
				};

				state.cart.push(newItem);
			}

			toast.success('Added to cart successfully');
		},
		removeItem: (state, action) => {
			const temp = state.cart.filter(
				(item) => item.productID !== action.payload.productID
			);
			state.cart = temp;
		},
		//error
		toggleAmount: (state, action) => {
			const temp = state.cart.filter(
				(item) => item.productID !== action.payload.id
			);
			state.cart = temp;
		},
		setAmount: (state, action) => {
			const tempCarts = state.cart.map((item) => {
				if (item.productID === action.payload.id) {
					return { ...item, amount: action.payload.value };
				} else {
					return { ...item };
				}
			});
			state.cart = tempCarts;
		},
		clearCart: (state) => {
			state.cart = [];
			localStorage.removeItem('cart');
		},
		countCartTotal: (state) => {
			const { total_items, subtotal } = state.cart.reduce(
				(total, cartItem) => {
					const { amount, price } = cartItem;
					total.total_items += Number(amount);
					total.subtotal += price * amount;
					return total;
				},
				{
					total_items: 0,
					subtotal: 0,
				}
			);

			state.total_items = total_items;
			state.subtotal = subtotal;
			state.loading = false;
		},
		updateShipping: (state, action) => {
			const { detail, info } = action.payload;
			state.shippingInfo = { ...state.shippingInfo, [detail]: info };
		},
		createShipping: (state, action) => {
			state.shippingInfo = { ...state.shippingInfo, ...action.payload };
		},
		clearShipping: (state) => {
			localStorage.removeItem('shippingInfo');
			state.shippingInfo = {
				firstName: '',
				lastName: '',
				address: '',
				city: '',
				state: '',
				country: '',
				countryCode: '',
				phoneNumber: '',
				postCode: '',
				email: '',
				shippingMethod: '',
				shippingFee: 0,
				additionalInfo: '',
			};
		},
		updateCartTotal: (state) => {
			state.total_amount =
				state.subtotal + (state.shippingInfo.shippingFee || 0);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(handlePayStack.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(handlePayStack.fulfilled, (state, action) => {
			state.loading = false;
			state.handle_paystack_error = '';
			try {
				window.location.replace(action.payload);
			} catch (e) {
				window.location = action.payload;
			}
		});
		builder.addCase(handlePayStack.rejected, (state, action) => {
			state.loading = false;
			state.handle_paystack_error = action.error.message as string;
		});
		builder.addCase(handleStripe.pending, (state) => {
			state.checkout_loading = true;
		});
		builder.addCase(handleStripe.fulfilled, (state, action) => {
			state.checkout_loading = false;
			state.handle_stripe_error = '';
			try {
				window.location.replace(action.payload);
			} catch (e) {
				window.location = action.payload;
			}
		});
		builder.addCase(handleStripe.rejected, (state, action) => {
			state.checkout_loading = false;
			state.handle_stripe_error = action.error.message as string;
		});
	},
});

export const {
	addToCart,
	removeItem,
	toggleAmount,
	setAmount,
	clearCart,
	createShipping,
	updateCartTotal,
	countCartTotal,
	updateShipping,
	clearShipping,
} = cartSlice.actions;
export default cartSlice.reducer;
