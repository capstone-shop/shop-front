import React, { useEffect, useState } from 'react';
import styles from '../styles/css/Main.module.css';
import Carousel from 'react-bootstrap/Carousel';
import { getProductHome, HomeData } from '../api/Utils';
import { useNavigate } from 'react-router-dom';

function Main() {
  const [homeData, setHomeData] = useState<HomeData>({
    recentlyRegistered: [],
    mostWished: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductHome({});
        console.log('홈화면 API 데이터:', response);
        setHomeData(response);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류 발생:', err);
      }
    };

    fetchProducts();
  }, []);

  const ProductCard = ({ product }: { product: any }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
      navigate(`/productDetail/${product.id}`); // 상품 ID를 경로에 추가
    };
    return (
      <div
        className={styles.productCard}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.productImage}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <span className={styles.productName}>{product.name}</span>
        <p className={styles.productPrice}>
          {product.price.toLocaleString()}원
        </p>
        <p className={styles.productMeta}>
          ♥ {product.wish} 댓글: {product.chat} 조회수: {product.view}
          <br />
          {product.transactionMethod === 'DIRECT'
            ? '직거래'
            : product.transactionMethod === 'DELIVERY'
              ? '택배'
              : '택배 / 직거래'}
        </p>
        <p className={styles.productTags}>
          {product.category.map((cat: any) => `#${cat.title}`).join(' ')}
        </p>
      </div>
    );
  };

  const ProductSection = ({
    title,
    subtitle,
    products,
  }: {
    title: string;
    subtitle: string;
    products: any[];
  }) => {
    return (
      <div className={styles.productContainer}>
        <div className={styles.productHeader}>
          <h2 className={styles.productTitle}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.productList}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.carousel}>
        <Carousel className={styles.carousel} interval={10000}>
          <Carousel.Item>
            <img src="https://via.placeholder.com/800x400" alt="1번" />
            <Carousel.Caption>
              <span>믿을만한 이웃 간 중고거래!</span>
              <p>동네 주민들과 가깝고 따뜻한 거래를 지금 경험해보세요.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="https://via.placeholder.com/800x400" alt="2번" />
            <Carousel.Caption>
              <span>동네 이웃들과 함께하는 중고거래</span>
              <p>지금 등록하고, 현금으로 바꿔보세요!</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* 최근 등록된 상품 영역 */}
      <ProductSection
        title="최근 등록된 상품"
        subtitle="실시간으로 올라온 상품들을 만나보세요!"
        products={homeData.recentlyRegistered}
      />

      {/* 가장 많이 찜한 상품 */}
      <ProductSection
        title="가장 많이 찜한 상품"
        subtitle="사람들이 예의주시하고 있는 상품들!"
        products={homeData.mostWished}
      />
    </div>
  );
}

export default Main;
