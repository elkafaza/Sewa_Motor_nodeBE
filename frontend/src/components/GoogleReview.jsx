import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GoogleReview.css'; // Pastikan file ini ada untuk styling

function GoogleReview() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    axios.get('/api/reviews')
      .then(res => {
        setReviews(res.data.reviews || []);
        setRating(res.data.rating || null);
      })
      .catch(err => console.error('Gagal ambil review:', err));
  }, []);

  return (
    <div className="review-container">
      <h2 className="title">Ulasan Google</h2>
      {rating && <p className="rating">⭐ {rating}</p>}
      <div className="review-list">
        {reviews.map((rev, i) => (
          <div key={i} className="review-bubble">
            <div className="review-header">
              <img
                src={rev.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.author_name)}&background=random`}
                alt={rev.author_name}
                className="avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.author_name)}&background=random`;
                }}
              />
              <div>
                <p className="author">{rev.author_name}</p>
                <p className="stars">⭐ {rev.rating}</p>
              </div>
            </div>
            <p className="review-text">"{rev.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoogleReview;
