import { useEffect } from 'react';
import Explore from '../components/home/Explore';
import FeaturedBlogs from '../components/home/FeaturedBlogs';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Hero from '../components/home/Hero';
import Testimonials from '../components/home/Testimonials';

const HomePage = () => {
	useEffect(() => {
		document.title = 'Okanran Ajangbile | Home';
	}, []);
	return (
		<div className=''>
			<Hero />
			<Explore />
			<FeaturedProducts />
			<FeaturedBlogs />
			<Testimonials />
		</div>
	);
};

export default HomePage;
