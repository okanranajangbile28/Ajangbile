export type ShippingInfoTypes = {
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	city: string;
	phoneNumber: string;
	postCode: string;
	country: string;
	shippingFee: number;
	shippingMethod: string;
	countryCode: string;
	state: string;
};

export type OrderItemType = {
	productName: string;
	amount: number;
	price: number;
	image: string;
	sizes: { size: string; quantity: string; _id: string }[];
	productID: {
		id: string;
		collectionName: string;
		sizes: { size: string; quantity: string; _id: string }[];
		totalQuantity: number;
	};
};

export type PaymentInfoType = {
	reference: string | JSX.Element;
	gateway: string;
	channel?: string;
	status?: string;
};

export type OrderType = {
	_id: string;
	shippingInfo: ShippingInfoTypes;
	// user: UserType;
	orderItems: OrderItemType[];
	additionalInfo: string;
	paymentInfo: PaymentInfoType;
	createdAt: string;
	paidAt?: string;
	taxPrice: number;
	deliveredAt: string;
	total_amount: number;
	subtotal: number;
	orderStatus: 'pending' | 'completed';
	total_items: number;
};

export interface ChildrenProps {
	children: React.ReactNode;
}

export type orderTableDataProps = (Omit<OrderType, '_id' | 'total_amount'> & {
	total_amount: string;
})[];

export type OrderStateType = {
	loading: boolean;
	orders: OrderType[];
	create_order_error: string;
};

export type countryTypes = {
	value: string;
	label: string;
	countryCode: string;
};
