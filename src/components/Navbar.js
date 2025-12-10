import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    document.body.classList.toggle("nav-open");
  };


  return (
    <nav className="navbar navbar-expand-lg py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mobileMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <a className="navbar-brand fw-bold veloura-logo" href="/">
          Zarmina
        </a>

        <div className="collapse navbar-collapse" id="mobileMenu">
  <ul className="navbar-nav mx-auto flex-column flex-lg-row gap-4 text-center">

          <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="#products">Products</a></li>
          <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
          <li className="nav-item">
            <a className="nav-link" href="#myOrders" data-bs-toggle="modal" data-bs-target="#myOrders">My Orders</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/" data-bs-toggle="modal" data-bs-target="#contactModal">Contact</a>
          </li>
        </ul>
        </div>

        <div className="d-none d-lg-flex align-items-center gap-3">
          <a
            className="nav-link p-0"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#authModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="38px" viewBox="0 -960 960 960" width="38px" fill="#64462F"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" /></svg>
          </a>

          <a
            href="#"
            className="nav-link"
            data-bs-toggle="modal"
            data-bs-target="#cartModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#64462F"><path d="M284.53-80.67q-30.86 0-52.7-21.97Q210-124.62 210-155.47q0-30.86 21.98-52.7Q253.95-230 284.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83Zm400 0q-30.86 0-52.7-21.97Q610-124.62 610-155.47q0-30.86 21.98-52.7Q653.95-230 684.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83ZM238.67-734 344-515.33h285.33l120-218.67H238.67ZM206-800.67h589.38q22.98 0 34.97 20.84 11.98 20.83.32 41.83L693.33-490.67q-11 19.34-28.87 30.67-17.87 11.33-39.13 11.33H324l-52 96h487.33V-286H278q-43 0-63-31.83-20-31.84-.33-68.17l60.66-111.33-149.33-316H47.33V-880h121.34L206-800.67Zm138 285.34h285.33H344Z" /></svg>
          </a>
          {(user?.role === "admin" || localStorage.getItem("role") === "admin") && (
            <button
              className="btn btn-warning"
              onClick={() => navigate("/admin/orders")}
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
