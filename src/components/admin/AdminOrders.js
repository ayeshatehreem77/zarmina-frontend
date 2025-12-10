// src/components/admin/AdminOrders.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

function AdminOrders({ triggerAlert }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null); // track which order is updating

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // ✅ Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdateLoading(orderId);

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh orders
      fetchOrders();
      triggerAlert("success", "Order status updated!");
    } catch (err) {
      console.error("Error updating status:", err);
      triggerAlert("danger", "Failed to update status");
    } finally {
      setUpdateLoading(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4">📦 All Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((o) => (
            <div
              key={o._id}
              className="p-3 rounded shadow-sm bg-white border"
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {/* ORDER HEADER */}
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0">Order #{o._id.slice(0, 8)}...</h5>
                <span className="badge bg-dark">
                  {new Date(o.createdAt).toLocaleString()}
                </span>
              </div>

              <hr />

              {/* USER INFO */}
              <div>
                <strong>Customer:</strong> {o.shippingInfo?.name ?? "Unknown"} <br />
                <strong>Email:</strong> {o.shippingInfo?.email} <br />
                <strong>Phone:</strong> {o.shippingInfo?.phone}
              </div>

              {/* ADDRESS */}
              <div>
                <strong>Address:</strong> <br />
                {o.shippingInfo?.address} <br />
                {o.shippingInfo?.city}, {o.shippingInfo?.country}
              </div>

              {/* PRICE */}
              <div>
                <strong>Total Price:</strong>{" "}
                <span className="fw-bold text-success">${o.totalPrice}</span>
              </div>

              {/* PAYMENT STATUS */}
              <div>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={
                    o.paymentStatus === "paid"
                      ? "badge bg-success"
                      : o.paymentStatus === "unpaid"
                        ? "badge bg-warning text-dark"
                        : "badge bg-secondary"
                  }
                >
                  {o.paymentStatus || "unknown"}
                </span>
              </div>


              {/* STATUS CONTROL */}
              <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                <select
                  className="form-select w-auto"
                  value={o.status}
                  disabled={updateLoading === o._id}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* {updateLoading === o._id ? (
                  <button className="btn btn-secondary" disabled>
                    Updating...
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => updateStatus(o._id, o.status)}
                  >
                    Update
                  </button>
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}

export default AdminOrders;
