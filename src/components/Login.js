import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Alert from "./Alert";
import axios from "axios";

function AuthModal({ setShowModal, user, setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState({ type: "", message: "" });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [error, setError] = useState("");

  const nodeRef = useRef(null);

  const triggerAlert = (type, message) => {
    setAlertData({ type, message });
  };

  // ✅ LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });

      // ✅ store token and role
      localStorage.setItem("token", res.data.authToken);
      localStorage.setItem("role", res.data.role);

      // ✅ set user instantly
      setUser({
        name: res.data.name,
        email: res.data.email,
      });

      // ✅ redirect based on role
      // Inside handleLogin
      if (res.data.role === "admin") {
        window.location.href = "/admin/orders"; // redirect admin to admin page
      } else {
        setShowModal(false);
      }

    } catch (err) {
      triggerAlert("danger" , err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };



  // ✅ SIGNUP FUNCTION
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/auth/signup", {
        name,
        email,
        password,
      });

      triggerAlert("success" , res.data.message || "User created successfully!");
      setIsLogin(true);
    } catch (err) {
      console.log("Signup error:", err.response?.data || err.message);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError(err.response?.data?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:4000/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser({
            name: res.data.name,
            email: res.data.email,
          });
        })
        .catch((err) => {
          console.log("Auto-login failed:", err.response?.data || err.message);
          localStorage.removeItem("token");
        });
    }
  }, []);


  return (
    <div className="modal fade" id="authModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content auth-modal-content">
          <div className="modal-body p-5">
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>

            <h2 className="text-center mb-4 auth-title">
              {user ? "Your Profile" : isLogin ? "Login" : "Sign Up"}
            </h2>

            {/* If logged in -> show profile */}
            {user ? (
              <div className="container">
                <div className="text-center">
                  <h4>👤 {user.name}</h4>
                  <p className="text-muted">{user.email}</p>
                  <button className="btn btn-danger mt-3" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <SwitchTransition>
                <CSSTransition
                  key={isLogin ? "login" : "signup"}
                  classNames="authfade"
                  timeout={300}
                  nodeRef={nodeRef}
                  unmountOnExit
                >
                  <div ref={nodeRef}>
                    {isLogin ? (
                      <form onSubmit={handleLogin}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Password</label>
                          <div className="position-relative">
                            <input
                              type={showLoginPassword ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <i
                              className={`fas ${showLoginPassword ? "fa-eye-slash" : "fa-eye"
                                }`}
                              onClick={() =>
                                setShowLoginPassword(!showLoginPassword)
                              }
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#888",
                              }}
                            ></i>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <button
                            type="submit"
                            className="btn auth-login-btn px-4 py-2"
                            disabled={loading}
                          >
                            {loading ? "Logging in..." : "Log In"}
                          </button>
                          <button
                            type="button"
                            className="btn auth-signup-btn px-4 py-2"
                            onClick={() => setIsLogin(false)}
                          >
                            Sign Up
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleSignup}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Password
                          </label>
                          <div className="position-relative">
                            <input
                              type={showSignupPassword ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Create a password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <i
                              className={`fas ${showSignupPassword ? "fa-eye-slash" : "fa-eye"
                                }`}
                              onClick={() =>
                                setShowSignupPassword(!showSignupPassword)
                              }
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#888",
                              }}
                            ></i>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <button
                            type="submit"
                            className="btn auth-signup-btn px-4 py-2"
                            disabled={loading}
                          >
                            {loading ? "Signing up..." : "Create Account"}
                          </button>
                          <button
                            type="button"
                            className="btn auth-login-btn px-4 py-2"
                            onClick={() => setIsLogin(true)}
                          >
                            Back to Login
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
