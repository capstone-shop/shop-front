import styles from '../styles/css/Product.module.css';
import React, { useState } from 'react';
function Product() {
  const [selectedImage, setSelectedImage] = useState(1); // 현재 선택된 이미지

  const images = [
    { id: 1, label: '1번 이미지' },
    { id: 2, label: '2번 이미지' },
    { id: 3, label: '3번 이미지' },
    { id: 4, label: '4번 이미지' },
    { id: 5, label: '5번 이미지' },
  ];

  const products = Array.from({ length: 6 }).map((_, index) => ({
    id: index + 1,
    title: `${index + 1}번 중고 물품 상품명`,
    negotiable: '불가', // 가격흥정 가능 여부
    tradeMethod: '택배 / 직거래',
    location: '노원구 월계로',
    price: '1,400,000',
  }));

  return (
    <div className={styles.productContainer}>
      {/* 상품 헤더 */}
      <div className={styles.productHeaderContainer}>
        <div>
          <span className={styles.productHeaderTitle}>상품명</span>
        </div>
        <div>
          <span className={styles.productHeaderNego}>
            가격 흥정 가능 / 불가
          </span>
        </div>
        <div>
          <span className={styles.productHeaderCategory}>대 카테고리</span>
          <span> | </span>
          <span className={styles.productHeaderCategory}>중 카테고리</span>
          <span> | </span>
          <span className={styles.productHeaderCategory}>소 카테고리</span>
        </div>
      </div>
      {/**/}
      <div className={styles.productInfoContainer}>
        <div>
          <div className={styles.galleryContainer}>
            {/* 메인 이미지 */}
            <div className={styles.mainImage}>
              {images.find((img) => img.id === selectedImage)?.label}
            </div>

            {/* 썸네일 리스트 */}
            <div className={styles.productThumbnailContainer}>
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`${styles.productThumbnail} ${
                    img.id === selectedImage
                      ? styles.selectedProductThumbnail
                      : ''
                  }`}
                  onClick={() => setSelectedImage(img.id)}
                >
                  {img.label}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>등록일:</span>
              <span className={styles.infoValue}>2024년 11월 02일</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>조회수:</span>
              <span className={styles.infoValue}>2000</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>찜 횟수:</span>
              <span className={styles.infoValue}>10</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>대화 횟수:</span>
              <span className={styles.infoValue}>5</span>
            </div>
          </div>
        </div>
        <div style={{ width: '710px' }}>
          <div className={styles.container}>
            {/* 왼쪽 상품 정보 */}
            <div className={styles.productDetails}>
              {/* 사용자 정보 */}
              <div className={styles.userInfo}>
                <div className={styles.profileImage}></div>
                <div>
                  <div className={styles.username}>유저 이름</div>
                  <div className={styles.userRating}>사용자 평점: 1/100</div>
                </div>
              </div>

              {/* 상품 정보 */}
              <div className={styles.productInfo}>
                <div className={styles.price}>가격: 1,000,000원</div>
                <div className={styles.tradeMethod}>
                  거래 방식: 택배 / 직거래 (거래 장소)
                </div>
                <div className={styles.productStatus}>상품 상태: 미사용</div>
                <div className={styles.actions}>
                  <button className={styles.chatButton}>채팅하기</button>
                  <button className={styles.likeButton}>찜하기</button>
                </div>
              </div>

              {/* 상품 설명 */}
              <div className={styles.productDescription}>
                <div className={styles.descriptionTitle}>상품 설명</div>
                <div>
                  <textarea
                    readOnly
                    value="상품 설명"
                    className={styles.descriptionBox}
                  />
                </div>
              </div>
            </div>

            {/* 오른쪽 관련 상품 목록 */}
            <div className={styles.similarProducts}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.similarProduct}>
                  {index + 1}번 중고 물품
                  <br />
                  1,400,000원
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/**/}
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            {/* 상품 이미지 */}
            <div className={styles.productImage}>물품 이미지</div>

            {/* 상품 제목 */}
            <div className={styles.productTitle}>{product.title}</div>

            {/* 상품 상세 정보 */}
            <div className={styles.relatedProductDetails}>
              <div className={styles.negotiable}>
                가격흥정 가능 /{' '}
                <span className={styles.unavailable}>{product.negotiable}</span>
              </div>
              <div className={styles.relatedProductTradeMethod}>
                {product.tradeMethod}
              </div>
              <div className={styles.relatedProductTradeMethod}>
                {product.location}
              </div>
              <div className={styles.price}>{product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
