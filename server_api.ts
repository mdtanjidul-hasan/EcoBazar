import { Application } from 'express';
import { Product, User, Order, Review, Blog } from './server_models';

export const setupAPI = (app: Application) => {
  // --- Products ---
  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(product);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Users ---
  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body; // Mock auth doesn't verify password here
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ error: 'User not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users/signup', async (req, res) => {
    try {
      const { email, name, role, photoURL } = req.body;
      let user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      user = new User({
        _id: uid,
        email: email.toLowerCase(),
        name,
        role: role || 'user',
        photoURL,
        createdAt: new Date().toISOString().split('T')[0]
      });
      await user.save();
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/users/:email', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { email: req.params.email }, 
        req.body, 
        { new: true }
      );
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Orders ---
  app.get('/api/orders', async (req, res) => {
    try {
      const orders = await Order.find().sort({ _id: -1 });
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const order = new Order(req.body);
      await order.save();
      res.status(201).json(order);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/orders/:id', async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(order);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/orders/:id', async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Reviews ---
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const review = new Review(req.body);
      await review.save();
      res.status(201).json(review);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Blogs ---
  app.get('/api/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/blogs/:id/comments', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      
      if (!blog.comments) blog.comments = [];
      blog.comments.push(req.body);
      await blog.save();
      res.json(blog);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
};

