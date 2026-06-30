import { OrderType } from '../order';

export type UserType = {
	id: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	photo: string;
	role: string;
};

export type UserStateType = {
	remove_auth_error: string;
	clicked: boolean;
	visitor_count: number;
	fetch_user_error: string;
	fetch_order_error: string;
	visitor_count_error: string;
	loading: boolean;

	isAuthenticated: boolean;
	authentication_error: string;
	user: UserType;
	orders: OrderType[];
	imageFile: {
		file: File | undefined;
		filePreview: string | undefined;
	};
};

export type userActionType = {
	type: string;
	payload?: OrderType[] | UserType | File;
};
