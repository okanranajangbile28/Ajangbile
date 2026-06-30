import { SingleProductType } from '../product';

export type CartItemType = {
	productName: string;
	amount: number;

	image: string;
	price: number;
	max: number;
	productID: string;
};

export type CartStateType = {
	cart: CartItemType[];
	total_items: number;
	subtotal: number;
	loading: boolean;
	checkout_loading: boolean;
	handle_paystack_error: string;
	handle_stripe_error: string;
	total_amount: number;
	create_order_error: string;
	shippingInfo: {
		firstName: string;
		lastName: string;
		address: string;
		city: string;
		state: string;
		country: string;
		countryCode: string;
		phoneNumber: string;
		postCode: string;
		email: string;
		shippingMethod: string;
		shippingFee: number;
		additionalInfo: string;
	};
};

export type CartShippingTypes = CartStateType['shippingInfo'];

export type CartItemAndProduct = CartItemType & {
	product: SingleProductType;
};

export type CartActionType = {
	type: string;
	payload?:
		| Partial<CartItemType>
		| CartItemAndProduct
		| { product: SingleProductType; value: string }
		| { detail: string; info: string };
};
