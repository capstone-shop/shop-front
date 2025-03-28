import styles from '../styles/css/UserWishes.module.css';
import React, { useEffect, useState } from 'react';
import formatDate, { getProductSearch, getUserWishlist } from '../api/Utils';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Product } from '../api/Utils'; // Product를 타입으로 import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import SearchFilter from './SearchFilter';

function UserWishes() {
  const navigate = useNavigate(); // React Router의 useNavigate 훅 사용
  const options = [
    '찜 많은순',
    '낮은 가격순',
    '높은 가격순',
    '신상품순',
    '등록자 평점순',
    '상품명순',
  ];
  const sortProducts = (products: Product[], sortOption: string): Product[] => {
    switch (sortOption) {
      case '찜 많은순':
        return [...products].sort((a, b) => b.wish - a.wish); // wish 기준 내림차순
      case '낮은 가격순':
        return [...products].sort((a, b) => a.price - b.price); // price 기준 오름차순
      case '높은 가격순':
        return [...products].sort((a, b) => b.price - a.price); // price 기준 내림차순
      case '신상품순':
        return [...products].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // createdAt 기준 내림차순
      case '등록자 평점순':
        return [...products].sort(
          (a, b) => b.register.reputation - a.register.reputation
        ); // rating 기준 내림차순
      case '상품명순':
        return [...products].sort((a, b) => a.name.localeCompare(b.name)); // name 기준 알파벳 순
      default:
        return products; // 기본 정렬 (변경 없음)
    }
  };

  const [selected, setSelected] = useState<string>('찜 많은순');

  const handleSelect = (option: string) => {
    setSelected(option);
    const sortedProducts = sortProducts(originalProducts, option);
    setProducts(sortedProducts); // 정렬된 데이터 반영
    console.log(`Selected sorting option: ${option}`);
  };

  const [originalProducts, setOriginalProducts] = useState<Product[]>([]); // 원본 데이터
  const [products, setProducts] = useState<Product[]>([]); // 정렬된 데이터
  const [totalPages, setTotalPages] = useState<number>(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [startPage, setStartPage] = useState(0); // 현재 버튼 그룹의 시작 페이지
  const pageSize = 5; // 한 페이지당 항목 수
  const maxButtons = 10; // 한 번에 표시할 최대 버튼 수

  const handlePrevGroup = () => {
    if (startPage > 0) {
      setStartPage(startPage - maxButtons);
    }
  };

  const handleNextGroup = () => {
    if (startPage + maxButtons < totalPages) {
      setStartPage(startPage + maxButtons);
    }
  };
  const pageButtons = Array.from(
    { length: Math.min(maxButtons, totalPages - startPage) },
    (_, index) => startPage + index
  );

  // query 의존성 제거
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getUserWishlist({
          page: currentPage, // 현재 페이지 전달
          size: pageSize, // 페이지 크기 전달
        });
        setOriginalProducts(data.merchandise);
        setProducts(data.merchandise);
        setTotalPages(data.totalPage);
      } catch (error) {
        console.error('상품 조회 실패:', error);
      }
    };

    fetchProducts();
  }, [currentPage]); // query 대신 currentPage만 의존성으로 추가

  useEffect(() => {
    const sortedProducts = sortProducts(originalProducts, selected); // 원본 데이터 사용
    setProducts(sortedProducts); // 정렬된 데이터 업데이트
  }, [selected, originalProducts]); // selected나 originalProducts가 변경될 때만 실행

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]); // currentPage 변경 시 실행

  return (
    <div className={styles.productSearchContainer}>
      {/* 검색 필터 */}
      <SearchFilter />
      {/* 상품 리스트 */}
      <div>
        {/* 정렬기능 */}
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
        {/* 상품 리스트 */}
        <div className={styles.productList}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.card}
              onClick={() => navigate(`/productDetail/${product.id}`)} // 클릭 시 상세보기 페이지로 이동
              style={{ cursor: 'pointer' }} // 클릭 가능하도록 커서 스타일 추가
            >
              <div className={styles.imageWrapper}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productInfo}>
                <h2 className={styles.title}>{product.name}</h2>
                <p
                  className={styles.subtitle}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></p>
                <p className={styles.category}>
                  카테고리 : {product.category[0]?.title}
                </p>
                <p className={styles.category}>
                  네고 :
                  {product.negotiationAvailable
                    ? ' 가격흥정 가능'
                    : ' 가격흥정 불가'}
                </p>
                <p className={styles.category}>
                  거래방식 :{product.transactionMethod ? ' 택배' : ' 직거래'}
                </p>
                <p className={styles.category}>
                  상품 상태 :
                  {(() => {
                    switch (product.merchandiseState) {
                      case 'NEW':
                        return ' 새 상품 (미사용)';
                      case 'GOOD':
                        return ' 사용감 없음';
                      case 'AVERAGE':
                        return ' 사용감 적음';
                      case 'BAD':
                        return ' 사용감 많음';
                      case 'BROKEN':
                        return ' 고장/파손 상품';
                      default:
                        return ' 상태 정보 없음'; // 데이터가 없거나 예상치 못한 값 처리
                    }
                  })()}
                </p>
                <div className={styles.meta}>
                  <p>
                    등록일 : {formatDate(product.createdAt || '')} | 찜횟수 :{' '}
                    {product.wish} | 조회수 : {product.view} | 대화횟수 :
                    {product.chat} | 등록자 : {product.register.name} | 평점 :{' '}
                    {product.register.reputation}
                  </p>
                </div>
              </div>
              <div className={styles.priceInfo}>
                <p className={styles.firstPrice}>
                  가격: {product.price.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* 페이지네이션 UI */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {/* 이전 그룹 버튼 */}
            <button
              className={`${styles.pageButton} ${startPage === 0 ? styles.disabled : ''}`}
              onClick={handlePrevGroup}
              disabled={startPage === 0}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {/* 페이지 번호 버튼 */}
            {pageButtons.map((page) => (
              <button
                key={page}
                className={`${styles.pageButton} ${
                  page === currentPage ? styles.active : ''
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1}
              </button>
            ))}

            {/* 다음 그룹 버튼 */}
            <button
              className={`${styles.pageButton} ${
                startPage + maxButtons >= totalPages ? styles.disabled : ''
              }`}
              onClick={handleNextGroup}
              disabled={startPage + maxButtons >= totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserWishes;
