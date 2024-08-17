// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import TakeQuiz from './components/TakeQuiz';
import ResultPage from './components/ResultPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />
          <Route path="/result" element={<ResultPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
