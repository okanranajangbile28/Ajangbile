import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { setAdminRoute } from '../../adminFeature/adminSlice';
import { Footer, Navbar, Sidebar } from '../../../components/global_components';
import { fetchBlogs } from '../../blogFeature/blogSlice';
import { fetchProducts } from '../../productFeature/productSlice';
import {
	filterProduct,
	loadProducts,
	sortProduct,
} from '../../filterFeature/filterSlice';

const UserRoutes = () => {
	const dispatch = useAppDispatch();
	const { products } = useAppSelector((state) => state.product);

	const { sort, filters } = useAppSelector((state) => state.filter);

	useEffect(() => {
		dispatch(setAdminRoute(false));
	}, []);

	useEffect(() => {
		dispatch(fetchBlogs());
		dispatch(fetchProducts());
	}, []);

	useEffect(() => {
		dispatch(filterProduct());
		dispatch(sortProduct());
	}, [products, sort, filters]);

	useEffect(() => {
		if (products) dispatch(loadProducts(products));
	}, [products]);

	return (
		<>
			<Navbar />
			<Sidebar />
			<Outlet />
			<Footer />
		</>
	);
};

export default UserRoutes;
