
import { createContext, useContext, useState } from "react";
import { api, TOKEN_KEY, USER_KEY } from "../api/client";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  });

  async function login(username, password) {

    const data = await api("/api/login/", {
      method: "POST",
      body: { username, password },
      auth: false
    });

    const token = data.access;

    if (!token) {
      throw new Error("Token not found");
    }

    const next = {
      username: data.user.username,
      role: data.user.user_type
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(next));

    setUser(next);

    return next;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
