// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Fetch user details from backend using token
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:4000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data); // { userId, email, role }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // ✅ Auto-fetch user on first render (if token exists)
  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Handle login
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });

      // backend returns { authToken: "..." }
      const token = res.data.authToken;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("token", token);
      await fetchUser(); // instantly update user

      return true; // success
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err.response?.data?.message || "Login failed";
    }
  };

  // ✅ Handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
