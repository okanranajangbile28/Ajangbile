import { Link } from 'react-router-dom';
import { links } from '../../../utils/constants';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa6';

import { IconType } from 'react-icons';

const Footer = () => {
	const linksBlock = links.map((link, index) => {
		return (
			<Link
				to={link.url}
				key={index}
				className='flex items-center justify-center py-[10px] sm:py-[14px] px-[24px] sm:px-[32px] gap-[8px] border-2 border-[#f9f9f9] rounded-[56px] font-Open font-bold text-[14px] sm:text-[20px] leading-[140%] text-[#f9f9f9]  hover:bg-white hover:text-[#4b0082] '
			>
				{link.text}
			</Link>
		);
	});
	const SocialMediaLink = (Icon: IconType) => (
		<button className=' text-white text-[20px]'>
			<Icon />
		</button>
	);
	return (
		<footer className='relative flex flex-col py-[43px] px-[24px] sm:px-[57px] gap-[47px] bg-[#4b0082] border-t-8 border-t-white sm:border-t-[0.5px] sm:border-t-[rgba(0,0,0,0.7)]'>
			<div className='absolute bottom-0 left-1/2 -translate-x-1/2'>
				<img
					src={
						'https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057470/OA/footerBg.webp'
					}
					alt=''
				/>
			</div>
			<div className='font-Manrope font-bold text-[24.25px] leading-[20px] flex items-center text-[#f9f9f9]'>
				Okanran
				<br />
				Ajangbile
			</div>
			<div className='w-full flex items-start justify-between'>
				<div className='flex flex-col gap-[28px]'>{linksBlock}</div>
				<div className='flex flex-col gap-[20px]'>
					<div className='flex gap-[16px] sm:gap-[32px] justify-end'>
						{SocialMediaLink(FaFacebook)}
						{SocialMediaLink(FaTwitter)}
						{SocialMediaLink(FaInstagram)}
					</div>
					<div className='flex flex-col font-Manrope font-medium text-[14px] sm:text-[23px] leading-[160%] items-end'>
						<div className='text-gray-300'>You can find us at:</div>

						<div className='text-white text-right'>
							No. 1 Osara Street, Ode-Eran, Obantoko,
							<br /> Abeokuta, Ogun state.
						</div>

						<div className='text-gray-300'>And reach us on:</div>

						<div className='flex justify-end text-white gap-1 '>
							<Link to='tel:+2349023323697'>+2349023323697</Link>
							<Link to='tel:+22967321203'>+22967321203</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
