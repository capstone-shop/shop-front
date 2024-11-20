import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/header.module.css';

function AdminHeader() {
  return (
    <div className={styles.header}>
      <h3>로고 이미지</h3>
      <div className={styles.headerRight}>
        <span>사용자명</span>
        <Link to="../">
          <span>쇼핑몰 가기</span>
        </Link>
        <span></span>
        <span>로그아웃</span>
      </div>
    </div>
  );
}

export default AdminHeader;
