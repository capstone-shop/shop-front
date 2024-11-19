import AdminHeader from '../admin/components/AdminHeader';
import SideMenu from '../admin/components/SideMenu';
import Category from '../admin/components/Category';
import User from '../admin/components/User';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import '../admin/styles/sideMenu.css';

function AdminRoutes() {
  return (
    <>
      <AdminHeader />
      <div className="parent-container">
        <SideMenu />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Category />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/user" element={<User />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AdminRoutes;
