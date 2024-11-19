import React, {useEffect, useState} from 'react';

interface CategoryDeleteModalProps {
    category: string;
    categoryType: 'large' | 'middle' | 'small';
    onDelete: () => void;
    onCancel: () => void;
}

export const CategoryDeleteModal = ({ category, categoryType, onDelete, onCancel }: CategoryDeleteModalProps) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const categoryTypeLabel = categoryType === 'large' ? '대' : categoryType === 'middle' ? '중' : '소';

    useEffect(() => {
        setCategoryName(category);
    }, [category]);

    return (
        <div className="modal-container">
            <div className="modal">
                <h3>카테고리 수정하기</h3>
                <div className="modal-content">
                    <p>부모 카테고리 : {}</p>
                    <p>카테고리 분류 : {categoryTypeLabel}</p>
                    <p>카테고리 이름 : {categoryName}</p>
                    <p>등록자 : 운영자</p>
                    <p>등록한 시간 : 2024-10-18T09:05:46</p>
                    <p>수정한 시간 : 2024-10-18T09:05:46</p>
                    <h4>정말로 삭제 하시겠습니까?<br/>하위 카테고리와 해당하는 상품들이 전부 삭제됩니다.</h4>
                    <div className="modal-actions">
                        <button onClick={onDelete}>삭제</button>
                        <button onClick={onCancel}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    );
};