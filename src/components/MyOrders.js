import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrders({ orders, setOrders }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div
      className="modal fade"
      id="myOrders"
      tabIndex="-1"
      aria-labelledby="myOrdersLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="myOrdersLabel">
              My Orders
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Order #{index + 1}</strong>
                    <span
                      className={`badge ${order.status === "pending"
                          ? "bg-warning text-dark"
                          : order.status === "completed"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                    >
                      {order.status?.toUpperCase()}
                    </span>
                  </div>

                  <ul className="mt-2">
                    {order.products && order.products.length > 0 ? (
                      order.products.map((item, i) => (
                        <li key={i}>
                          {item.productId?.name} — {item.quantity}
                        </li>
                      ))
                    ) : (
                      <li>No items</li>
                    )}
                  </ul>

                  <p className="mt-2 mb-0">
                    <strong>Total Price:</strong> ${order.totalPrice}
                  </p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


export default MyOrders;
