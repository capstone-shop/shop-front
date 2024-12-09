import styles from '../styles/css/ProductDetail.module.css';
import React, { useEffect, useState } from 'react';
import formatDate, {
  getProductDetail,
  Product,
  ProductDetailResponse,
} from '../api/Utils';
import { useNavigate, useParams } from 'react-router-dom';
function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(1); // 현재 선택된 이미지
  const { id } = useParams<{ id: string }>(); // URL에서 id 가져오기
  const [productDetail, setProductDetail] =
    useState<ProductDetailResponse | null>(null);
  const navigate = useNavigate(); // React Router의 navigate 함수

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await getProductDetail({ id: Number(id) }); // id를 API 호출에 사용
        setProductDetail(response);
        console.log('상세보기 데이터:', response);
      } catch (error) {
        console.error('상품 상세정보를 가져오는 중 오류 발생:', error);
      }
    };

    if (id) {
      fetchProductDetail(); // URL에서 얻은 id를 기반으로 데이터 로드
    }
  }, [id]);

  return (
    <div className={styles.productContainer}>
      {/* 상품 헤더 */}
      <div className={styles.productHeaderContainer}>
        <div>
          <span className={styles.productHeaderTitle}>
            {productDetail?.merchandise.name}
          </span>
        </div>
        <div>
          <span className={styles.productHeaderNego}>
            {productDetail?.merchandise.negotiationAvailable
              ? '가격 흥정 가능'
              : '가격 흥정 불가'}
          </span>
        </div>
        <div>{productDetail?.merchandise.category[0]?.title}</div>
      </div>
      {/**/}
      <div className={styles.productInfoContainer}>
        <div>
          <div className={styles.galleryContainer}>
            {/* 메인 이미지 */}
            <div className={styles.mainImageContainer}>
              {productDetail?.merchandise.images[selectedImage - 1] ? (
                <img
                  src={productDetail.merchandise.images[selectedImage - 1]}
                  alt={`메인 이미지 ${selectedImage}`}
                  className={styles.mainImage}
                />
              ) : (
                '이미지가 없습니다.'
              )}
            </div>

            {/* 썸네일 리스트 */}
            <div className={styles.productThumbnailContainer}>
              {/* 실제 썸네일 */}
              {(productDetail?.merchandise.images ?? []).map((img, index) => (
                <div
                  key={`img-${index}`}
                  className={`${styles.productThumbnail} ${
                    index + 1 === selectedImage
                      ? styles.selectedProductThumbnail
                      : ''
                  }`}
                  onClick={() => setSelectedImage(index + 1)}
                >
                  <img src={img} alt={`썸네일 ${index + 1}`} />
                </div>
              ))}

              {/* 부족한 썸네일을 더미로 채우기 */}
              {Array.from({
                length: Math.max(
                  5 - (productDetail?.merchandise.images?.length ?? 0),
                  0
                ),
              }).map((_, index) => (
                <div
                  key={`dummy-${index}`}
                  className={styles.productThumbnail}
                  style={{
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span>+</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.infoContainer}>
            {/* 등록일 */}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>등록일:</span>
              <span className={styles.infoValue}>
                {formatDate(productDetail?.merchandise.createdAt || '')}
              </span>
            </div>

            {/* 조회수 */}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>조회수:</span>
              <span className={styles.infoValue}>
                {productDetail?.merchandise.view || 0} {/* 기본값 0 */}
              </span>
            </div>

            {/* 찜 횟수 */}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>찜 횟수:</span>
              <span className={styles.infoValue}>
                {productDetail?.merchandise.wish || 0} {/* 기본값 0 */}
              </span>
            </div>

            {/* 대화 횟수 */}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>대화 횟수:</span>
              <span className={styles.infoValue}>
                {productDetail?.merchandise.chat || 0} {/* 기본값 0 */}
              </span>
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
                  <div className={styles.username}>
                    <span>
                      {productDetail?.merchandise.register.name || '알 수 없음'}
                    </span>
                  </div>
                  <div className={styles.userRating}>
                    사용자 평점:{' '}
                    {productDetail?.merchandise.register.reputation || 0}/100
                  </div>
                </div>
              </div>

              {/* 상품 정보 */}
              <div className={styles.productInfo}>
                <div className={styles.price}>
                  가격: {productDetail?.merchandise.price.toLocaleString()}원
                </div>
                <div className={styles.tradeMethod}>
                  거래 방식 :
                  {productDetail?.merchandise.transactionMethod === 'DIRECT'
                    ? ' 직거래'
                    : productDetail?.merchandise.transactionMethod ===
                        'DELIVERY'
                      ? ' 택배'
                      : ' 알 수 없음'}{' '}
                  ({productDetail?.merchandise.location || '위치 정보 없음'})
                </div>
                <div className={styles.productStatus}>
                  상품 상태 :{' '}
                  {(() => {
                    switch (productDetail?.merchandise.merchandiseState) {
                      case 'NEW':
                        return '새 상품 (미사용)';
                      case 'GOOD':
                        return '사용감 없음';
                      case 'AVERAGE':
                        return '사용감 적음';
                      case 'BAD':
                        return '사용감 많음';
                      case 'BROKEN':
                        return '고장/파손 상품';
                      default:
                        return '상태 정보 없음'; // 데이터 값이 없거나 예상치 못한 값 처리
                    }
                  })()}
                </div>

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
                    value={
                      productDetail?.merchandise.description
                        ? productDetail.merchandise.description.replace(
                            /<[^>]*>/g,
                            ''
                          ) // HTML 태그 제거
                        : '설명이 없습니다.'
                    }
                    className={styles.descriptionBox}
                  />
                </div>
              </div>
            </div>
            {/* 오른쪽 중고 관련 상품 목록 */}
            <div className={styles.similarProducts}>
              {productDetail?.relatedMerchandise.length ? (
                productDetail.relatedMerchandise.map((item) => (
                  <div
                    key={item.id}
                    className={styles.similarProduct}
                    onClick={() => navigate(`/productDetail/${item.id}`)} // 클릭 시 상세 페이지로 이동
                    style={{ cursor: 'pointer' }} // 클릭 가능하도록 커서 스타일 추가
                  >
                    <div>{item.name}</div>
                    <div>{item.price.toLocaleString()}원</div>
                    <div>{item.location}</div>
                  </div>
                ))
              ) : (
                <div>관련 상품이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 하단 중고 관련 상품 목록 */}
      <div className={styles.productList}>
        {productDetail?.relatedMerchandise.map((product) => (
          <div
            key={product.id}
            className={styles.productCard}
            onClick={() => navigate(`/productDetail/${product.id}`)} // 클릭 시 상세보기 페이지로 이동
            style={{ cursor: 'pointer' }} // 클릭 가능하도록 커서 스타일 추가
          >
            {/* 상품 이미지 */}
            <div className={styles.productImageContainer}>
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={styles.productImage}
                />
              ) : (
                '이미지가 없습니다.'
              )}
            </div>

            {/* 상품 제목 */}
            <div className={styles.productTitle}>{product.name}</div>

            {/* 상품 상세 정보 */}
            <div className={styles.relatedProductDetails}>
              <div className={styles.negotiable}>
                가격흥정 /{' '}
                <span className={styles.unavailable}>
                  {product.negotiationAvailable ? '가능' : '불가'}
                </span>
              </div>
              <div className={styles.relatedProductTradeMethod}>
                {product.transactionMethod === 'DIRECT' ? '직거래' : '택배'}
              </div>
              <div className={styles.relatedProductTradeMethod}>
                {product.location}
              </div>
              <div className={styles.price}>
                {product.price.toLocaleString()}원
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetail;
