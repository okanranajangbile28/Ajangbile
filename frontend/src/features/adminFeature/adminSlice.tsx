import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { initialSingleBlog, initialSingleProduct } from '../../utils/constants';
import { AdminState } from '../../types/admin';

export const fetchOrderStats = createAsyncThunk(
	'admin/fetchOrderStats',
	async ({
		period,
		start,
		end,
	}: {
		period: string;
		start?: string;
		end?: string;
	}) => {
		const response = await axios.get(
			`${import.meta.env.VITE_SERVER_URL}/order/pctchange?time=${period}${
				start && end
					? `&customTimeStart=${encodeURIComponent(
							start
					  )}&customTimeEnd=${encodeURIComponent(end)}`
					: ''
			}`,
			{ withCredentials: true }
		);

		return response.data.stats;
	}
);
export const fetchVisitorStats = createAsyncThunk(
	'admin/fetchVisitorStats',
	async (period: string) => {
		const response = await axios.get(
			`${import.meta.env.VITE_SERVER_URL}/visitor/pctchange?time=${period}`,
			{ withCredentials: true }
		);
		return response.data.stats;
	}
);

export const fetchOrders = createAsyncThunk('admin/fetchOrders', async () => {
	const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/order`, {
		withCredentials: true,
	});
	return response.data.data;
});

export const fetchSingleOrder = createAsyncThunk(
	'admin/fetchSingleOrder',
	async (id: string) => {
		const response = await axios.get(
			`${import.meta.env.VITE_SERVER_URL}/order/${id}`,
			{ withCredentials: true }
		);
		return response.data.data;
	}
);

export const createProduct = createAsyncThunk(
	'admin/createProduct',
	async (data: FormData) => {
		await axios.post(`${import.meta.env.VITE_SERVER_URL}/product`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			withCredentials: true,
		});
	}
);
export const createBlog = createAsyncThunk(
	'admin/createBlog',
	async (data: FormData) => {
		await axios.post(`${import.meta.env.VITE_SERVER_URL}/blog`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			withCredentials: true,
		});
	}
);

export const updateProduct = createAsyncThunk(
	'admin/updateProduct',
	async ({ id, data }: { id: string; data: FormData }) => {
		const response = await axios.put(
			`${import.meta.env.VITE_SERVER_URL}/product/${id}`,
			data,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true,
			}
		);
		return response.data;
	}
);
export const updateBlog = createAsyncThunk(
	'admin/updateBlog',
	async ({ id, data }: { id: string; data: FormData }) => {
		const response = await axios.put(
			`${import.meta.env.VITE_SERVER_URL}/blogs/${id}`,
			data,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true,
			}
		);
		return response.data;
	}
);

export const deleteProduct = createAsyncThunk(
	'admin/deleteProduct',
	async (id: string) => {
		await axios.delete(`${import.meta.env.VITE_SERVER_URL}/product/${id}`, {
			withCredentials: true,
		});
	}
);
export const deleteBlog = createAsyncThunk(
	'admin/deleteBlog',
	async (id: string) => {
		await axios.delete(`${import.meta.env.VITE_SERVER_URL}/blogs/${id}`, {
			withCredentials: true,
		});
	}
);

export const updateOrderStatus = createAsyncThunk(
	'admin/updateOrderStatus',
	async ({
		id,
		orderStatus,
	}: {
		id: string;
		orderStatus: 'pending' | 'completed';
	}) => {
		const response = await axios.patch(
			`${import.meta.env.VITE_SERVER_URL}/order/${id}`,
			{
				orderStatus,
			},
			{ withCredentials: true }
		);
		return response.data.data;
	}
);

export const getTopProducts = createAsyncThunk(
	'admin/getTopProducts',
	async ({
		period,
		start,
		end,
	}: {
		period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
		start?: string;
		end?: string;
	}) => {
		const response = await axios.get(
			`${import.meta.env.VITE_SERVER_URL}/order/bestSellers?period=${period}${
				start && end
					? `&customTimeStart=${encodeURIComponent(
							start
					  )}&customTimeEnd=${encodeURIComponent(end)}`
					: ''
			}`,
			{ withCredentials: true }
		);
		return response.data.data;
	}
);
export const getAggregateOrder = createAsyncThunk(
	'admin/aggregateOrder',
	async ({
		period,
		start,
		end,
	}: {
		period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
		start?: string;
		end?: string;
	}) => {
		const response = await axios.get(
			`${
				import.meta.env.VITE_SERVER_URL
			}/order/aggregateOrder?period=${period}${
				start && end
					? `&customTimeStart=${encodeURIComponent(
							start
					  )}&customTimeEnd=${encodeURIComponent(end)}`
					: ''
			}`,
			{ withCredentials: true }
		);

		return response.data.data;
	}
);

const initialState = {
	loading: false,
	openModal: false,
	showSidebar: false,
	adminRoute: false,
	sideMenuValue: 'overview',
	modalTitle: '',
	modalRef: '',
	showDelBtn: false,
	error: {
		submit_product: '',
		submit_blog: '',
		fetch_order: '',
		fetch_order_stat: '',
		fetch_visitor_stat: '',
		fetch_single_order: '',
		fetch_best_seller: '',
		aggregateOrder: '',
		product: '',
		blog: '',
	},
	customDate: {
		show: false,
		start: '',
		end: '',
		period: false,
		periodType: 'monthly',
	},
	stat: {
		revenue: { current: 0, previous: 0, percentage: 0 },
		order: { current: 0, previous: 0, percentage: 0 },
		visitor: { current: 0, previous: 0, percentage: 0 },
		sales: { current: 0, previous: 0, percentage: 0 },
	},

	order: {
		single: {
			_id: '',
			shippingInfo: {
				firstName: '',
				lastName: '',
				email: '',
				address: '',
				city: '',
				phoneNumber: '',
				postCode: '',
				country: '',
				shippingFee: 0,
				shippingMethod: '',
				countryCode: '',
				state: '',
			},
			additionalInfo: '',
			orderItems: [],
			paymentInfo: { reference: '', gateway: '', channel: '', status: '' },
			createdAt: '',
			paidAt: '',
			taxPrice: 0,
			deliveredAt: '',
			total_amount: 0,
			subtotal: 0,
			orderStatus: 'pending',
			total_items: 0,
		},
		all: [],
		aggregate: [],
	},
	bestSeller: [],
	form: {
		tempProduct: JSON.parse(
			localStorage.getItem('product') ||
				JSON.stringify({
					...initialSingleProduct,
					category: '',
				})
		),
		tempBlog: JSON.parse(
			localStorage.getItem('blog') ||
				JSON.stringify({
					...initialSingleBlog,
				})
		),
		previewBlog: false,
		previewProduct: false,
		errorMessage: false,
		isValid: true,
		fieldMode: 'fixed',
		images: [],
	},
} as AdminState;

const adminSlice = createSlice({
	name: 'admin',
	initialState,
	reducers: {
		changeTimeRange: (
			state,
			action: {
				type: string;
				payload: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
			}
		) => {
			state.customDate.periodType = action.payload;
		},
		setCustomDate: (state, action) => {
			state.customDate.start = action.payload.start;
			state.customDate.end = action.payload.end;
		},

		enableCustomPeriod: (state) => {
			state.customDate.period = true;
		},
		disableCustomPeriod: (state) => {
			state.customDate.period = false;
		},
		openCustomCalendar: (state) => {
			state.customDate.show = true;
		},
		closeCustomCalendar: (state) => {
			state.customDate.show = false;
		},
		setAdminRoute: (state, action) => {
			state.adminRoute = action.payload;
		},
		openAdminModal: (
			state,
			action: { type: string; payload: { id: string; title: string } }
		) => {
			state.openModal = true;
			state.modalRef = action.payload.id;
			state.modalTitle = action.payload.title;
		},
		closeAdminModal: (state) => {
			state.openModal = false;
			state.modalRef = '';
			state.modalTitle = '';
		},
		toggleDelBtn: (state) => {
			state.showDelBtn = !state.showDelBtn;
		},
		changeSideMenuValue: (state, action) => {
			state.sideMenuValue = action.payload;
		},
		openAdminSidebar: (state) => {
			state.showSidebar = true;
		},
		closeAdminSidebar: (state) => {
			state.showSidebar = false;
		},
		resetFormProduct: (state) => {
			state.form.tempProduct = { ...initialState.form.tempProduct };
		},
		resetFormBlog: (state) => {
			state.form.tempBlog = { ...initialState.form.tempBlog };
		},
		loadFormProduct: (state, action) => {
			state.form.tempProduct = action.payload;
		},
		updateFormProduct: (state, action) => {
			const { detail, info } = action.payload;
			state.form.tempProduct = { ...state.form.tempProduct, [detail]: info };
		},
		loadFormBlog: (state, action) => {
			state.form.tempBlog = action.payload;
		},
		updateFormBlog: (state, action) => {
			const { detail, info } = action.payload;
			state.form.tempBlog = { ...state.form.tempBlog, [detail]: info };
		},
		setShowErrorMessage: (state, action: { payload: boolean }) => {
			state.form.errorMessage = action.payload;
		},
		setFormValidity: (state, action: { payload: boolean }) => {
			state.form.isValid = action.payload;
		},
		setFieldMode: (state, action: { payload: 'fixed' | 'update' }) => {
			state.form.fieldMode = action.payload;
		},
		setFormImages: (state, action) => {
			if (Array.isArray(action.payload)) {
				state.form.images = [...action.payload];
			} else {
				state.form.images = [action.payload];
			}
		},
		enablePreviewBlog: (state) => {
			state.form.previewBlog = true;
		},
		enablePreviewProduct: (state) => {
			state.form.previewProduct = true;
		},
		disablePreviewBlog: (state) => {
			state.form.previewBlog = false;
		},
		disablePreviewProduct: (state) => {
			state.form.previewProduct = false;
		},
		clearFormImages: (state) => {
			state.form.images = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrderStats.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchOrderStats.fulfilled, (state, action) => {
				state.loading = false;
				state.error.fetch_order_stat = '';
				state.stat.sales.current = action.payload[0].current;
				state.stat.sales.previous = action.payload[0].previous;
				state.stat.sales.percentage = action.payload[0].percentageDifference;
				state.stat.revenue.current = action.payload[1].current;
				state.stat.revenue.previous = action.payload[1].previous;
				state.stat.revenue.percentage = action.payload[1].percentageDifference;
				state.stat.order.current = action.payload[2].current;
				state.stat.order.previous = action.payload[2].previous;
				state.stat.order.percentage = action.payload[2].percentageDifference;
			})
			.addCase(fetchOrderStats.rejected, (state, action) => {
				state.loading = false;
				state.error.fetch_order_stat = action.error.message as string;
			});
		builder
			.addCase(fetchVisitorStats.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchVisitorStats.fulfilled, (state, action) => {
				state.error.fetch_visitor_stat = '';
				state.loading = false;
				state.stat.visitor.current = action.payload[0].current;
				state.stat.visitor.previous = action.payload[0].previous;
				state.stat.visitor.percentage = action.payload[0].percentageDifference;
			})
			.addCase(fetchVisitorStats.rejected, (state, action) => {
				state.loading = false;
				state.error.fetch_visitor_stat = action.error.message as string;
			});
		builder
			.addCase(getTopProducts.pending, (state) => {
				state.loading = true;
				state.error.fetch_best_seller = '';
				state.bestSeller = [];
			})
			.addCase(getTopProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.error.fetch_best_seller = '';
				state.bestSeller = action.payload;
			})
			.addCase(getTopProducts.rejected, (state, action) => {
				state.loading = false;
				state.error.fetch_best_seller = action.error.message as string;
				state.bestSeller = [];
			});
		builder
			.addCase(fetchOrders.pending, (state) => {
				state.loading = true;
				state.error.fetch_order = '';
				state.order.all = [];
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.error.fetch_order = '';
				state.order.all = action.payload;
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.loading = false;
				state.error.fetch_order = action.error.message as string;
				state.order.all = [];
			});
		builder
			.addCase(fetchSingleOrder.pending, (state) => {
				state.loading = true;
				state.error.fetch_single_order = '';
				state.order.single = { ...initialState.order.single };
			})
			.addCase(fetchSingleOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.error.fetch_single_order = '';
				state.order.single = action.payload;
			})
			.addCase(fetchSingleOrder.rejected, (state, action) => {
				state.loading = false;
				state.error.fetch_single_order = action.error.message as string;
				state.order.single = initialState.order.single;
			});

		builder
			.addCase(deleteProduct.pending, (state) => {
				state.loading = true;
				state.error.product = '';
			})
			.addCase(deleteProduct.fulfilled, (state) => {
				state.loading = false;
				state.error.product = '';
				state.openModal = false;
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.loading = false;
				state.error.product = action.error.message as string;
			});

		builder
			.addCase(createProduct.pending, (state) => {
				state.loading = true;
				state.error.submit_product = '';
			})
			.addCase(createProduct.fulfilled, (state) => {
				state.loading = false;
				state.form.tempProduct = { ...initialSingleProduct };
				state.error.submit_product = '';
			})
			.addCase(createProduct.rejected, (state, action) => {
				state.loading = false;
				state.error.submit_product = action.error.message as string;
			});
		builder
			.addCase(updateProduct.pending, (state) => {
				state.loading = true;
				state.error.submit_product = '';
			})
			.addCase(updateProduct.fulfilled, (state) => {
				state.loading = false;
				state.error.submit_product = '';
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.loading = false;
				state.error.submit_product = action.error.message as string;
			});
		builder
			.addCase(deleteBlog.pending, (state) => {
				state.loading = true;
				state.error.blog = '';
			})
			.addCase(deleteBlog.fulfilled, (state) => {
				state.loading = false;
				state.error.blog = '';
				state.openModal = false;
			})
			.addCase(deleteBlog.rejected, (state, action) => {
				state.loading = false;
				state.error.blog = action.error.message as string;
			});

		builder
			.addCase(createBlog.pending, (state) => {
				state.loading = true;
				state.error.submit_blog = '';
			})
			.addCase(createBlog.fulfilled, (state) => {
				state.loading = false;
				state.form.tempBlog = { ...initialSingleBlog };
				state.error.submit_blog = '';
			})
			.addCase(createBlog.rejected, (state, action) => {
				state.loading = false;
				state.error.submit_blog = action.error.message as string;
			});
		builder
			.addCase(updateBlog.pending, (state) => {
				state.loading = true;
				state.error.submit_blog = '';
			})
			.addCase(updateBlog.fulfilled, (state) => {
				state.loading = false;
				state.error.submit_blog = '';
			})
			.addCase(updateBlog.rejected, (state, action) => {
				state.loading = false;
				state.error.submit_blog = action.error.message as string;
			});
		builder
			.addCase(updateOrderStatus.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				state.loading = false;
				state.order.single = {
					...state.order.single,
					orderStatus: action.payload.orderStatus,
				};
			})
			.addCase(updateOrderStatus.rejected, (state) => {
				state.loading = true;
			});
		builder
			.addCase(getAggregateOrder.pending, (state) => {
				state.loading = true;
				state.error.aggregateOrder = '';
			})
			.addCase(getAggregateOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.error.aggregateOrder = '';
				state.order.aggregate = action.payload;
			})
			.addCase(getAggregateOrder.rejected, (state, action) => {
				state.loading = false;
				state.error.aggregateOrder = action.error.message as string;
			});
	},
});

export const {
	changeTimeRange,
	enableCustomPeriod,
	disableCustomPeriod,
	setCustomDate,
	openCustomCalendar,
	closeCustomCalendar,
	openAdminModal,
	closeAdminModal,
	toggleDelBtn,
	changeSideMenuValue,
	openAdminSidebar,
	closeAdminSidebar,
	resetFormProduct,
	resetFormBlog,
	updateFormProduct,
	loadFormProduct,
	loadFormBlog,
	updateFormBlog,
	setShowErrorMessage,
	setFieldMode,
	setFormImages,
	setFormValidity,
	clearFormImages,
	setAdminRoute,
	enablePreviewBlog,
	enablePreviewProduct,
	disablePreviewBlog,
	disablePreviewProduct,
} = adminSlice.actions;
export default adminSlice.reducer;
