import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast
import './ProductDetails.css'; // Import the CSS for styling

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(1);
  const [error, setError] = useState(null);

  const nav = useNavigate();

  // Retrieve user role from localStorage
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    // Fetch product details
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(response => {
        setProduct(response.data.product);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setError('Product not found or an error occurred while loading product details.');
      });

    // Fetch product reviews
    axios.get(`http://localhost:5000/api/reviews/product/${productId}`)
      .then(response => setReviews(response.data.reviews))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [productId]);

  const handleDeleteReview = (reviewId) => {
    console.log('Attempting to delete review with ID:', reviewId);
    axios.delete(`http://localhost:5000/api/reviews`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: { reviewId } // Add the reviewId to the request body
    })
    .then(() => {
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId)); // Remove the review from the list
      toast.success("Review deleted successfully!");
    })
    .catch(error => {
      console.error('Error deleting review:', error.response ? error.response.data : error);
      toast.error("Failed to delete review.");
    });
  };
  
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {
      productId,
      rating: Number(rating),
      comment,
    };

    axios.post('http://localhost:5000/api/reviews', reviewData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      const newReview = response.data.review;

      if (newReview) {
        setReviews(prevReviews => [...prevReviews, newReview]);
        setComment('');
        setRating(1);
        setHoverRating(1);
      }
      toast.success("Review posted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch(error => {
      console.error('Error posting review:', error);
      toast.error("Couldn't post review. Review already exists!");
    });
  };

  return (
    <div className="product-container">
      <ToastContainer />
      {error ? (
        <p>{error}</p>
      ) : product ? (
        <div className="product-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>

          <h3>Reviews</h3>
          <div className="review-list">
            {reviews.length > 0 ? (
              <ul>
                {reviews.map(review => (
                  <li key={review.id}>
                    <strong>{review.username}</strong> <em>{new Date(review.created_at).toLocaleString()}</em>
                    <p>{review.comment} - Rating: {review.rating}</p>
                    
                    {/* Conditionally render the delete button if user is an admin */}
                    {userRole === 'admin' && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </div>

          <h3>Post a Review</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="reviewComment">Your Review:</label>
            <textarea
              id="reviewComment"
              name="reviewComment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your review (max 1000 characters)"
              required
              maxLength={1000}
            />
            <br />
            <label htmlFor="rating">Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(r => (
                <span
                  key={r}
                  className={`star ${hoverRating >= r ? 'hovered' : (rating >= r ? 'selected' : '')}`}
                  onClick={() => setRating(r)}
                  onMouseEnter={() => setHoverRating(r)}
                  onMouseLeave={() => setHoverRating(rating)}
                >
                  ★
                </span>
              ))}
            </div>
            <br />
            <button type="submit">Submit Review</button>
            <button type="button" onClick={() => nav("/Products")}>Back to Products</button>
          </form>
          
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetails;
