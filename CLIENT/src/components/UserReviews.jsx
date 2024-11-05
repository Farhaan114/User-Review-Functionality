import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserReviews.css';
import { useNavigate } from 'react-router-dom';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState('');

  const nav = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:5000/api/reviews/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        setReviews(response.data.reviews); // Directly use the response
      })
      .catch(error => console.error('Error fetching user reviews:', error));
  }, []);

  const handleDelete = (reviewId) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success("Review deleted successfully!");
    })
    .catch(error => {
      console.error('Error deleting review:', error);
      toast.error("Failed to delete review.");
    });
  };

  const handleEdit = (reviewId, comment, rating) => {
    setEditingReviewId(reviewId);
    setEditComment(comment);
    setEditRating(rating);
  };

  const handleSubmitEdit = (reviewId) => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:5000/api/reviews/${reviewId}`, {
      comment: editComment,
      rating: editRating
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, comment: editComment, rating: editRating } : review
      ));
      setEditingReviewId(null);
      setEditComment('');
      setEditRating('');
      toast.success("Review updated successfully!");
    })
    .catch(error => {
      console.error('Error updating review:', error);
      toast.error("Failed to update review.");
    });
  };

  return (
    <div className="glass-box">
      <h2>My Reviews</h2>

      <button onClick={()=>{nav("/Products")}}>View More Products</button>
      <table className="reviews-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Comment</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <tr key={review.id} className="review-row">
                <td>{review.product_name}</td> {/* Accessing the product name directly */}
                {editingReviewId === review.id ? (
                  <>
                    <td>
                      <input 
                        type="text" 
                        value={editComment} 
                        onChange={(e) => setEditComment(e.target.value)} 
                        placeholder={review.comment} 
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={editRating} 
                        onChange={(e) => setEditRating(e.target.value)} 
                        placeholder={review.rating} 
                        min="1" 
                        max="5" 
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSubmitEdit(review.id)}>Submit</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{review.comment}</td>
                    <td>{review.rating}</td>
                    <td>
                      <button onClick={() => handleEdit(review.id, review.comment, review.rating)}>Edit</button>
                      <button onClick={() => handleDelete(review.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-reviews">No reviews available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default UserReviews;
