import styles from '../styles/css/ProductSearch.module.css';
import React, { useState } from 'react';

function ProductSearch() {
  const categories = [
    {
      name: '카테고리',
      options: ['노트북', '남성의류', '여성의류', '도서', '휴대폰', '데스크톱'],
    },
    {
      name: '찜 횟수 기준',
      options: ['100 이상', '50 이상', '10 이상'],
    },
    {
      name: '등록자 평점 기준',
      options: ['100 이상', '50 이상', '10 이상'],
    },
    {
      name: '거래 방식',
      options: ['직거래 가능', '택배거래 가능'],
    },
    {
      name: '상품 상태',
      options: [
        '새 상품(미사용)',
        '사용감 적음',
        '사용감 중간',
        '사용감 많음',
        '고장/파손 상품',
      ],
    },
  ];

  return (
    <div className={styles.productSearchContainer}>
      {/**/}
      <div className={styles.container}>
        {/* 카테고리 영역 */}
        <div className={styles.categoryRow}>
          {categories.map((category, idx) => (
            <div key={idx} className={styles.categoryCell}>
              <span className={styles.categoryName}>{category.name}</span>
              <div className={styles.options}>
                {category.options.map((option, i) => (
                  <label key={i} className={styles.option}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 필터 영역 */}
        <div className={styles.filterFooter}>
          <div className={styles.footerOptions}>
            <div className={styles.priceFilter}>
              <input
                type="text"
                className={styles.priceInput}
                placeholder="원"
              />
              <span>~</span>
              <input
                type="text"
                className={styles.priceInput}
                placeholder="원"
              />
            </div>
          </div>
          <button className={styles.searchButton}>검색</button>
        </div>
      </div>
      {/**/}
      <div>사이드바</div>
      {/**/}
      <div>검색결과</div>
    </div>
  );
}

export default ProductSearch;
