const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const verifyToken = require('./authMiddleware');
const checkAdmin = require('./checkAdmin');
const authenticateToken = require('./authenticateToken');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});



// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Test route
app.get('/test', (req, res) => {
  res.send("Test route works!");
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Username already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertUserSql, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const [results] = await db.promise().query(sql, [username]); // Use .promise() and await

    // Check if the user exists
    if (results.length === 0) {
     
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
    
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login, include `role` in the token payload
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with token, userId, and role
    res.json({ token, userId: user.id, role: user.role });

    // Log the successful login attempt
   
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




//protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: "Protected data accessed successfully", userId: req.userId });
});

// USER REVIEWS FUNCTIONALITY 
// Post a review for a specific product by an authenticated user
app.post('/api/reviews', verifyToken, (req, res) => {
  const userId = req.userId;
  const { productId, rating, comment } = req.body;

  console.log('Received data:', { userId, productId, rating, comment });

  if (!productId || !rating || rating < 1 || rating > 5) {
    console.log('Validation failed');
    return res.status(400).json({ error: 'Invalid input. Product ID and rating (1-5) are required.' });
  }

  const checkSql = 'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?';
  db.query(checkSql, [userId, productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      console.log("review exists");
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    const insertSql = 'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [userId, productId, rating, comment], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to post review' });
      res.status(201).json({ message: 'Review posted successfully', reviewId: result.insertId });
    });
  });
});




// Get reviews for a specific product
app.get('/api/reviews/product/:productId', (req, res) => {
  const { productId } = req.params;
  const sql = `
    SELECT reviews.id, reviews.comment, reviews.rating, reviews.created_at, users.username 
    FROM reviews 
    JOIN users ON reviews.user_id = users.id 
    WHERE reviews.product_id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve product reviews' });
    res.json({ reviews: results });
  });
});



// Get reviews made by a specific user
app.get('/api/reviews/user/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT reviews.id, reviews.comment, reviews.rating, reviews.created_at, products.name AS product_name 
    FROM reviews 
    JOIN products ON reviews.product_id = products.id 
    WHERE reviews.user_id = ?
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve user reviews' });
    res.json({ reviews: results });
  });
});


// Edit a review made by the logged-in user
app.put('/api/reviews/:reviewId', verifyToken, (req, res) => {
  const { reviewId } = req.params;
  const userId = req.userId; // user ID from the token
  const { comment, rating } = req.body;

  const checkSql = 'SELECT * FROM reviews WHERE id = ? AND user_id = ?';
  db.query(checkSql, [reviewId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(403).json({ error: 'Unauthorized action' });

    const updateSql = 'UPDATE reviews SET comment = ?, rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(updateSql, [comment, rating, reviewId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update review' });
      res.json({ message: 'Review updated successfully' });
    });
  });
});


// Delete a review made by the logged-in user
app.delete('/api/reviews/:reviewId', verifyToken, (req, res) => {
  const { reviewId } = req.params;
  const userId = req.userId; // user ID from the token

  const deleteSql = 'DELETE FROM reviews WHERE id = ? AND user_id = ?';
  db.query(deleteSql, [reviewId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete review' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  });
});


// ADMIN PRIVILEGE TO DELETE A REVIEW
app.delete('/api/reviews', authenticateToken, checkAdmin, async (req, res) => {
  const reviewId = req.body.reviewId;

  if (!reviewId) {
    return res.status(400).json({ message: 'Review ID is required' });
  }

  try {
    const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(200).json({ message: 'REVIEW DELETED!' });
  }
});






// get a product's details
app.get('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  const sql = 'SELECT * FROM products WHERE id = ?';
  
  db.query(sql, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve product' });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    
    res.json({ product: results[0] });
  });
});



// Get all products and their details
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM products';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve products' });
    res.json({ products: results });
  });
});







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
