import React, { useEffect, useState } from "react";

function Alert({ type = "success", message = "", duration = 3000, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={`alert alert-${type} fade show`}
      role="alert"
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1055,
        minWidth: "300px",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

export default Alert;
