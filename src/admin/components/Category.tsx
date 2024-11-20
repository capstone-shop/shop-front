import React, { useState, useRef, useEffect } from 'react';
import { CategoryEditModal } from './CategoryEditModal';
import { CategoryDeleteModal } from './CategoryDeleteModal';
import CategoryAddModal from '../components/CategoryAddModal';
// import { getAdminCategory } from '../../api/Utils';

import styles from '../styles/category.module.css';

type CategoryType = 'large' | 'middle' | 'small';

type Category = {
  large: string[];
  middle: string[];
  small: string[];
};

function Category() {
  const [cate, setCate] = useState([]); // 데이터를 저장할 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // useEffect(() => {
  // // API 호출 함수
  // const fetchCategories = async () => {
  //   try {
  //     const data = await getAdminCategory(); // API 호출
  //     setCate(data); // 상태 업데이트
  //     console.log('카테고리 데이터:', data); // 콘솔 출력
  //   } catch (error) {
  //     // instanceof를 사용하여 Error 객체인지 확인
  //     if (error instanceof Error) {
  //       console.error(
  //         '카테고리 정보를 불러오는 중 오류가 발생했습니다:',
  //         error.message
  //       );
  //     } else {
  //       console.error(
  //         '카테고리 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.',
  //         error
  //       );
  //     }
  //   }
  //   };
  //
  //   fetchCategories(); // 함수 호출
  // }, []); // 빈 배열로 의존성 설정 → 컴포넌트 마운트 시 한 번 실행

  const dragItem = useRef<number | null>(null); // 드래그할 아이템의 인덱스
  const dragOverItem = useRef<number | null>(null); // 드랍할 위치의 아이템의 인덱스

  const [categories, setCategories] = useState<Category>({
    large: ['휴대폰', '노트북', '모니터', '주변기기', '기타'],
    middle: ['AOS', 'iOS', '기타'],
    small: ['Galaxy Note 10+', 'iPhone 12', 'Macbook Pro', '기타'],
  });

  // 카테고리 선택 유무
  const [selectedLargeCategory, setSelectedLargeCategory] = useState<
    string | null
  >(null);
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState<
    string | null
  >(null);
  // 수정, 삭제 states
  const [editCategory, setEditCategory] = useState<{
    name: string;
    type: CategoryType;
  } | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<{
    name: string;
    type: CategoryType;
  } | null>(null);
  // 추가 모달 상태
  const [addCategory, setAddCategory] = useState<{
    type: CategoryType;
  } | null>(null);

  // 드래그 시작될 때 실행
  const dragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragItem.current = position;
    console.log(e.currentTarget.innerHTML); // 드래그 시작된 아이템 출력
  };

  // 드래그중인 대상이 위로 포개졌을 때
  const dragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragOverItem.current = position;
    console.log(e.currentTarget.innerHTML); // 드래그 대상 아이템 출력
  };

  // 드랍 (커서 뗐을 때)
  const drop = (
    e: React.DragEvent<HTMLLIElement>,
    categoryType: CategoryType
  ) => {
    e.preventDefault(); // 드롭 이벤트의 기본 동작을 막음
    const updatedCategories = { ...categories }; // 카테고리 리스트 가져옴
    // 드래그, 오버한 아이템을 가져옴
    if (dragItem.current === null || dragOverItem.current === null) return;
    const dragItemValue = updatedCategories[categoryType][dragItem.current];
    const dragOverItemValue =
      updatedCategories[categoryType][dragOverItem.current];
    // 리스트 내에서 두 아이템을 교환
    updatedCategories[categoryType].splice(
      dragItem.current,
      1,
      dragOverItemValue
    );
    updatedCategories[categoryType].splice(
      dragOverItem.current,
      1,
      dragItemValue
    );
    // 상태를 업데이트하여 화면에 반영
    setCategories(updatedCategories);
    // 드래그와 드랍 아이템 참조를 초기화
    dragItem.current = null;
    dragOverItem.current = null;
    console.log(categories);
  };

  // 카테고리 선택 이벤트
  const handleCategoryClick = (
    e: React.MouseEvent,
    categoryName: string,
    categoryType: CategoryType
  ) => {
    e.stopPropagation();
    // 카테고리 유형에 따라 상태를 다르게 업데이트
    if (categoryType === 'large') {
      setSelectedLargeCategory(categoryName);
      setSelectedMiddleCategory(null); // 중 카테고리 초기화
    } else if (categoryType === 'middle') {
      setSelectedMiddleCategory(categoryName);
    }
  };

  // 수정 클릭 이벤트
  const handleEditClick = (
    e: React.MouseEvent,
    categoryName: string,
    categoryType: CategoryType
  ) => {
    e.stopPropagation();
    setEditCategory({ name: categoryName, type: categoryType });
  };

  // 삭제 클릭 이벤트
  const handleDeleteClick = (
    e: React.MouseEvent,
    categoryName: string,
    categoryType: CategoryType
  ) => {
    e.stopPropagation();
    setDeleteCategory({ name: categoryName, type: categoryType }); // 삭제할 카테고리 설정
  };

  // 추가 클릭 이벤트
  const handleAddClick = (categoryType: CategoryType) => {
    setAddCategory({ type: categoryType }); // 카테고리 추가 상태 설정
    console.log('추가 상태 설정됨.');
  };

  // 수정 내용 저장
  const handleSave = (updatedCategory: string, categoryType: CategoryType) => {
    // Save logic for updating category
    setCategories((prevCategories) => {
      const updatedCategories = { ...prevCategories };
      if (categoryType === 'large') {
        updatedCategories.large = updatedCategories.large.map((cat) =>
          cat === editCategory?.name ? updatedCategory : cat
        );
      } else if (categoryType === 'middle') {
        updatedCategories.middle = updatedCategories.middle.map((cat) =>
          cat === editCategory?.name ? updatedCategory : cat
        );
      } else if (categoryType === 'small') {
        updatedCategories.small = updatedCategories.small.map((cat) =>
          cat === editCategory?.name ? updatedCategory : cat
        );
      }
      return updatedCategories;
    });
    setEditCategory(null);
  };

  // 추가
  const handleAdd = (newCategory: string, categoryType: CategoryType) => {
    setCategories((prevCategories) => {
      const updatedCategories = { ...prevCategories };
      updatedCategories[categoryType].push(newCategory);
      return updatedCategories;
    });
    setAddCategory(null); // 카테고리 추가 후 모달 닫기
  };

  // 삭제
  const handleDelete = () => {
    if (deleteCategory) {
      setCategories((prevCategories) => {
        const updatedCategories = { ...prevCategories };
        if (deleteCategory.type === 'large') {
          updatedCategories.large = updatedCategories.large.filter(
            (cat) => cat !== deleteCategory.name
          );
        } else if (deleteCategory.type === 'middle') {
          updatedCategories.middle = updatedCategories.middle.filter(
            (cat) => cat !== deleteCategory.name
          );
        } else if (deleteCategory.type === 'small') {
          updatedCategories.small = updatedCategories.small.filter(
            (cat) => cat !== deleteCategory.name
          );
        }
        return updatedCategories;
      });
      setDeleteCategory(null);
    }
  };

  // 저장 안 하고 창 닫기
  const handleCancel = () => {
    setEditCategory(null);
    setDeleteCategory(null);
    setAddCategory(null); //false면 모달 닫힘.
  };

  return (
    <div>
      <div className={styles.categoryPanel}>
        {/* 대 카테고리 */}
        <div className={styles.categoryColumn}>
          <div className={styles.title}>
            <p>대 카테고리 </p>
            <button
              className={styles.categoryBtn}
              onClick={() => handleAddClick('large')}
            >
              등록하기
            </button>
          </div>
          <ul>
            {categories.large.map((largeCategory_name: string, i: number) => {
              return (
                <li
                  key={i}
                  className={
                    selectedLargeCategory === largeCategory_name
                      ? styles.selected
                      : ''
                  }
                  onClick={(e) =>
                    handleCategoryClick(e, largeCategory_name, 'large')
                  }
                  draggable
                  onDragStart={(e) => dragStart(e, i)}
                  onDragEnter={(e) => dragEnter(e, i)}
                  onDragEnd={(e) => drop(e, 'large')}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <span>{largeCategory_name}</span>
                  <div className={styles.buttonGroup}>
                    <button
                      onClick={(e) =>
                        handleEditClick(e, largeCategory_name, 'large')
                      }
                    >
                      ✎
                    </button>
                    <button
                      onClick={(e) =>
                        handleDeleteClick(e, largeCategory_name, 'large')
                      }
                    >
                      ✖
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 중 카테고리 (대 카테고리 선택 후 보여짐) */}
        {selectedLargeCategory && categories.middle.length > 0 && (
          <div className={styles.categoryColumn}>
            <div className={styles.title}>
              <p>중 카테고리 </p>
              <button
                className={styles.categoryBtn}
                onClick={() => handleAddClick('middle')}
              >
                등록하기
              </button>
            </div>
            <ul>
              {categories.middle.map(
                (middleCategory_name: string, i: number) => {
                  return (
                    <li
                      key={i}
                      className={
                        selectedMiddleCategory === middleCategory_name
                          ? styles.selected
                          : ''
                      }
                      onClick={(e) =>
                        handleCategoryClick(e, middleCategory_name, 'middle')
                      }
                      draggable
                      onDragStart={(e) => dragStart(e, i)}
                      onDragEnter={(e) => dragEnter(e, i)}
                      onDragEnd={(e) => drop(e, 'middle')}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <span>{middleCategory_name}</span>
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={(e) =>
                            handleEditClick(e, middleCategory_name, 'middle')
                          }
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) =>
                            handleDeleteClick(e, middleCategory_name, 'middle')
                          }
                        >
                          ✖
                        </button>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        )}

        {/* 소 카테고리 (중 카테고리 선택 후 보여짐) */}
        {selectedMiddleCategory && categories.small.length > 0 && (
          <div className={styles.categoryColumn}>
            <div className={styles.title}>
              <p>소 카테고리 </p>
              <button
                className={styles.categoryBtn}
                onClick={() => handleAddClick('small')}
              >
                등록하기
              </button>
            </div>
            <ul>
              {categories.small.map((smallCategory_name: string, i: number) => {
                return (
                  <li
                    key={i}
                    onClick={(e) =>
                      handleCategoryClick(e, smallCategory_name, 'small')
                    }
                    draggable
                    onDragStart={(e) => dragStart(e, i)}
                    onDragEnter={(e) => dragEnter(e, i)}
                    onDragEnd={(e) => drop(e, 'small')}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <span>{smallCategory_name}</span>
                    <div className={styles.buttonGroup}>
                      <button
                        onClick={(e) =>
                          handleEditClick(e, smallCategory_name, 'small')
                        }
                      >
                        ✎
                      </button>
                      <button
                        onClick={(e) =>
                          handleDeleteClick(e, smallCategory_name, 'small')
                        }
                      >
                        ✖
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* 추가 모달 */}
      {addCategory && (
        <CategoryAddModal
          categoryType={addCategory.type}
          onSave={handleAdd} // 카테고리 저장 함수
          onCancel={handleCancel} // 취소 시 모달 닫는 함수
        />
      )}

      {/* 수정 모달 */}
      {editCategory && (
        <CategoryEditModal
          category={editCategory.name}
          categoryType={editCategory.type}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* 삭제 모달 */}
      {deleteCategory && (
        <CategoryDeleteModal
          category={deleteCategory.name}
          categoryType={deleteCategory.type}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default Category;
