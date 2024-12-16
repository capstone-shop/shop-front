import styles from '../styles/css/ProductAdd.module.css';
import React, { useEffect, useState } from 'react';
import {
  CategoryResponse,
  getCategory,
  getSubCategory,
  postProduct,
} from '../api/Utils';
import { useNavigate } from 'react-router-dom';
import { Simulate } from 'react-dom/test-utils';
import submit = Simulate.submit;
import SuccessModal from './SuccessModal';
import uploadS3 from 'api/S3Upload';

function ProductAdd() {
  const navigate = useNavigate();
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [images, setImages] = useState<string[]>([]); // 이미지 배열 상태
  const [directDeal, setDirectDeal] = useState<boolean>(false);
  const [negoAvailable, setNegoAvailable] = useState<boolean>(false);
  const [deliveryDeal, setDeliveryDeal] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // 대 카테고리
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  ); // 중 카테고리
  const [selectedSmallCategory, setSelectedSmallCategory] = useState<
    number | null
  >(null); // 소 카테고리
  const [category, setCategory] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]);
  const [smallCategories, setSmallCategories] = useState<CategoryResponse[]>(
    []
  );
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    navigate('/'); // 성공 시 메인 페이지로 이동
    window.location.reload(); // 강제 새로고침
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      let uploadedCount = 0;

      Array.from(files).forEach((file, i) => {
        uploadS3(file, images).then((url) => {
          newImages[i] = url;
          uploadedCount++;
          if (uploadedCount === files.length) {
            setImages((prev) => [...prev, ...newImages]);
            event.target.value = ''; // 파일 입력 필드 초기화
          }
        });
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConditionChange = (value: string) => {
    setSelectedCondition(value);
  };

  const radioOptions = [
    {
      value: 'NEW',
      label: '새 상품 (미사용)',
      description: '사용하지 않은 새 상품',
    },
    {
      value: 'GOOD',
      label: '사용감 없음',
      description: '사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음',
    },
    {
      value: 'AVERAGE',
      label: '사용감 적음',
      description: '눈에 띄는 흔적이나 얼룩이 약간 있음',
    },
    {
      value: 'BAD',
      label: '사용감 많음',
      description: '눈에 띄는 흔적이나 얼룩이 많이 있음',
    },
    {
      value: 'BROKEN',
      label: '고장/파손 상품',
      description: '기능 이상이나 외관 손상 등으로 수리/수선 필요',
    },
  ];

  // 대 카테고리 가져오기
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategory();
        setCategory(Array.isArray(response) ? response : [response]);
      } catch (err) {
        console.error('대 카테고리 조회 중 오류 발생:', err);
      }
    };
    fetchCategory();
  }, []);

  // 중 카테고리 가져오기
  const fetchSubCategories = async (categoryId: number) => {
    try {
      const response = await getSubCategory({ id: categoryId });
      setSubCategories(Array.isArray(response) ? response : [response]);
      setSmallCategories([]); // 소 카테고리 초기화
      setSelectedSubCategory(null); // 이전 선택 초기화
      setSelectedSmallCategory(null); // 소 카테고리 선택 초기화
    } catch (err) {
      console.error('중 카테고리 조회 중 오류 발생:', err);
    }
  };

  // 소 카테고리 가져오기
  const fetchSmallCategories = async (subCategoryId: number) => {
    try {
      const response = await getSubCategory({ id: subCategoryId });
      setSmallCategories(Array.isArray(response) ? response : [response]);
      setSelectedSmallCategory(null); // 소 카테고리 선택 초기화
    } catch (err) {
      console.error('소 카테고리 조회 중 오류 발생:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 상품 등록 핸들러
  const handleProductAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert('대 카테고리를 선택해주세요.');
      return;
    }

    if (!selectedCondition) {
      alert('상품 상태를 선택해주세요.');
      return;
    }

    if (!formData.name || !formData.price || !formData.description) {
      alert('필수 입력 항목을 작성해주세요.');
      return;
    }

    const productData = {
      images, // 업로드된 이미지
      name: formData.name, // 상품명
      categoryId:
        selectedSmallCategory || selectedSubCategory || selectedCategory, // 가능한 가장 하위 카테고리 ID 사용
      state: selectedCondition, // 상품 상태
      description: formData.description, // 상품 설명
      price: Number(formData.price), // 가격
      direct: directDeal, // 직거래 가능 여부
      nego: negoAvailable, // 가격 네고 가능 여부
      delivery: deliveryDeal, // 택배 거래 가능 여부
      location: formData.location, // 거래 장소
    };

    try {
      await postProduct(productData); // 반환값 없음
      setModalMessage('상품이 성공적으로 등록되었습니다!');
      setIsModalOpen(true);
      // navigate('/');
    } catch (error) {
      console.error('상품 등록 중 오류:', error);
      setModalMessage('상품 등록에 실패했습니다. 다시 시도해주세요.');
      setIsModalOpen(true);
    }
  };

  return (
    <div className={styles.productSaleFormContainer}>
      <div className={styles.productSale}>
        <label>판매하기</label>
      </div>
      <form
        className={styles.productSaleSubContainer}
        onSubmit={handleProductAdd}
      >
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
              name="name" // name 속성 설정
              value={formData.name}
              onChange={handleInputChange}
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
          <div className={styles.categoryContainer}>
            {/* 대 카테고리 */}
            <div className={styles.categoryColumn}>
              {category.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.categoryItem} ${
                    selectedCategory === item.id
                      ? styles.categoryItemSelected
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(item.id);
                    fetchSubCategories(item.id);
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>

            {/* 중 카테고리 */}
            <div className={styles.categoryColumn}>
              {subCategories.length > 0 ? (
                subCategories.map((subItem) => (
                  <div
                    key={subItem.id}
                    className={`${styles.categoryItem} ${
                      selectedSubCategory === subItem.id
                        ? styles.categoryItemSelected
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedSubCategory(subItem.id);
                      fetchSmallCategories(subItem.id);
                    }}
                  >
                    {subItem.title}
                  </div>
                ))
              ) : (
                <div style={{ color: '#999' }}>중 카테고리가 없습니다.</div>
              )}
            </div>

            {/* 소 카테고리 */}
            <div className={styles.categoryColumn}>
              {smallCategories.length > 0 ? (
                smallCategories.map((smallItem) => (
                  <div
                    key={smallItem.id}
                    className={`${styles.categoryItem} ${
                      selectedSmallCategory === smallItem.id
                        ? styles.categoryItemSelected
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedSmallCategory(smallItem.id);
                      console.log(`소 카테고리 선택됨: ${smallItem.title}`);
                    }}
                  >
                    {smallItem.title}
                  </div>
                ))
              ) : (
                <div style={{ color: '#999' }}>소 카테고리가 없습니다.</div>
              )}
            </div>
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
              name="description" // name 속성 설정
              value={formData.description}
              onChange={handleInputChange}
            />
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
              type="number"
              placeholder="가격을 입력해 주세요."
              className={styles.priceInputField}
              name="price" // name 속성 설정
              value={formData.price}
              onChange={handleInputChange}
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
                value="true"
                checked={directDeal === true}
                onChange={() => setDirectDeal(true)} // true 설정
                className={styles.radioInput}
              />
              <label htmlFor="directDealYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                id="directDealNo"
                name="directDeal"
                value="false"
                checked={directDeal === false}
                onChange={() => setDirectDeal(false)} // false 설정
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
                value="true"
                checked={negoAvailable === true}
                onChange={() => setNegoAvailable(true)}
                className={styles.radioInput}
              />
              <label htmlFor="negoAvailableYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                id="negoAvailableNo"
                name="negoAvailable"
                value="false"
                checked={negoAvailable === false}
                onChange={() => setNegoAvailable(false)}
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
                value="true"
                checked={deliveryDeal === true}
                onChange={() => setDeliveryDeal(true)}
                className={styles.radioInput}
              />
              <label htmlFor="deliveryDealYes" className={styles.radioLabel}>
                가능
              </label>
              <input
                type="radio"
                id="deliveryDealNo"
                name="deliveryDeal"
                value="false"
                checked={deliveryDeal === false}
                onChange={() => setDeliveryDeal(false)}
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
              name="location" // name 속성 설정
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* 구분선 */}
        <div className={styles.productSaleDivider}></div>
        {/* 등록 */}
        <div>
          <div className={styles.buttonGroup}>
            <button className={styles.tempSaveButton}>임시저장</button>
            <button type="submit" className={styles.submitButton}>
              등록하기
            </button>
          </div>
        </div>
      </form>
      {/* 모달 렌더링 */}
      {isModalOpen && (
        <SuccessModal
          message={modalMessage}
          onClose={closeModal} // 확인 버튼 클릭 시 닫기
        />
      )}
    </div>
  );
}

export default ProductAdd;
