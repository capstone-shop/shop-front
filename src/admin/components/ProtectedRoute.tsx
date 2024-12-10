import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  // 관리자가 아니라면 로그인 페이지로 리다이렉트
  if (!isAdmin) {
    alert('관리자 권한이 필요합니다.');
    return <Navigate to="/admin" replace />;
  }
  // 관리자인 경우 하위 라우트를 렌더링
  return <Outlet />;
};

export default ProtectedRoute;
