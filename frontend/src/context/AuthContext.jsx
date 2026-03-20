import React, { createContext, useContext, useState } from "react";
import axios from "axios";


const AuthContext = createContext();

const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "/api" : "http://localhost:5000/api");

const parseJSON = (value, fallback) => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

const getStoredUser = () => parseJSON(localStorage.getItem(USER_STORAGE_KEY), null);
const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getStoredUser());
    const [token, setToken] = useState(() => getStoredToken());

    const login = async ({ email, password }) => {
        try {
            const url = `${API_BASE_URL}/auth/login`;
            console.log("[Auth] Calling login at:", url);
            const response = await axios.post(url, {
                email,
                password,
            });

            const { token: authToken, user: apiUser } = response.data;
            const safeUser = { id: apiUser._id, name: apiUser.name, email: apiUser.email };

            setToken(authToken);
            setUser(safeUser);
            localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));
        } catch (error) {
            console.error("[Auth] Login error:", error.response?.status, error.message, error.response?.data);
            throw error;
        }
    };

    const register = async ({ name, email, password }) => {
        try {
            const url = `${API_BASE_URL}/auth/register`;
            console.log("[Auth] Calling register at:", url);
            const response = await axios.post(url, {
                name,
                email,
                password,
            });

            const { token: authToken, user: apiUser } = response.data;
            const safeUser = { id: apiUser._id, name: apiUser.name, email: apiUser.email };

            setToken(authToken);
            setUser(safeUser);
            localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));
        } catch (error) {
            console.error("[Auth] Register error:", error.response?.status, error.message, error.response?.data);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    };

     return(
         <AuthContext.Provider value={{user,token,isAuthenticated: Boolean(user && token),login,register,logout}}>
        {children}
       </AuthContext.Provider>
    );

};


//hook
export const useAuth = () => useContext(AuthContext);