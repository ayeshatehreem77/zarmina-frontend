import React, { useState } from "react";

function FeedbackForm({ productId, onReviewAdded }) {
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:4000/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ send token
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment,
                }),
            });


            const data = await res.json();
            if (res.ok) {
                setMessage("Thank you for your feedback!");
                setName("");
                setComment("");
                setRating(5);
                onReviewAdded(); // refresh Reviews carousel
            } else {
                setMessage(data.error || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error submitting feedback.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-3 border-top">
            <h5 className="fw-bold mb-3">Leave a Review</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <textarea
                        className="form-control"
                        placeholder="Write your feedback..."
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label me-2">Rating:</label>
                    <select
                        className="form-select w-auto d-inline-block"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                                {r} ★
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#c46c48" }}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Feedback"}
                </button>

                {message && <p className="mt-2 text-muted">{message}</p>}
            </form>
        </div>
    );
}

export default FeedbackForm;
