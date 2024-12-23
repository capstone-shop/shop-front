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
      <h3 className={styles.logo}>FASTBUYING</h3> {/* logo 스타일 추가 */}
      <div className={styles.headerRight}>
        <span className={styles.username}>{user?.name}</span>{' '}
        {/* 사용자 이름에 스타일 적용 */}
        <Link to="../">
          <span className={styles.shopLink}>쇼핑몰 가기</span>{' '}
          {/* 쇼핑몰 가기 링크 스타일 적용 */}
        </Link>
        <span className={styles.logout}>로그아웃</span>{' '}
        {/* 로그아웃 버튼 스타일 적용 */}
      </div>
    </div>
  );
}

export default AdminHeader;
