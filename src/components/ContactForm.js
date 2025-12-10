import React from 'react'

function ContactForm() {
  return (
    <div className='contact-us align-center text-center'>
        <div className='contact-section pt-5'>
      <h2>
        Get in Touch
      </h2>
      <p>
        Have questions or want to collaborate? Click below to contact us!
      </p>
        </div>
      <button
        type="button"
        className="btn btn-lg mb-5 mt-0 shop-btn contact-btn"
        data-bs-toggle="modal"
        data-bs-target="#contactModal"
      >
        Contact Us
      </button>
    </div>
  )
}

export default ContactForm