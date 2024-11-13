-- Create Database: This will create a new database named "reviews".
CREATE DATABASE reviews;

-- Switch to "reviews" database: This command sets the active database to "reviews".
USE reviews;

-- ==================================================================
-- 1. USERS TABLE
-- ==================================================================
-- This table stores user information. 
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- 2. PRODUCTS TABLE
-- ==================================================================
-- This table stores product information.

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adding "price" column to "products" table with a decimal format for storing prices.
ALTER TABLE products
ADD price DECIMAL(10, 2) NOT NULL;

-- ==================================================================
-- 3. REVIEWS TABLE
-- ==================================================================
-- This table stores user reviews for products.

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ==================================================================
-- SAMPLE SELECT QUERIES
-- ==================================================================
-- Select review with ID 38 (for testing or validation).
SELECT * FROM reviews WHERE id = 38;

-- Select all users (for checking inserted data).
SELECT * FROM users;

-- ==================================================================
-- 4. SAMPLE DATA INSERTIONS
-- ==================================================================
-- Inserting sample products into the "products" table.
INSERT INTO products (name, description) VALUES 
  ('Wireless Headphones', 'High-quality wireless headphones with noise-canceling features.'),
  ('Smartphone', 'Latest model with advanced camera features and high processing speed.'),
  ('Gaming Laptop', 'High-performance gaming laptop with powerful GPU and RAM.'),
  ('Smart Watch', 'A smartwatch with health tracking and notification capabilities.'),
  ('Bluetooth Speaker', 'Portable speaker with high-quality sound and long battery life.'),
  ('Electric Toothbrush', 'Rechargeable electric toothbrush with multiple cleaning modes.'),
  ('Air Purifier', 'Advanced air purifier with HEPA filter and quiet operation.'),
  ('Running Shoes', 'Lightweight running shoes with cushioned soles for comfort.'),
  ('Coffee Maker', 'Programmable coffee maker with fast brew feature.'),
  ('Office Chair', 'Ergonomic office chair with adjustable height and lumbar support.');


-- Updating product prices individually for specific product names.
UPDATE products SET price = 99.99 WHERE name = 'Wireless Headphones';
UPDATE products SET price = 699.99 WHERE name = 'Smartphone';
UPDATE products SET price = 1299.99 WHERE name = 'Gaming Laptop';
UPDATE products SET price = 199.99 WHERE name = 'Smart Watch';
UPDATE products SET price = 49.99 WHERE name = 'Bluetooth Speaker';
UPDATE products SET price = 79.99 WHERE name = 'Electric Toothbrush';
UPDATE products SET price = 299.99 WHERE name = 'Air Purifier';
UPDATE products SET price = 89.99 WHERE name = 'Running Shoes';
UPDATE products SET price = 59.99 WHERE name = 'Coffee Maker';
UPDATE products SET price = 149.99 WHERE name = 'Office Chair';

-- Inserting sample reviews into the "reviews" table.
-- Each review links a user with a product and provides a rating and comment.
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES 
  (1, 1, 5, 'Amazing sound quality and very comfortable to wear.'),
  (1, 2, 4, 'The camera is fantastic, but battery life could be better.'),
  (1, 3, 5, 'Handles all my games at ultra settings without any issues.'),
  (1, 4, 4, 'Great features, but battery life is average.'),
  (1, 5, 5, 'Very powerful sound and easy to carry.'),
  (1, 6, 3, 'Cleans well, but feels a bit rough on the gums.'),
  (1, 7, 4, 'Does a great job, but replacement filters are pricey.'),
  (1, 8, 5, 'Super comfortable and provides great support while running.'),
  (1, 9, 4, 'Makes coffee fast, but can be a bit noisy.'),
  (1, 10, 5, 'Extremely comfortable for long hours of work.');

-- ==================================================================
-- SAMPLE SELECT QUERIES TO VERIFY DATA
-- ==================================================================
-- Select all users with their updated role column.
SELECT * FROM users;

-- Select all products to verify their details including updated prices.
SELECT * FROM products;

-- Select all reviews to confirm the sample review data.
SELECT * FROM reviews;
