import React from 'react';
import '../styles/header.css';
import { Link } from 'react-router-dom';

function AdminHeader() {
  return (
    <div className="header">
      <h3>로고 이미지</h3>
      <div className="header-right">
        <span>사용자명</span>
        <Link to="/">
          <span>쇼핑몰 가기</span>
        </Link>
        <span></span>
        <span>로그아웃</span>
      </div>
    </div>
  );
}

export default AdminHeader;
