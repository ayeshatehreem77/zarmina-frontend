import React, { useEffect, useState } from "react";

function Reviews({ productId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/reviews/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId, refreshTrigger]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (reviews.length > 1) {
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [reviews]);

  if (!reviews.length)
    return <p className="text-muted mt-3 text-center">No reviews yet.</p>;

  return (
    <div className="text-center mt-4">
      <h5 className="fw-bold mb-3">Customer Reviews</h5>
      <div className="position-relative" style={{ minHeight: "100px" }}>
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className={`carousel-item ${idx === activeIndex ? "active" : ""}`}
            style={{
              display: idx === activeIndex ? "block" : "none",
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            <blockquote className="blockquote">
              <p className="mb-2">“{rev.comment}”</p>
              <footer className="blockquote-footer rev-name">
                {rev.name || rev.userId?.name || "Anonymous"} — {rev.rating} ⭐
              </footer>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
