import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import TaskDetail from './pages/TaskDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/projects/:projectId"
            element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>}
          />
          <Route
            path="/tasks/:taskId"
            element={<ProtectedRoute><TaskDetail /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
