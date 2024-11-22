import React, { useState } from 'react';
import styles from '../styles/categoryModal.module.css'; // CSS 모듈 import

interface CategoryAddModalProps {
  parentsTitle: string | null;
  categoryType: 'large' | 'middle' | 'small'; // 카테고리 타입 (대/중/소)
  onSave: (
    // 저장 함수
    newCategory: string,
    categoryType: 'large' | 'middle' | 'small'
  ) => void;
  onCancel: () => void; // 취소 함수
}

function CategoryAddModal({
  parentsTitle,
  categoryType,
  onSave,
  onCancel,
}: CategoryAddModalProps) {
  const [categoryName, setCategoryName] = useState<string>(''); // 카테고리 이름 상태
  const [hasSubcategory, setHasSubcategory] = useState('false'); // 하위 카테고리 여부 상태

  // 카테고리 타입에 따른 텍스트 라벨
  const categoryTypeLabel =
    categoryType === 'large' ? '대' : categoryType === 'middle' ? '중' : '소';

  // 저장 버튼 클릭 시 처리
  const handleSaveClick = () => {
    if (categoryName.trim() !== '') {
      // 카테고리 이름이 비어있지 않으면 저장
      onSave(categoryName, categoryType); // onSave 함수 호출
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <h3>카테고리 추가하기</h3>
        <div className={styles.modalContent}>
          {parentsTitle && <p>부모 카테고리 : {parentsTitle} </p>}
          <p>카테고리 분류 : {categoryTypeLabel}</p>
          <div className={styles.labelDiv}>
            <label>
              <span>카테고리 이름 :</span>
              <input
                type="text"
                value={categoryName} // 입력값을 categoryName 상태와 연결
                onChange={(e) => setCategoryName(e.target.value)} // 입력값 변경 시 상태 업데이트
                placeholder="카테고리 이름"
              />
            </label>
            <label>
              <span>하위카테고리 :</span>
              <select
                value={hasSubcategory} // 선택된 하위 카테고리 여부 값
                onChange={(e) => setHasSubcategory(e.target.value)} // 선택값 변경 시 상태 업데이트
              >
                <option value="false">하위 카테고리 없음</option>
                {categoryType !== 'small' && ( // '소' 카테고리에는 하위 카테고리가 없음
                  <option value="true">하위 카테고리 있음</option>
                )}
              </select>
            </label>
          </div>
          <div className={styles.modalActions}>
            <button onClick={handleSaveClick}>저장</button>
            <button onClick={onCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryAddModal;
