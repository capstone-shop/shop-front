import React from 'react';
import styles from '../styles/css/Main.module.css';
import Carousel from 'react-bootstrap/Carousel';

function Main() {
  return (
    <div>
      {/* 카로셀 영역 */}
      <div className={styles.carousel}>
        <Carousel className={styles.carousel} interval={5000}>
          {' '}
          {/* 전체 슬라이드 전환 속도를 5초로 설정 */}
          <Carousel.Item>
            <img src="https://via.placeholder.com/800x400" alt="1번" />
            <Carousel.Caption>
              <span>First slide label</span>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className={'form-logo'}
              src="https://via.placeholder.com/800x400"
              alt="로고 이미지"
            />
            <Carousel.Caption>
              <span>Second slide label</span>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className={'form-logo'}
              src="https://via.placeholder.com/800x400"
              alt="로고 이미지"
            />
            <Carousel.Caption>
              <span>Third slide label</span>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* 최근 등록된 상품 영역 */}
      <div className={styles.productContainer}>
        <div className={styles.productHeader}>
          <h2 className={styles.productTitle}>최근 등록된 상품</h2>
          <p className={styles.subtitle}>
            실시간으로 올라온 상품들을 만나보세요!
          </p>
        </div>

        <div className={styles.productList}>
          {/* 상품 카드 */}
          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>아이폰16 (자급제 공기계)</span>
            <p className={styles.productPrice}>1,400,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 0<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#휴대폰 #아이폰 #아이폰16</p>
          </div>

          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>맛난 상추 한 묶음</span>
            <p className={styles.productPrice}>5,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 0<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#채소 #상추</p>
          </div>

          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>딱 하루만 쓴 우산</span>
            <p className={styles.productPrice}>5,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 1<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#기타</p>
          </div>

          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>딱 하루만 쓴 우산</span>
            <p className={styles.productPrice}>5,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 1<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#기타</p>
          </div>
        </div>
      </div>

      {/* 가장 많이 찜한 상품 */}
      <div className={styles.productContainer}>
        <div className={styles.productHeader}>
          <h2 className={styles.productTitle}>가장 많이 찜한 상품</h2>
          <p className={styles.subtitle}>사람들이 예의주시하고 있는 상품들!</p>
        </div>

        <div className={styles.productList}>
          {/* 상품 카드 */}
          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>아이폰16 (자급제 공기계)</span>
            <p className={styles.productPrice}>1,400,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 0<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#휴대폰 #아이폰 #아이폰16</p>
          </div>

          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>맛난 상추 한 묶음</span>
            <p className={styles.productPrice}>5,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 0<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#채소 #상추</p>
          </div>

          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>딱 하루만 쓴 우산</span>
            <p className={styles.productPrice}>5,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 1<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#기타</p>
          </div>

          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <span className={styles.productName}>딱 하루만 쓴 우산</span>
            <p className={styles.productPrice}>5,000원</p>
            <p className={styles.productMeta}>
              ♥ 0 댓글: 0 조회수: 1<br />
              택배 / 직거래
            </p>
            <p className={styles.productTags}>#기타</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
