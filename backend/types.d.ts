import { Document, Model, Query, Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      requestTime?: string;
    }
  }
}

export {};

export interface PopOptions {
  path: string;
  select?: string;
}

export interface NewField {
  field: string;
  acc: string | number;
}

export type Period = Record<
  'daily' | 'weekly' | 'monthly' | 'yearly',
  'day' | 'week' | 'month' | 'year'
>;

export type PeriodKey = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export type PaypalCartType = {
  name: string;
  unit_amount: {
    currency_code: string;
    value: string;
  };
  description: string;
  quantity: string;
  category: 'PHYSICAL_GOODS';
};

export type IBaseObject = {
  productID: string;
  productName: string;
  price: number;
  image: string;
  totalQuantity: number;
  sizes: IOrderItemSize[];
};

export interface IShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postCode?: number;
  country: string;
  countryCode: string;
  shippingFee: number;
  shippingMethod?: string;
  additionalInfo?: string;
}

export interface IOrderItemSize {
  size: string;
  quantity: number;
}

export interface IOrderItem {
  productName: string;
  price: number;
  image: string;
  sizes: IOrderItemSize[];
  productID: string;
}

export interface CartItem {
  productName: string;
  amount: number;
  size: string;
  image: string;
  price: number;
  max: number;
  productID: string;
}

interface IPaymentInfo {
  reference: string;
  gateway: string;
  channel?: string;
  status?: string;
}

export interface IOrder extends Document {
  shippingInfo: IShippingInfo;
  additionalInfo?: string;
  orderItems: IOrderItem[];
  paymentInfo: IPaymentInfo;
  createdAt?: Date;
  paidAt?: Date;
  taxPrice: number;
  total_items: number;
  subtotal: number;
  total_amount: number;
  orderStatus: 'pending' | 'shipped' | 'completed' | 'failed';
  deliveredAt?: Date;
}

// ================= PRODUCT =================

export interface ISize {
  size: string;
  quantity: number;
  custom: boolean;
}

export interface IProduct extends Document {
  productName: string;
  description: string;
  price: number;
  priceID: string;
  featured: boolean;
  discount: number;
  totalQuantity: number;
  category: string;
  images: string[];
  unit: string;
  active: boolean;
}

// ================= REVIEW =================

export interface IReviewModel extends Model<IReview>, IReviewStatics {}

export interface IReview extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  product: Types.ObjectId;
  user: Types.ObjectId;
}

export interface IReviewQuery extends Query<any, IReview> {
  r?: IReview | null;
}

export interface IReviewStatics {
  calcAverageRatings(productId: Types.ObjectId): void;
}

// ================= USER =================

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  fullname: string;

  username: string;
  email: string;

  phone: string;
  gender: string;
  occupation: string;

  chieftaincyTitle?: string;

  state: string;
  localGovernment: string;
  city: string;
  address: string;

  photo?: string;

  role: 'admin' | 'developer' | 'member';

  approvalStatus: 'Pending' | 'Approved' | 'Rejected';

  approvedAt?: Date;

  approvedBy?: Types.ObjectId;

  password: string;
  passwordConfirm?: string;

  passwordChangedAt?: Date;

  passwordResetToken?: string;

  passwordResetExpires?: number;

  active: boolean;
}

export interface IUserMethods {
  createPasswordResetToken(): string;

  changedPasswordAfter(JWTTimestamp: number): boolean;

  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
}

// ================= TESTIMONIAL =================

export interface ITestimonial extends Document {
  fullName: string;
  quote: string;
  authorImage: string;
}

// ================= BLOG =================

export interface IBlog extends Document {
  title: string;
  author: string;
  summary: string;
  thumbnail: string;
  content: string;
  active: boolean;
  featured: boolean;
  keywords: string;
}
