import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import SideMenu from './SideMenu';

import sideMenuStyles from '../styles/sideMenu.module.css';

function Layout() {
  return (
    <div>
      <AdminHeader />
      <div className={sideMenuStyles.parentContainer}>
        <SideMenu />
        <div className={sideMenuStyles.mainContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Layout;
