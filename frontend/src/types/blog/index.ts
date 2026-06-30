export type BlogType = {
	_id: string;
	title: string;
	author: string;
	// date: number;
	thumbnail: string;
	summary: string;
	content: string;
	// active: boolean;
	createdAt: string;
	featured: boolean;
	keywords: string;
};

export type BlogStateType = {
	blogs_loading: boolean;
	blog_error: string;
	blogs: BlogType[];
	featured_blogs: BlogType[];
	single_blog_loading: boolean;
	single_blog_error: string;
	showModal: boolean;
	single_blog: BlogType;
};
