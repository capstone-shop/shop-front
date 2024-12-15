import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../api/Utils';

import styles from '../styles/header.module.css';

export interface User {
  createdAt: string;
  modifiedAt: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  dealingCount: number;
  reputation: number;
  authProvider: string;
  profileImages: string;
}

function AdminHeader() {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        console.log('유저 데이터:', response);
        setUser(response);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류 발생:', err);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.header}>
      <h3>로고 이미지</h3>
      <div className={styles.headerRight}>
        <span>{user?.name}</span>
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
