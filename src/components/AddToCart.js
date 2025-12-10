import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Alert from "./Alert";
import Checkout from "./Checkout";

function AddToCart({ cart, setCart, removeFromCart, setOrders }) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [alert, setAlert] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);
  const [recentlyPlacedOrder, setRecentlyPlacedOrder] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const [cartItems, setCartItems] = useState(
    () => {
      try {
        return JSON.parse(localStorage.getItem("cartItems")) || [];
      } catch {
        return []; // fallback if parsing fails
      }
    }
  );




  const modalRef = useRef(null);
  const bsModalRef = useRef(null);


  const fetchCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only update cart if no recent order was placed
      if (!recentlyPlacedOrder) {
        const normalizedCart = Array.isArray(res.data) ? { items: res.data } : res.data;
        setCart(normalizedCart);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ items: [] }); // ✅ Update parent state immediately
      localStorage.removeItem("cartItems"); // optional if syncing localStorage
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const clear = () => setCart({ items: [] });
    window.addEventListener("cart-cleared", clear);
    return () => window.removeEventListener("cart-cleared", clear);
  }, []);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const handleCartUpdated = () => fetchCart();
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, []);

  useEffect(() => {
    if (!modalRef.current) return;
    bsModalRef.current = new bootstrap.Modal(modalRef.current, {});
    const modalEl = modalRef.current;

    const handleShow = () => fetchCart();
    modalEl.addEventListener("show.bs.modal", handleShow);
    const handleHide = () => setRecentOrder(null); // clear temporary order on close
    modalEl.addEventListener("hidden.bs.modal", handleHide);

    return () => {
      modalEl.removeEventListener("show.bs.modal", handleShow);
      modalEl.removeEventListener("hidden.bs.modal", handleHide);
    };


    return () => modalEl.removeEventListener("show.bs.modal", handleShow);
  }, [token, recentlyPlacedOrder]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart.items));
  }, [cart.items]);


  return (
    <>
      <div
        className="modal fade"
        id="cartModal"
        tabIndex="-1"
        aria-labelledby="cartModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content shadow-lg border-0">

            {/* HEADER */}
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title fw-semibold">🛒 Your Cart</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            {/* ALERT */}
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                duration={3000}
                onClose={() => setAlert(null)}
              />
            )}

            {/* BODY */}
            <div className="modal-body px-4">

              {/* Loading */}
              {loading && <p className="text-center text-muted">Loading...</p>}

              {/* Empty cart */}
              {!loading && cart.items?.length === 0 && (
                <div className="text-center py-4">
                  <p className="fs-5 text-muted mb-1">Your cart is empty.</p>
                  <small className="text-secondary">Add some items to continue.</small>
                </div>
              )}

              {/* CART ITEMS */}
              <ul className="list-group list-group-flush">
                {cart.items?.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item py-3 d-flex justify-content-between align-items-center"
                    style={{ borderBottom: "1px solid #f2f2f2" }}
                  >
                    <div>
                      <h6 className="fw-semibold mb-1">{item.product?.name}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>

                    <button
                      className="btn btn-sm btn-outline-danger px-3"
                      onClick={() => {
                        removeFromCart(item.product._id);
                        setAlert({
                          type: "danger",
                          message: `${item.product.name} removed from cart!`,
                        });
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* FOOTER */}
            {cart.items?.length > 0 && (
              <div className="modal-footer bg-light d-flex justify-content-between align-items-center py-3">

                <button className="btn btn-outline-danger" onClick={clearCart}>
                  Clear Cart
                </button>

                <button
                  className="btn btn-primary w-100"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout →
                </button>

              </div>
            )}

            {/* CHECKOUT COMPONENT */}
            {showCheckout && (
              <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
                <Checkout
                  cartItems={cart.items || []}
                  setCartItems={(items) => {
                    setCart({ items });
                    localStorage.setItem("cartItems", JSON.stringify(items));
                  }}
                  token={token}
                  onOrderPlaced={(orderData) => {
                    setCart({ items: [] }); // ✅ immediately clear parent cart
                    setRecentlyPlacedOrder(true);
                    setRecentOrder(orderData);
                    setOrders((prev) => [orderData, ...prev]);
                    setShowCheckout(false); // close checkout
                    setTimeout(() => setRecentlyPlacedOrder(false), 1000);
                  }}
                />

              </div>
            )}


            {/* RECENT ORDER */}
            {recentOrder && (
              <div className="p-3 border-top bg-light">
                <h5 className="fw-bold mb-2 text-success">Order Placed Successfully!</h5>
                <div><strong>Order ID:</strong> {recentOrder._id}</div>
                <div><strong>Total:</strong> Rs. {recentOrder.totalPrice}</div>
                <div>
                  <strong>Items:</strong>{" "}
                  {recentOrder.products
                    .map((p) => `${p.productId?.name || "Product"} × ${p.quantity}`)
                    .join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}

export default AddToCart;
