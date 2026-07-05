import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  sub_category: { type: String },
  rating: { type: Number, default: 5 },
  price: { type: Number, required: true },
  currency: { type: String, default: 'BDT' },
  quantity: { type: Number, default: 0 },
  sell_number: { type: Number, default: 0 },
  description: { type: String, required: true },
  gallery: [{ type: String }],
  colors: [{ type: String }],
  dan: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'delivery', 'user'], default: 'user' },
  photoURL: { type: String },
  createdAt: { type: String },
  loyaltyPoints: { type: Number, default: 0 }
}, { _id: false });

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'onTheWay', 'completed', 'cancelled'], default: 'pending' },
  date: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  deliveryMan: { type: String },
  deliveryDate: { type: String }
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: String, required: true }
}, { _id: false });

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  authorname: { type: String },
  comments: [CommentSchema]
}, { _id: false });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
