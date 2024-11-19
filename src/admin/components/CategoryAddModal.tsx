import React, { useState } from 'react';
import '../styles/category.css';
import '../styles/categoryModal.css';

interface CategoryAddModalProps {
  categoryType: 'large' | 'middle' | 'small';
  onSave: (
    newCategory: string,
    categoryType: 'large' | 'middle' | 'small'
  ) => void;
  onCancel: () => void;
}

function CategoryAddModal({
  categoryType,
  onSave,
  onCancel,
}: CategoryAddModalProps) {
  const [categoryName, setCategoryName] = useState<string>('');
  const [hasSubcategory, setHasSubcategory] = useState('false');

  const categoryTypeLabel =
    categoryType === 'large' ? '대' : categoryType === 'middle' ? '중' : '소';

  const handleSaveClick = () => {
    if (categoryName.trim() !== '') {
      onSave(categoryName, categoryType);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h3>카테고리 추가하기</h3>
        <div className="modal-content">
          <p>부모 카테고리 : {}</p>
          <p>카테고리 분류 : {categoryTypeLabel}</p>
          <div className="label-div">
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
          <div className="modal-actions">
            <button onClick={handleSaveClick}>저장</button>
            <button onClick={onCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryAddModal;
