import { useEffect } from 'react';
import FormInput from '../components/global_components/FormInput';
import FormTextArea from '../components/global_components/FormTextArea';
import {
	MdOutlineLocationOn,
	MdOutlineLocalPhone,
	MdOutlineEmail,
} from 'react-icons/md';
import { Link } from 'react-router-dom';

const ContactPage = () => {
	useEffect(() => {
		document.title = 'Okanran Ajangbile | Contact';
	}, []);
	return (
		<div className='flex flex-col pt-[20px] pb-[80px] bg-white'>
			<div className='flex flex-col lg:items-center pt-[24px] pb-[10px] px-[10px] gap-[24px] bg-white'>
				<div className='grid lg:grid-cols-2 px-[24px] lg:px-[52px] py-[24px] justify-between gap-[100px]'>
					<div className='flex flex-col gap-[30px]'>
						<div className='flex flex-col gap-[20px]'>
							<div className='font-Manrope font-semibold text-[24px] md:text-[36px] leading-[127%] text-[#011334]'>
								Talk With Us
							</div>
							<div className='font-Manrope font-normal text-[16px] leading-[26px] text-[#011334]'>
								Questions, comments, or suggestions? Simply fill in the form and
								we’ll be in touch shortly.
							</div>
						</div>
						{/* <div> */}
						<ul className='flex flex-col gap-[15px]'>
							<li className='flex gap-[10px] items-center'>
								<span className='flex justify-center items-center pt-[4px] pr-[5px] gap-[10px] text-[#4b0082]'>
									<MdOutlineLocationOn size={30} />
								</span>
								<span className=' font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]'>
									No. 1 Osara Street, Ode-Eran, Obantoko, Abeokuta, Ogun state.
								</span>
							</li>
							<li className='flex gap-[10px] items-center'>
								<span className='flex justify-center items-center pt-[4px] pr-[5px] gap-[10px] text-[#4b0082]'>
									<MdOutlineLocalPhone size={30} />
								</span>
								<Link
									to='tel:+2349023323697'
									className=' font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]'
								>
									+2349023323697
								</Link>
								<Link
									to='tel:+22967321203'
									className=' font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]'
								>
									+22967321203
								</Link>
							</li>
							<li className='flex gap-[10px] items-center'>
								<span className='flex justify-center items-center pt-[4px] pr-[5px] gap-[10px] text-[#4b0082]'>
									<MdOutlineEmail size={30} />
								</span>
								<span className=' font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]'>
									Okanran Ajangbile@gmail.com
								</span>
							</li>
						</ul>
						{/* </div> */}
						{/* <div></div> */}
					</div>
					<div className='flex flex-col gap-[18px]'>
						<div
							className='flex flex-col justify-center items-center py-[48px] px-[24px] sm:p-[50px] gap-[10px] bg-white border border-[#bdbdbd] rounded-[10px]'
							style={{ boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.1)' }}
						>
							<div className='flex flex-col gap-[40px] w-full'>
								<div className='flex flex-col gap-[20px]'>
									<div className='grid min-[550px]:grid-cols-2 gap-[21px]'>
										<FormInput
											placeholder='First Name'
											customStyle='w-full'
										/>
										<FormInput
											placeholder='Last Name'
											customStyle='w-full'
										/>
									</div>
									<FormInput placeholder='Email' />
									<FormInput placeholder='Phone Number' />
									<FormTextArea placeholder='Your Message...' />
								</div>
								<button className='py-[12px] px-[32px] bg-[#4b0082] rounded-[8px] font-inter font-semibold text-[14px] leading-[14px] text-[#f3f3f3] flex justify-center'>
									Send Message
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
