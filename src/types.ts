export interface Product {
  _id: string;
  title: string;
  category: string;
  sub_category?: string;
  rating: number;
  price: number;
  currency?: string;
  quantity: number;
  sell_number?: number;
  gallery: string[];
  description: string;
  colors?: string[];
  dan?: string;
  sellNumber?: number;
}

export interface Blog {
  _id: string;
  title: string;
  category: string;
  image: string;
  author: string;
  date: string;
  description: string;
  authorname?: string;
  comments?: Comment[];
}

export interface Comment {
  name: string;
  email: string;
  comment: string;
  userImage?: string;
  blogId: string;
  date: string;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'delivery' | 'user';
  photoURL?: string;
  createdAt?: string;
}

export interface Order {
  _id: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: 'pending' | 'onTheWay' | 'completed';
  deliveryMan?: string;
  deliveryDate?: string;
  date: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface Review {
  _id: string;
  productId: string;
  name: string;
  email: string;
  comment: string;
  rating: number;
  date: string;
}
