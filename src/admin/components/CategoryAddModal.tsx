import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/categoryModal.module.css';
import { getCurrentUser } from '../../api/Utils';
import { postAdminCategory } from '../../api/Utils';
import { User } from './AdminHeader'; // CSS 모듈 import

interface CategoryAddModalProps {
  parentsId: number | null;
  parentsTitle: string | null;
  categoryCounts: number;
  categoryType: 'large' | 'middle' | 'small'; // 카테고리 타입 (대/중/소)
  onSave: (
    // 저장 함수
    newCategory: string,
    categoryType: 'large' | 'middle' | 'small'
  ) => void;
  onCancel: () => void; // 취소 함수
}

function CategoryAddModal({
  parentsId,
  parentsTitle,
  categoryType,
  categoryCounts,
  onSave,
  onCancel,
}: CategoryAddModalProps) {
  const [categoryName, setCategoryName] = useState<string>(''); // 카테고리 이름 상태
  const [hasSubcategory, setHasSubcategory] = useState<boolean>(true); // 하위 카테고리 여부 상태
  const [user, setUser] = useState<User | undefined>(undefined); // 로그인 사용자 이름 상태

  // 카테고리 타입에 따른 텍스트 라벨
  const categoryTypeLabel =
    categoryType === 'large' ? '대' : categoryType === 'middle' ? '중' : '소';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        console.log('유저 데이터:', response);
        setUser(response);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류 발생:', err);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchUser();
  }, []);

  // 저장 버튼 클릭 시 처리
  const handleSaveClick = async () => {
    if (categoryName.trim() !== '') {
      const newCategoryData = {
        title: categoryName,
        parentId: parentsId || 0, // 부모 카테고리 ID (없으면 0으로 처리)
        sequence: categoryCounts + 1,
        leaf: hasSubcategory, // 하위 카테고리 여부
      };
      console.log('전송할 카테고리 데이터:', newCategoryData);
      try {
        // API 호출
        const response = await postAdminCategory(newCategoryData);
        if (response.success) {
          alert('카테고리가 성공적으로 추가되었습니다.');
          onSave(categoryName, categoryType); // 저장 후 부모 컴포넌트에 알림
        } else {
          alert(`카테고리 추가 실패: ${response.message}`);
        }
      } catch (error) {
        alert('카테고리 추가 요청 중 오류가 발생했습니다.');
      }
    }
  };

  return ReactDOM.createPortal(
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
                value={hasSubcategory ? 'true' : 'false'} // 상태를 문자열로 변환하여 렌더링
                onChange={(e) => {
                  const newValue = e.target.value === 'true';
                  setHasSubcategory(newValue);
                  console.log(newValue);
                }} // 선택 값에 따라 boolean 값으로 변환
              >
                <option value="true">하위 카테고리 없음</option>
                {categoryType !== 'small' && (
                  <option value="false">하위 카테고리 있음</option>
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
    </div>,
    document.body
  );
}

export default CategoryAddModal;
