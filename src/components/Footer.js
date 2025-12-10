import React, { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import Alert from "./Alert";
import emailjs from "@emailjs/browser";

const Footer = () => {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setAlert({ type: "danger", message: "Please enter your email." });
      return;
    }

    setSending(true);

    emailjs
      .send(
        "service_n8uzhqi", // ✅ your service ID
        "template_y1jj8je", // ✅ your template ID
        { email }, // matches {{email}} variable in your EmailJS template
        "caMZiQQwaW5NSwTlQ" // ✅ your public key
      )
      .then(
        () => {
          setAlert({ type: "success", message: "Thank you! You've subscribed." });
          setEmail("");
        },
        (error) => {
          console.error(error);
          setAlert({ type: "danger", message: "Subscription failed. Try again." });
        }
      )
      .finally(() => setSending(false));
  };

  return (
    <footer className="text-center py-3 border-top">
      <div className="container">
        {/* Quick Links */}
        <h5 className="fw-bold mb-3 footer-text">Quick links</h5>
        <ul className="list-inline mb-4">
          <li className="list-inline-item mx-3">
            <a href="#" className="footer-text text-decoration-none fw-medium">
              Privacy Policy
            </a>
          </li>
          <li className="list-inline-item mx-3">
            <a href="#" className="footer-text text-decoration-none fw-medium">
              Refund Policy
            </a>
          </li>
          <li className="list-inline-item mx-3">
            <a href="#" className="footer-text text-decoration-none fw-medium">
              Terms of Service
            </a>
          </li>
        </ul>

        {/* Subscribe Section */}
        <div className="d-flex flex-column align-items-center mb-4">
          <h5 className="fw-bold mb-3 footer-text">Subscribe to our emails</h5>
          <form
            onSubmit={handleSubscribe}
            className="d-flex border border-dark p-2"
            style={{ width: "300px" }}
          >
            <input
              type="email"
              className="form-control border-0 shadow-none bg-transparent footer-text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={sending}
            />
            <button
              type="submit"
              className="btn border-0 footer-text"
              disabled={sending}
            >
              <span style={{ fontSize: "18px" }}>{sending ? "..." : "→"}</span>
            </button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <a href="#" className=" fs-4 footer-text">
            <FaInstagram />
          </a>
          <a href="#" className=" fs-4 footer-text">
            <FaTiktok />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-muted small mb-0 footer-text">
          © {new Date().getFullYear()}, <span className="text-uppercase">Zarmina</span>
        </p>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        duration={3000}
        onClose={() => setAlert({ type: "", message: "" })}
      />
    </footer>
  );
};

export default Footer;
