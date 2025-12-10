import React from "react";
import { Link } from "react-router-dom";
import Alert from "../Alert";
import { useState } from "react";

function AdminLayout({ children }) {
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const triggerAlert = (type, message) => {
    setAlert({ show: true, type, message });

    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 3000);
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#222", color: "#fff", padding: "20px" }}>
        <h3>Admin Panel</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/admin/orders" style={{ color: "#fff", textDecoration: "none" }}>📦 Orders</Link></li>
          <li><Link to="/admin/products" style={{ color: "#fff", textDecoration: "none" }}>👕 Products</Link></li>
          <li><Link to="/admin/dashboard" style={{ color: "#fff", textDecoration: "none" }}>📊 Dashboard</Link></li>
          <li><Link to="/admin/about" style={{ color: "#fff", textDecoration: "none" }}>ℹ️ About Section</Link></li>
          <li><Link to="/" style={{ color: "#fff", textDecoration: "none" }}>↩ Back to Store</Link></li>
        </ul>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
        {/* GLOBAL ALERT */}
        {alert.show && (
          <Alert type={alert.type} message={alert.message} duration={3000} />
        )}

        {/* Pass triggerAlert to all children */}
        {React.cloneElement(children, { triggerAlert })}
      </div>
    </div>
  );
}

export default AdminLayout;
