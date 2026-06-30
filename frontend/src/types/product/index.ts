export type CategoryType = string;

export type SingleProductType = {
	_id?: string;
	productName: string;
	description: string;
	featured: boolean;
	price: number;
	priceID: string;
	discount: number;
	category: CategoryType;
	images: string[];
	totalQuantity: number;
	unit: string;
};
export type ProductStateType = {
	isSidebarOpen: boolean;
	showModal: boolean;
	products_loading: boolean;
	products_error: string;
	products: SingleProductType[];
	featured_products: SingleProductType[];
	single_product_loading: boolean;
	single_product_error: string;
	single_product: SingleProductType;
};
export type ProductActionType = {
	type: string;
	payload?: SingleProductType[] | SingleProductType;
};
