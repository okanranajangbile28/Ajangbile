import { AdminState } from '../admin';
import { CartStateType } from '../cart';
import { FilterStatetype } from '../filter';
import { ProductStateType } from '../product';
import { UserStateType } from '../user';
// import { sizeAbbr } from '../utils/constants';

export type StoreType = {
	admin: AdminState;
	cart: CartStateType;
	filter: FilterStatetype;
	product: ProductStateType;
	user: UserStateType;
};

export type sideBarLinks = { id: number; text: string; url: string };
