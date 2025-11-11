import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NoteDashboard from "./pages/NoteDashboard";
import Profile from "./pages/Profile";
import ArchivePage from "./pages/ArchivePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AnimatedBackground from "./components/AnimatedBackground"; // 🌟 Import background
import TrashPage from "./pages/TrashPage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* ✨ Global animated sparkle background */}
                <AnimatedBackground interval={120} color="#6366F1" />

                {/* 🧱 All content layered above the animation */}
                <div className="relative z-10">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot" element={<ForgotPassword />} />
                        <Route path="/reset/:token" element={<ResetPassword />} />

                        {/* Protected routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <NoteDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/archive"
                            element={
                                <ProtectedRoute>
                                    <ArchivePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/trash"
                            element={
                                <ProtectedRoute>
                                    <TrashPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}
