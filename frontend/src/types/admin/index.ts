import { ChangeEvent, SyntheticEvent } from 'react';

import { IconType } from 'react-icons';
import { OrderType } from '../order';
import { SingleProductType } from '../product';
import { BlogType } from '../blog';

export type BestSellerType = {
	_id: string;
	sizes: { size: string; quantity: number }[];
	totalQuantitySold: number;
	productName: string;
	collectionName: string;
	productImage: string[];
	price: number;
}[];

export type AdminState = {
	loading: boolean;
	openModal: boolean;
	adminRoute: boolean;
	modalTitle: string;
	sideMenuValue: 'overview' | 'product' | 'order' | 'bestSeller';
	modalRef: string;
	showSidebar: boolean;
	showDelBtn: boolean;
	error: {
		submit_product: string;
		submit_blog: string;
		fetch_order: string;
		fetch_order_stat: string;
		fetch_visitor_stat: string;
		fetch_single_order: string;
		fetch_best_seller: string;
		aggregateOrder: string;
		product: string;
		blog: string;
	};
	customDate: {
		show: boolean;
		start: string;
		end: string;
		period: boolean;
		periodType: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
	};
	stat: {
		revenue: { current: number; previous: number; percentage: number };
		order: { current: number; previous: number; percentage: number };
		visitor: { current: number; previous: number; percentage: number };
		sales: { current: number; previous: number; percentage: number };
	};
	order: {
		single: OrderType;
		all: OrderType[];
		aggregate: {
			_id: string;
			totalItemsSold: number;
			products: {
				productName: string;
				sizes: {
					// size: keyof typeof sizeAbbr;
					size: string;
					quantity: number;
				}[];
				images: string[];
				price: number;
			}[];
		}[];
	};
	bestSeller: BestSellerType;

	form: {
		tempProduct: SingleProductType;
		tempBlog: BlogType;
		errorMessage: boolean;
		isValid: boolean;
		previewBlog: boolean;
		previewProduct: boolean;

		fieldMode: 'fixed' | 'update';
		images: string[];
	};
};

export type AdminPageType = 'overview' | 'product' | 'order' | 'bestSeller';

export type HeroProps = {
	title: string;
	subtitle?: string;
	description: string;
	timeBased?: boolean;
	buttonType?: boolean;
	disableBtn?: boolean;
	customPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
	periodChangeFn?: (e: ChangeEvent<HTMLSelectElement>) => void;
	button?: {
		icon: IconType;
		name: string;
		action: (e: SyntheticEvent<HTMLButtonElement>) => void;
	}[];
};

export type stats = {
	time: string;
	stats: {
		current: number;
		previous: number;
		percentageDifference: number;
	};
};
