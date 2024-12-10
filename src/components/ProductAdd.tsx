import styles from '../styles/css/ProductAdd.module.css';
import React, { useState } from 'react';

function ProductAdd() {
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [images, setImages] = useState<string[]>([]); // 이미지 배열 상태
  const [directDeal, setDirectDeal] = useState('불가');
  const [negoAvailable, setNegoAvailable] = useState('불가');
  const [deliveryDeal, setDeliveryDeal] = useState('불가');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            newImages.push(reader.result); // 이미지 URL을 배열에 추가
            // 모든 이미지를 로드한 후 상태 업데이트
            if (newImages.length === files.length) {
              setImages((prev) => [...prev, ...newImages]); // 기존 이미지와 병합
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    // 특정 인덱스의 이미지를 삭제
    setImages((prev) => prev.filter((_, i) => i !== index));
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
          <div className={styles.uploadContainer}>
            {/* 이미지 업로드 버튼 */}
            <label htmlFor="image-input" className={styles.uploadButton}>
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
                  <rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect>
                  <circle cx="12" cy="14" r="3"></circle>
                  <path d="M5 8l2-3h10l2 3"></path>
                </svg>
                <p>이미지 등록</p>
              </div>
            </label>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple // 다중 이미지 업로드를 가능하게 설정
              style={{ display: 'none' }}
            />
          </div>

          {/* 이미지 미리보기 */}
          <div className={styles.previewContainer}>
            {images.map((image, index) => (
              <div key={index} className={styles.previewWrapper}>
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveImage(index)} // 이미지 삭제 핸들러
                >
                  ✕
                </button>
              </div>
            ))}
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
              <input
                type="radio"
                id="directDealYes"
                name="directDeal"
                value="가능"
                checked={directDeal === '가능'}
                onChange={(e) => setDirectDeal(e.target.value)}
                className={styles.radioInput}
              />
              <label htmlFor="directDealYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                id="directDealNo"
                name="directDeal"
                value="불가"
                checked={directDeal === '불가'}
                onChange={(e) => setDirectDeal(e.target.value)}
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
              <input
                type="radio"
                id="negoAvailableYes"
                name="negoAvailable"
                value="가능"
                checked={negoAvailable === '가능'}
                onChange={(e) => setNegoAvailable(e.target.value)}
                className={styles.radioInput}
              />
              <label htmlFor="negoAvailableYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                id="negoAvailableNo"
                name="negoAvailable"
                value="불가"
                checked={negoAvailable === '불가'}
                onChange={(e) => setNegoAvailable(e.target.value)}
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
              <input
                type="radio"
                id="deliveryDealYes"
                name="deliveryDeal"
                value="가능"
                checked={deliveryDeal === '가능'}
                onChange={(e) => setDeliveryDeal(e.target.value)}
                className={styles.radioInput}
              />
              <label htmlFor="deliveryDealYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                id="deliveryDealNo"
                name="deliveryDeal"
                value="불가"
                checked={deliveryDeal === '불가'}
                onChange={(e) => setDeliveryDeal(e.target.value)}
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
