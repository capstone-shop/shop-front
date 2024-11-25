import styles from '../styles/css/ProductSearch.module.css';
import React, { useState } from 'react';

function ProductSearch() {
  // interface PageNation {
  //   page : [Integer] //생략가능, default=0
  //   size=[Integer] //생략가능, default=20
  //   sort=[String] //생략가능, default=”wish,desc”
  //   search=[String] //생략가능, default=””
  //   filter=[String] //생략가능, default=””
  // }

  interface Product {
    id: number;
    title: string;
    subtitle: string;
    category: string;
    price: {
      first: number;
      second: number;
    };
    parcelAvailability: string;
    rating: number;
    reviews: number;
    image: string;
  }

  const options = [
    '찜 많은순',
    '낮은 가격순',
    '높은 가격순',
    '신상품순',
    '등록자 평점순',
    '상품명순',
  ];

  const [selected, setSelected] = useState<string>('찜 많은순');

  const handleSelect = (option: string) => {
    setSelected(option);
    console.log(`Selected sorting option: ${option}`); // 정렬 상태를 콘솔에 출력 (테스트용)
  };

  const products: Product[] = [
    {
      id: 1,
      title: '상품명',
      subtitle: '상품 설명',
      parcelAvailability: '택배 / 직거래',
      category: '대 카테고리 / 중 카테고리 / 소 카테고리',
      price: { first: 1000000, second: 1616290 },
      rating: 4.8,
      reviews: 822,
      image: '/images/iphone16-256gb.jpg',
    },
    {
      id: 1,
      title: '상품명',
      subtitle: '상품 설명',
      parcelAvailability: '택배 / 직거래',
      category: '대 카테고리 / 중 카테고리 / 소 카테고리',
      price: { first: 1358000, second: 1616290 },
      rating: 4.8,
      reviews: 822,
      image: '/images/iphone16-256gb.jpg',
    },
  ];

  const categories = [
    {
      name: '카테고리',
      options: [
        '노트북',
        '남성의류',
        '여성의류',
        '도서',
        '휴대폰',
        '데스크톱',
        '노트북',
        '남성의류',
        '여성의류',
        '도서',
        '휴대폰',
        '데스크톱',
      ],
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
      {/* 카테고리, 필터 */}
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
      {/* 상품 리스트 */}
      <div>
        {/*정렬기능*/}
        <div className={styles.sortOptions}>
          {options.map((option) => (
            <button
              key={option}
              className={`${styles.sortBtn} ${
                selected === option ? styles.selected : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={styles.productList}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              {/* 상품 이미지 */}
              <div className={styles.imageWrapper}>
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles.productImage}
                />
              </div>

              {/* 상품 정보 */}
              <div className={styles.productInfo}>
                <h2 className={styles.title}>{product.title}</h2>
                <p className={styles.subtitle}>{product.subtitle}</p>
                <p className={styles.category}>{product.category}</p>
                <p className={styles.category}>{product.parcelAvailability}</p>
                {/* 기타 정보 */}
                <div className={styles.meta}>
                  <p>
                    등록일: 2024.09 | 상품의견 {product.reviews}개 | ⭐{' '}
                    {product.rating}
                  </p>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className={styles.priceInfo}>
                <p className={styles.firstPrice}>
                  가격: {product.price.first.toLocaleString()}원
                </p>
                <p className={styles.secondPrice}>
                  가격: {product.price.second.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;
