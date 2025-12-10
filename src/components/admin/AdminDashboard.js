import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cancelled, setCancelled] = useState(0);

  const [recentOrders, setRecentOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const productsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];

      setProductsCount(products.length);
      setOrdersCount(orders.length);

      // Revenue = sum of completed orders
      const completedOrders = orders.filter((o) => o.status === "completed");
      const pendingOrders = orders.filter((o) => o.status === "pending");
      const cancelledOrders = orders.filter((o) => o.status === "cancelled");

      setCompleted(completedOrders.length);
      setPending(pendingOrders.length);
      setCancelled(cancelledOrders.length);

      const totalRev = completedOrders.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      );
      setRevenue(totalRev);

      // Recent 5 orders (sorted by date)
      const sorted = [...orders].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRecentOrders(sorted.slice(0, 5));
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  return (
    <>
      <h2 className="mb-4">📊 Admin Dashboard</h2>

      {/* TOP CARDS */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h4>Total Products</h4>
            <h2>{productsCount}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h4>Total Orders</h4>
            <h2>{ordersCount}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h4>Total Revenue</h4>
            <h2>${revenue}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h4>Completed Orders</h4>
            <h2>{completed}</h2>
          </div>
        </div>
      </div>

      {/* STATUS CARDS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm">
            <h5>Pending</h5>
            <h2>{pending}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm">
            <h5>Completed</h5>
            <h2>{completed}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm">
            <h5>Cancelled</h5>
            <h2>{cancelled}</h2>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="card p-4 shadow-sm">
        <h4>🕘 Recent Orders</h4>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.userId?.name || "Unknown"}</td>
                <td>${o.totalPrice}</td>
                <td>{o.status}</td>
                <td>
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminDashboard;
