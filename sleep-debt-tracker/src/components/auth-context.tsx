import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | null;
    login: (userId: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string,
    ) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            console.log("Checking authentication status...");
            try {
                const { data } = await axios.get(`${API_URL}/me`, {
                    withCredentials: true,
                });
                console.log("Authentication status:", data);
                setIsAuthenticated(true);
                setUserId(data.userId);
            } catch (error) {
                console.error("Error checking authentication status:", error);
                setIsAuthenticated(false);
                setUserId("demo");
            }
        };

        checkAuth();
    }, []);

    const login = async (userId: string, password: string) => {
        const { data } = await axios.post(
            `${API_URL}/login`,
            { userId, password },
            { withCredentials: true }
        );

        setIsAuthenticated(true);
        setUserId(data.userId);
    };

    const register = async (
        // userId: string,
        name: string,
        email: string,
        password: string,
        // sleepGoal = 480
    ) => {
        const userId = email.split("@")[0]; // Normalize userId to lowercase
        const { data } = await axios.post(`${API_URL}/register`, {
            userId,
            name,
            email,
            password,
            // sleepGoal,
        });

        setIsAuthenticated(true);
        setUserId(data.userId); // Ensure we store the correct userId
    };

    const logout = async () => {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        setIsAuthenticated(false);
        setUserId("demo");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, userId, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
