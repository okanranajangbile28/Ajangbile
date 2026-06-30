import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { Loading } from '../../../components/global_components';
import { useEffect } from 'react';
import { fetchProfile } from '../../userFeature/userSlice';

const AdminRoutes = () => {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const { isAuthenticated, loading } = useAppSelector((state) => state.user);

	useEffect(() => {
		if (!isAuthenticated) dispatch(fetchProfile());
	}, [dispatch, isAuthenticated]);

	return loading ? (
		<Loading />
	) : isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate to={`/login?redirectTo=${location.pathname}`} />
	);
};

export default AdminRoutes;
