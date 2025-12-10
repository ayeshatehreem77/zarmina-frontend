import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51QUPsXCLV3yZuvjxpdgpcVQsNWUhfGmKu2VjcfLh34a9dDtTSTCe6oVIrSbBHY2b5AxCdeWE6HIhURfodfj1q7Ub006v66XPvM"
);

const CheckoutForm = ({ cartItems, token, setCartItems }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const stripe = useStripe();
  const elements = useElements();

  // Handle input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Clear cart (frontend + localStorage + backend)
  const clearBackendCart = async () => {
    try {
      await axios.delete("http://localhost:4000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to clear backend cart:", err.response?.data || err.message);
    }
  };

  const clearCart = async () => {
  if (typeof setCartItems === "function") {
    setCartItems([]); // ✅ parent state updates immediately
  }

  try {
    await axios.delete("http://localhost:4000/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Failed to clear backend cart:", err.response?.data || err.message);
  }
};



  // Place order (COD or prepare Stripe)
  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city) {
      return setError("All fields are required");
    }
    if (!cartItems.length) return setError("Cart is empty");

    setLoading(true);
    setError("");

    const orderData = {
      products: cartItems.map((item) => ({
        productId: item.product?._id || item._id,
        quantity: item.quantity,
      })),
      shippingInfo: form,
      totalPrice: cartItems.reduce(
        (sum, i) => sum + (i.product?.price || i.price || 0) * i.quantity,
        0
      ),
      paymentMethod,
    };

    try {
      const res = await axios.post("http://localhost:4000/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderId(res.data._id);

      if (paymentMethod === "cod") {
        // ✅ COD: confirm order and clear cart
        setPaymentSuccess(true);
        await clearCart();
      } else {
        // Stripe: show payment form
        setTotalPrice(orderData.totalPrice);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // Handle Stripe payment
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("http://localhost:4000/payment/create-intent", {
        amount: totalPrice,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);
        await clearCart(); // ✅ Clear cart frontend + backend after payment

        try {
          await axios.post("http://localhost:4000/payment/confirm", { orderId });
        } catch (err) {
          console.error("Backend confirm failed:", err.response?.data || err.message);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h4>Checkout Details</h4>

      {!orderId && (
        <div>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <input name="country" placeholder="Country" value={form.country} disabled />

          <div className="mt-2">
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{" "}
              Card Payment
            </label>
            <label className="ms-3">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{" "}
              Cash on Delivery
            </label>
          </div>

          <button onClick={handlePlaceOrder} disabled={loading} className="mt-2">
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}

      {orderId && !paymentSuccess && paymentMethod === "card" && (
        <form onSubmit={handlePayment} className="mt-3">
          <CardElement />
          <button type="submit" disabled={loading} className="mt-2">
            {loading ? "Processing..." : `Pay Rs. ${totalPrice}`}
          </button>
        </form>
      )}

      {paymentSuccess && <p className="text-success mt-3">Order Confirmed Successfully 🎉</p>}
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

// Wrap CheckoutForm in Elements
const Checkout = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default Checkout;
