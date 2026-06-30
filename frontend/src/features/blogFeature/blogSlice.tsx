import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { blog_url, initialSingleBlog } from '../../utils/constants';
import { BlogStateType, BlogType } from '../../types/blog';

export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async () => {
	const response = await axios.get(blog_url);
	return response.data.data;
});
export const fetchSingleBlog = createAsyncThunk(
	'blog/fetchSingleBlog',
	async (id: string) => {
		const response = await axios.get(`${blog_url}/${id}`);
		return response.data.data;
	}
);

const blogSlice = createSlice({
	name: 'Blog',
	initialState: {
		blogs_loading: false,
		blog_error: '',
		blogs: [],
		featured_blogs: [],
		single_blog_loading: false,
		single_blog_error: '',
		showModal: false,
		single_blog: initialSingleBlog,
	} as BlogStateType,
	reducers: {
		removeBlog: (state, action) => {
			state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
		},
		openModal: (state) => {
			state.showModal = true;
		},
		closeModal: (state) => {
			state.showModal = false;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchBlogs.pending, (state) => {
			state.blogs_loading = true;
			state.blog_error = '';
		});
		builder.addCase(
			fetchBlogs.fulfilled,
			(state, action: { type: string; payload: BlogType[] }) => {
				// const featured_products = action.payload.filter(
				//   (product) => product.featured === true
				// );

				state.blogs_loading = false;
				state.blogs = action.payload;
				state.featured_blogs = action.payload.filter((x) => x.featured);
				state.blog_error = '';
				// state.featured_products = featured_products;
			}
		);
		builder.addCase(fetchBlogs.rejected, (state, action) => {
			state.blogs_loading = false;
			state.blog_error = action.error.message as string;
		});
		builder.addCase(fetchSingleBlog.pending, (state) => {
			state.single_blog_loading = true;
			state.single_blog = { ...initialSingleBlog };
			state.single_blog_error = '';
		});
		builder.addCase(
			fetchSingleBlog.fulfilled,
			(state, action: { payload: BlogType }) => {
				state.single_blog_loading = false;
				state.single_blog = action.payload;
				state.single_blog_error = '';
			}
		);
		builder.addCase(fetchSingleBlog.rejected, (state, action) => {
			state.single_blog_loading = false;
			state.single_blog_error = action.error.message as string;
		});
	},
});

export const { removeBlog, openModal, closeModal } = blogSlice.actions;
export default blogSlice.reducer;
