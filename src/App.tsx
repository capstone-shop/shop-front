// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UserRoutes from './Route/UserRoutes';
import AdminRoutes from './Route/AdminRoutes';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  return (
    <>
      <Routes>
        {/* 사용자 라우트 */}
        <Route path="/*" element={<UserRoutes />} />
        {/* 어드민 라우트 */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
