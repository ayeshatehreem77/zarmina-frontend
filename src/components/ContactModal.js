import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Alert from "./Alert";

function ContactModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Replace these with your EmailJS service/template/user IDs
    const serviceID = "service_n8uzhqi";
    const templateID = "template_y1jj8je";
    const publicKey = "caMZiQQwaW5NSwTlQ";

    emailjs.send(
      serviceID,
      templateID,
      {
        name: formData.name,      // matches {{name}} in template
        title: formData.message,  // matches {{title}} in template
        email: formData.email      // matches {{email}} in template → recipient
      },
      publicKey
    )
      .then(
        (result) => {
          setAlert({ type: "success", message: "Thank you email sent successfully!" });
          setFormData({ name: "", email: "", message: "" });
          setSending(false);
        },
        (error) => {
          console.error(error.text);
          setAlert({ type: "danger", message: "Failed to send email. Please try again." });
          setSending(false);
        }
      );


  };

  return (
    <div
      className="modal fade"
      id="contactModal"
      tabIndex="-1"
      aria-labelledby="contactModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered my-0">
        <div
          className="modal-content"
          style={{ borderRadius: "12px", background: "#D4B191" }}
        >

          <div className="modal-header">
            <h5 className="modal-title" id="contactModalLabel">
              Contact Us
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
          <Alert
            type={alert.type}
            message={alert.message}
            duration={3000}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
