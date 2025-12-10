import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Hero from './components/Hero';
import Aboutus from './components/Aboutus';
import Products from './components/Products';
import ProductsDetails from './components/ProductsDetails';
import ContactForm from './components/ContactForm';
import ContactModal from './components/ContactModal';
import AddToCart from './components/AddToCart';
import Login from './components/Login';
import MyOrders from './components/MyOrders';
import Alert from './components/Alert';
import Footer from './components/Footer';
import AdminOrders from './components/admin/AdminOrders';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './components/admin/AdminProducts';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminAbout from './components/admin/AdminAbout';
import axios from 'axios';

function App() {
  const [cart, setCart] = useState({ items: [] });
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  // Add item
  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/cart",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🛒 Cart API response:", res.data);

      // ✅ Always ensure it's an array
      if (Array.isArray(res.data.items)) {
        setCart(res.data.items);
      } else if (Array.isArray(res.data)) {
        setCart(res.data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:4000/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("✅ Full Cart API Response:", data);

      if (data && Array.isArray(data.items)) {
        // Backend returned updated cart
        setCart({ items: data.items });
      } else {
        // Backend didn't return items, fallback locally
        setCart((prev) => ({
          ...prev,
          items: prev.items.filter(
            (item) =>
              (item.product?._id || item.productId).toString() !==
              productId.toString()
          ),
        }));
      }
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };


  return (
    <BrowserRouter>
      <Routes>
        {/* Store / Public Pages */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Aboutus />
              <Products setSelectedProduct={setSelectedProduct} />
              <ProductsDetails product={selectedProduct} addToCart={addToCart} />
              <ContactForm />
              <ContactModal />
              <AddToCart cart={cart} setCart={setCart} setOrders={setOrders} addToCart={addToCart} removeFromCart={removeFromCart} />
              <Login
                user={user}
                setUser={setUser}
                setShowModal={setShowModal}
                showModal={showModal}
              />
              <MyOrders orders={orders} setOrders={setOrders} />
              <Alert
                type="success"
                message={message}
                duration={3000}
                onClose={() => setMessage("")}
              />
              <Footer />
            </>
          }
        />

        {/* Admin Orders */}
        <Route
          path="/admin/orders"
          element={
            localStorage.getItem("role") === "admin" ? (
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/products"
          element={
            localStorage.getItem("role") === "admin" ? (
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/about"
          element={
          
              <AdminLayout>
                <AdminAbout />
              </AdminLayout>
            
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            localStorage.getItem("role") === "admin" ? (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />



        {/* Add more admin routes here */}
      </Routes>
    </BrowserRouter>

  );
}

export default App;
