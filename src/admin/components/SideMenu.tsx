import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/sideMenu.module.css';

function SideMenu() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true); // 사이드 메뉴 열림/닫힘 상태 관리

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // 메뉴 열기/닫기
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.sideMenu} ${isOpen ? styles.open : styles.closed}`}
      >
        <ul>
          <li
            className={`${styles.menuItem} ${selectedItem === 'category' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('category')}
          >
            <Link to="/admin/category">카테고리 및 옵션 관리</Link>
          </li>
          <li
            className={`${styles.menuItem} ${selectedItem === 'user' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('user')}
          >
            <Link to="/admin/user">사용자 관리</Link>
          </li>
          <li
            className={`${styles.menuItem} ${selectedItem === 'usedItems' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('usedItems')}
          >
            중고물품 관리
          </li>
          <li
            className={`${styles.menuItem} ${selectedItem === 'order' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('order')}
          >
            주문 관리
          </li>
          <li
            className={`${styles.menuItem} ${selectedItem === 'chat' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('chat')}
          >
            채팅 및 메시지 관리
          </li>
          <li
            className={`${styles.menuItem} ${selectedItem === 'stats' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('stats')}
          >
            통계 및 보고서
          </li>
          <li
            className={`${styles.menuItem} ${selectedItem === 'report' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('report')}
          >
            신고 및 검수 관리
          </li>
          <li
            className={`${styles.menuItem} ${selectedItem === 'reviews' ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick('reviews')}
          >
            리뷰 및 평가 관리
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
