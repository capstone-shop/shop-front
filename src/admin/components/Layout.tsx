import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import SideMenu from './SideMenu';

import sideMenuStyles from '../styles/sideMenu.module.css';

function Layout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(true);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen); // 사이드 메뉴 열기/닫기
  };

  return (
    <div>
      <AdminHeader />
      <div
        className={`${sideMenuStyles.layout} ${isSideMenuOpen ? sideMenuStyles.sideMenuOpen : sideMenuStyles.sideMenuClosed}`}
      >
        <SideMenu />
        <div className={sideMenuStyles.mainContent}>
          <button
            onClick={toggleSideMenu}
            className={sideMenuStyles.toggleButton}
          >
            {isSideMenuOpen ? '<' : '>'}
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
