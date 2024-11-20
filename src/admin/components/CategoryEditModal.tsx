import React, { useEffect, useState } from 'react';
import styles from '../styles/categoryModal.module.css';

interface CategoryEditModalProps {
  category: string;
  categoryType: 'large' | 'middle' | 'small';
  onSave: (
    updatedCategory: string,
    categoryType: 'large' | 'middle' | 'small'
  ) => void;
  onCancel: () => void;
}

export const CategoryEditModal = ({
  category,
  categoryType,
  onSave,
  onCancel,
}: CategoryEditModalProps) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [hasSubcategory, setHasSubcategory] = useState('false');

  const categoryTypeLabel =
    categoryType === 'large' ? '대' : categoryType === 'middle' ? '중' : '소';

  useEffect(() => {
    setCategoryName(category);
  }, [category]);

  const handleSaveClick = () => {
    onSave(categoryName, categoryType);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <h3>카테고리 수정하기</h3>
        <div className={styles.modalContent}>
          <p>부모 카테고리 : {}</p>
          <p>카테고리 분류 : {categoryTypeLabel}</p>
          <p>등록자 : 운영자</p>
          <p>등록한 시간 : 2024-10-18T09:05:46</p>
          <p>수정한 시간 : 2024-10-18T09:05:46</p>
          <div className={styles.labelDiv}>
            <label>
              <span>카테고리 이름 :</span>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="카테고리 이름"
              />
            </label>
            <label>
              <span>하위카테고리 :</span>
              <select
                value={hasSubcategory}
                onChange={(e) => setHasSubcategory(e.target.value)}
              >
                <option value="false">하위 카테고리 없음</option>
                {categoryType !== 'small' && (
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
};
