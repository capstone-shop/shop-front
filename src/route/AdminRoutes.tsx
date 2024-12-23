import AdminHeader from '../admin/components/AdminHeader';
import SideMenu from '../admin/components/SideMenu';
import Layout from '../admin/components/Layout';
import ProtectedRoute from '../admin/components/ProtectedRoute';
import Category from '../admin/components/Category';
import User from '../admin/components/User';
import Login from '../admin/components/Login';
import { Route, Routes } from 'react-router-dom';
import React from 'react';

function AdminRoutes() {
  // 권한 확인
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute isAdmin={isAdmin} />}>
          <Route element={<Layout />}>
            <Route path="/category" element={<Category />} />
            <Route path="/user" element={<User />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default AdminRoutes;
