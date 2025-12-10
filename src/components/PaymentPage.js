import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);


const PaymentForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // default Stripe


  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1️⃣ Create Payment Intent
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/create-intent`, { amount });

      // 2️⃣ Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        // 3️⃣ Mark order as paid
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/confirm`, { orderId });
        setSuccess(true);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return <p className="text-success">Payment Successful 🎉</p>;

  return (
    <form onSubmit={handlePayment} className="space-y-3">
      <div className="p-3 border rounded">
        <CardElement />
      </div>
      <button className="btn btn-dark w-full" disabled={loading || !stripe}>
        {loading ? "Processing..." : `Pay Rs. ${amount}`}
      </button>
    </form>
  );
};

export default function PaymentPage({ orderId, amount }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm orderId={orderId} amount={amount} />
    </Elements>
  );
}
