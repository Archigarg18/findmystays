import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch (e) { return null; }
  });

  // login(email, password) -> calls backend, stores token+user
  const login = async (email, password) => {
    const { apiFetch } = await import("@/lib/api");
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // read raw text first — backend or network might return empty/non-JSON body
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        // invalid JSON
        throw new Error(`Invalid server response: ${text}`);
      }
    }

    if (!res.ok) {
      const msg = data?.error || data?.message || `Request failed with status ${res.status}`;
      throw new Error(msg);
    }

    // data expected: { token, user }
    if (!data || !data.user) {
      throw new Error('Login succeeded but server returned no user data');
    }

    const currentUser = data.user;
    setUser(currentUser);
    if (data.token) setToken(data.token);
    try {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      if (data.token) localStorage.setItem("token", data.token);
    } catch (e) {
      // ignore storage failures
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem('token');
    } catch (e) {}
  };

  const updateUser = (u) => {
    setUser(u);
    try { localStorage.setItem('currentUser', JSON.stringify(u)); } catch (e) {}
  };

  const value = { user, token, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
