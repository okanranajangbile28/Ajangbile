import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useState,
} from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { SpinnerCircular } from 'spinners-react';
import { useAppDispatch, useAppSelector } from '../App/hooks';
import { jwtAuth } from '../features/userFeature/userSlice';
import AdminFormInput from '../components/admin/AdminFormInput';

const LoginPage = () => {
	const { authentication_error, loading } = useAppSelector(
		(state) => state.user
	);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const dispatch = useAppDispatch();
	const [isFormValid, setIsFormValid] = useState(true);
	const [showError, setShowError] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowError(false);
		}, 10000);
		return () => clearTimeout(timer);
	}, [showError]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value, validity } = e.target;

		if (validity.valid) setIsFormValid(true);
		setCredentials({ ...credentials, [name]: value });
	};

	const handleSubmit = async (
		e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
	) => {
		e.preventDefault();

		// Get all form elements
		const form = e.currentTarget.form;
		if (!form) {
			console.error('Form not found');
			return;
		}

		const formElements = form.elements;

		// Check validity for each form element
		for (let i = 0; i < formElements.length; i++) {
			const element = formElements[i] as HTMLInputElement;

			if (element instanceof HTMLInputElement) {
				if (!element.validity.valid) {
					setIsFormValid(false);
					setShowError(true);
					console.log('form is not valid');
					return; // Stop checking if any field is invalid
				}
			}
		}

		// If all fields are valid, navigate to the next stage
		if (isFormValid) {
			await dispatch(jwtAuth([credentials.email, credentials.password]));

			if (!authentication_error) {
				const redirectTo = searchParams.get('redirectTo');

				if (redirectTo) {
					navigate(redirectTo);
				} else {
					navigate('/admin/');
				}
			}
		}
	};

	return (
		<div className='bg-white flex w-full justify-center px-5  items-center py-3'>
			<form
				className='bg-opacity-60 border border-gray-200 bg-clip-padding h-fit w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-[48px] justify-center sm:p-12  px-4 py-10 bg-white shadow-lg rounded-3xl'
				style={{ backdropFilter: '20px' }}
			>
				<h2 className='flex self-start text-[#4b0082] font-semibold'>
					OA Admin Login
				</h2>
				<div className='flex flex-col gap-[24px]'>
					<div
						className={`text-[#ed0000] font-DM text-[12px] ${
							!showError && 'hidden'
						}`}
					>
						*Complete filling the information
					</div>
					<div
						className={`text-[#ed0000] font-DM text-[12px] ${
							!authentication_error && 'hidden'
						}`}
					>
						*Invalid Credentials
					</div>
					<AdminFormInput
						type='email'
						name='email'
						className=''
						id='email'
						placeholder='Email'
						value={credentials.email}
						onChange={onChange}
						required
					/>
					<AdminFormInput
						type='password'
						name='password'
						id='password'
						className=''
						placeholder='password'
						value={credentials.password}
						onChange={onChange}
						required
					/>
				</div>

				<button
					onClick={handleSubmit}
					className='bg-[#4b0082] hover:shadow-md text-white py-[20px] border-[1.5px] border-[#4b0082] font-Manrope text-[16px] tracking-wide font-bold capitalize flex justify-center'
				>
					{loading ? (
						<SpinnerCircular
							secondaryColor={'#fff'}
							color='white'
							size={35}
						/>
					) : (
						'Submit'
					)}
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
