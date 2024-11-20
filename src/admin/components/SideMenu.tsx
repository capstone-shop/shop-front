import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/sideMenu.module.css';

function SideMenu() {
  return (
    <div className={styles.parentContainer}>
      <div className={styles.sideMenu}>
        <ul>
          <li>
            <Link to="/admin/category">카테고리 및 옵션 관리</Link>
          </li>
          <li>
            <Link to="/admin/user">사용자 관리</Link>
          </li>
          <li>중고물품 관리</li>
          <li>주문 관리</li>
          <li>채팅 및 메시지 관리</li>
          <li>통계 및 보고서</li>
          <li>신고 및 검수 관리</li>
          <li>리뷰 및 평가 관리</li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
