import { Product, User, Order, Review, Blog } from './server_models';
import { INITIAL_PRODUCTS, INITIAL_BLOGS } from './src/data';

export const seedDB = async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log('Seeding Products and Blogs...');
    await Product.insertMany(INITIAL_PRODUCTS);
    await Blog.insertMany(INITIAL_BLOGS);
    
    // Seed default users
    const defaultUsers = [
      { _id: 'user_admin', email: 'admin@ecobazar.com', name: 'Maruf Hossen (Admin)', role: 'admin', photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', createdAt: '2026-01-10', loyaltyPoints: 1250 },
      { _id: 'user_delivery', email: 'delivery@ecobazar.com', name: 'Mishuk RJ (Delivery)', role: 'delivery', photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', createdAt: '2026-02-15', loyaltyPoints: 320 },
      { _id: 'user_customer', email: 'user@ecobazar.com', name: 'Zarin Tasnim', role: 'user', photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', createdAt: '2026-03-20', loyaltyPoints: 450 }
    ];
    await User.insertMany(defaultUsers);

    console.log('Database seeding completed successfully.');
  }
};
