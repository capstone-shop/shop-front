import styles from '../styles/css/ProductSale.module.css';
import React, { useState } from 'react';

function ProductSale() {
  const [selectedCondition, setSelectedCondition] = useState<string>('');

  const handleConditionChange = (value: string) => {
    setSelectedCondition(value);
  };

  const radioOptions = [
    {
      value: 'new',
      label: '새 상품 (미사용)',
      description: '사용하지 않은 새 상품',
    },
    {
      value: 'noUsage',
      label: '사용감 없음',
      description: '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음',
    },
    {
      value: 'lightUsage',
      label: '사용감 적음',
      description: '눈에 띄는 흔적이나 얼룩이 약간 있음',
    },
    {
      value: 'heavyUsage',
      label: '사용감 많음',
      description: '눈에 띄는 흔적이나 얼룩이 많이 있음',
    },
    {
      value: 'damaged',
      label: '고장/파손 상품',
      description: '기능 이상이나 외관 손상 등으로 수리/수선 필요',
    },
  ];

  return (
    <div className={styles.productSaleFormContainer}>
      {/* 판매하기 섹션 */}
      <div className={styles.productSale}>
        <span>판매하기</span>
      </div>

      <form className={styles.productSaleSubContainer}>
        {/* 상품 이미지 등록 섹션 */}
        <div className={styles.imageSection}>
          <div>
            <span>상품 이미지</span>
          </div>
          <div>
            <button>상품 등록버튼</button>
          </div>
        </div>

        {/* 상품명 입력 섹션 */}
        <div className={styles.nameSection}>
          <div>
            <span>상품명</span>
          </div>
          <div>
            <input type="text" placeholder="상품명을 입력하세요" />
          </div>
        </div>

        {/* 카테고리 선택 섹션 */}
        <div className={styles.categorySection}>
          <div>
            <span>카테고리</span>
          </div>
          <div>
            <button>카테고리 등록</button>
          </div>
        </div>

        {/* 상품 상태 선택 (라디오 버튼 섹션) */}
        <div className={styles.conditionSection}>
          <div>
            <span>상품상태</span>
          </div>
          <div className={styles.radioGroup}>
            {radioOptions.map((option) => (
              <div key={option.value} className={styles.radioItem}>
                <input
                  type="radio"
                  id={option.value}
                  name="productCondition"
                  value={option.value}
                  checked={selectedCondition === option.value}
                  onChange={() => handleConditionChange(option.value)}
                  className={styles.radioInput}
                />
                <div>
                  <label htmlFor={option.value} className={styles.radioLabel}>
                    {option.label}
                  </label>
                  <p className={styles.radioDescription}>
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 상품 설명 입력 */}
        <div>
          <div>
            <span>설명</span>
          </div>
          <div>
            <input />
          </div>
        </div>

        {/* 가격 입력 */}
        <div>
          <div>
            <span>가격</span>
          </div>
          <div>
            <input placeholder={'가격을 입력해 주세요.'} />
          </div>
        </div>

        {/* 직거래 / 네고 가능 여부 / 택배 거래 선택*/}
        <div>
          <div>
            <div>
              <span>직거래</span>
            </div>
            <div>가능 불가 라디오체크버튼</div>
          </div>
          <div>
            <div>
              <span>네고 가능 여부</span>
            </div>
            <div>가능 불가 라디오체크버튼</div>
          </div>
          <div>
            <div>
              <span>택배 거래</span>
            </div>
            <div>가능 불가 라디오체크버튼</div>
          </div>
        </div>

        {/* 거래 장소 입력 */}
        <div>
          <div>
            <span>거래 장소 입력란</span>
          </div>
          <div>
            <input />
          </div>
        </div>

        <div>
          <div>
            <button>임시저장</button>
          </div>
          <div>
            <button>등록하기</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductSale;
