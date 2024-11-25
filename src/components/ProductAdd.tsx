import styles from '../styles/css/ProductAdd.module.css';
import React, { useState } from 'react';

function ProductAdd() {
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result); // 업로드한 이미지를 상태로 설정
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      value: 'likeNew',
      label: '사용감 없음',
      description: '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음',
    },
    {
      value: 'slightWear',
      label: '사용감 적음',
      description: '눈에 띄는 흔적이나 얼룩이 약간 있음',
    },
    {
      value: 'visibleWear',
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
      <div className={styles.productSale}>
        <label>판매하기</label>
      </div>
      <form className={styles.productSaleSubContainer}>
        {/* 상품 이미지 등록 */}
        <div className={styles.productSaleGroup}>
          <div className={styles.labelContainer}>
            <label>상품 이미지</label>
          </div>
          {/* 이미지 업로드 버튼 */}
          <div className={styles.uploadContainer}>
            <label htmlFor="image-input" className={styles.uploadButton}>
              {image ? (
                <img
                  src={image}
                  alt="Uploaded"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.placeholder}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.cameraIcon}
                  >
                    <rect
                      x="3"
                      y="8"
                      width="18"
                      height="12"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="12" cy="14" r="3"></circle>
                    <path d="M5 8l2-3h10l2 3"></path>
                  </svg>
                  <p>이미지 등록</p>
                </div>
              )}
            </label>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 상품명 입력 */}
        <div className={styles.productSaleGroup}>
          <div className={styles.labelContainer}>
            <label>상품명</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="상품명을 입력해 주세요"
              className={styles.inputField}
            />
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 카테고리 선택 */}
        <div className={styles.productSaleGroup}>
          <div className={styles.labelContainer}>
            <label>카테고리</label>
          </div>
          <div>
            <button>카테고리 등록</button>
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 상품 상태 선택 (라디오 버튼) */}
        <div className={styles.productSaleGroup}>
          <div className={styles.labelContainer}>
            <label>상품상태</label>
          </div>
          <div className={styles.radioGroup}>
            {radioOptions.map((option) => (
              <div key={option.value} className={styles.radioItem}>
                {/* 숨겨진 라디오 버튼 */}
                <input
                  type="radio"
                  id={option.value}
                  name="productCondition"
                  value={option.value}
                  checked={selectedCondition === option.value}
                  onChange={() => handleConditionChange(option.value)}
                  className={styles.radioInput}
                />
                {/* 라벨과 설명 */}
                <label htmlFor={option.value} className={styles.radioLabel}>
                  <span className={styles.radioText}>{option.label}</span>
                  <p className={styles.radioDescription}>
                    {option.description}
                  </p>
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 상품 설명 입력 */}
        <div className={styles.productSaleGroup}>
          <div className={styles.labelContainer}>
            <label>설명</label>
          </div>
          <div className={styles.textAreaContainer}>
            <textarea
              placeholder="브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요."
              className={styles.textAreaField}
            ></textarea>
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 가격 입력 */}
        <div className={styles.productSaleGroup}>
          <div className={styles.labelContainer}>
            <label>가격</label>
          </div>
          <div className={styles.priceInput}>
            <input
              type="text"
              placeholder="가격을 입력해 주세요."
              className={styles.priceInputField}
            />
            <span className={styles.priceInputUnit}>원</span>
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 직거래 / 네고 / 택배 거래 (라디오 버튼)*/}
        <div className={styles.radioGroup}>
          {/* 직거래 */}
          <div className={styles.radioItem}>
            <span className={styles.radioText}>직거래</span>
            <div className={styles.radioOptions}>
              <input type="radio" value="가능" className={styles.radioInput} />
              <label htmlFor="directDealYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                value="불가"
                defaultChecked
                className={styles.radioInput}
              />
              <label htmlFor="directDealNo" className={styles.radioLabel}>
                불가
              </label>
            </div>
          </div>

          {/* 네고 가능 여부 */}
          <div className={styles.radioItem}>
            <span className={styles.radioText}>네고 가능 여부</span>
            <div className={styles.radioOptions}>
              <input type="radio" value="가능" className={styles.radioInput} />
              <label htmlFor="negoAvailableYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                value="불가"
                defaultChecked
                className={styles.radioInput}
              />
              <label htmlFor="negoAvailableNo" className={styles.radioLabel}>
                불가
              </label>
            </div>
          </div>

          {/* 택배 거래 */}
          <div className={styles.radioItem}>
            <span className={styles.radioText}>택배 거래</span>
            <div className={styles.radioOptions}>
              <input type="radio" value="가능" className={styles.radioInput} />
              <label htmlFor="deliveryDealYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                value="불가"
                defaultChecked
                className={styles.radioInput}
              />
              <label htmlFor="deliveryDealNo" className={styles.radioLabel}>
                불가
              </label>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 거래 장소 입력 */}
        <div className={styles.productSaleGroup}>
          <div className={styles.labelContainer}>
            <label>거래 장소 입력란</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="거래 장소를 입력해 주세요"
              className={styles.inputField}
            />
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 등록 */}
        <div>
          <div className={styles.buttonGroup}>
            <button className={styles.tempSaveButton}>임시저장</button>
            <button className={styles.submitButton}>등록하기</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductAdd;
