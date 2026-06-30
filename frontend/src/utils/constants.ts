import { BlogType } from "../types/blog";
import { SingleProductType } from "../types/product";

export const initialSingleProduct = {
  _id: "",
  productName: "",
  description: "",
  featured: false,
  price: 0,
  priceID: "",
  discount: 0,
  category: "all",
  images: [],
  totalQuantity: 0,

  unit: "",
} as SingleProductType;

export const links = [
  {
    id: 1,
    text: "Home",
    url: "/",
  },
  {
    id: 2,
    text: "IFA",
    url: "/ifa",
  },
  {
    id: 3,
    text: "Ogboni",
    url: "/ogboni",
  },
  {
    id: 4,
    text: "Consultation",
    url: "/consultation",
  },
  {
    id: 5,
    text: "Blog",
    url: "/blog",
  },
  {
    id: 6,
    text: "Product",
    url: "/shop",
  },
  {
    id: 7,
    text: "About",
    url: "/about",
  },
  {
    id: 8,
    text: "Contact",
    url: "/contact",
  },
];

export const productCategory = [
  {
    title: "Enchanted Items",
    value: "Enchanted",
  },
  {
    title: "African Fabrics",
    value: "fabrics",
  },
  {
    title: "Roots and Herbs",
    value: "Herbs",
  },
  {
    title: "Isese Books",
    value: "isese",
  },
  {
    title: "African totems",
    value: "totem",
  },
];

export const tabBlock = ["all", "newest", "trending", "best sellers"];

export const periodOption = [
  { name: "custom", value: "custom" },
  { name: "today", value: "daily" },
  { name: "This week", value: "weekly" },
  { name: "This month", value: "monthly" },
  { name: "This year", value: "yearly" },
];

export const initialSingleBlog = {
  _id: "",
  title: "",
  author: "",
  createdAt: "",
  thumbnail: "",
  summary: "",
  content: "",
  keywords: "",
  featured: false,
} as BlogType;

export const priceFormat = (price: number) =>
  Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
export const products_url = `${import.meta.env.VITE_SERVER_URL}/product`;

export const single_product_url = `${import.meta.env.VITE_SERVER_URL}/product`;

export const auth_url = `${import.meta.env.VITE_SERVER_URL}/auth/google`;

export const blog_url = `${import.meta.env.VITE_SERVER_URL}/blog`;
