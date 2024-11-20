import AdminHeader from '../admin/components/AdminHeader';
import SideMenu from '../admin/components/SideMenu';
import Category from '../admin/components/Category';
import User from '../admin/components/User';
import { Route, Routes } from 'react-router-dom';
import React from 'react';

import sideMenuStyles from '../admin/styles/sideMenu.module.css';

function AdminRoutes() {
  return (
    <>
      <AdminHeader />
      <div className={sideMenuStyles.parentContainer}>
        <SideMenu />
        <div className={sideMenuStyles.mainContent}>
          <Routes>
            <Route path="/" element={<Category />} />
            <Route path="/category" element={<Category />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AdminRoutes;
