export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

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
  sellNumber?: number;
  gallery: string[];
  description: string;
  colors?: string[];
  dan?: string;
  moq?: number;
  supplierName?: string;
  supplierRating?: number;
  supplierResponseTime?: string;
  supplierResponseRate?: string;
  isVerifiedSupplier?: boolean;
  isTradeAssurance?: boolean;
  priceTiers?: { minQty: number; maxQty?: number; price: number }[];
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
  loyaltyPoints?: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'onTheWay' | 'completed' | 'cancelled';
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

export interface ToastNotification {
  _id: string;
  type: 'sale' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  product?: Product;
  priceDropDetails?: {
    oldPrice: number;
    newPrice: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
