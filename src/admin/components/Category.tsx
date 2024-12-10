import React, { useEffect, useState, useRef } from 'react';
import { getAdminCategory } from '../../api/Utils'; // API 함수 임포트
import styles from '../styles/category.module.css';
import CategoryAddModal from './CategoryAddModal';
// import CategoryEditModal from './CategoryEditModal';
// import CategoryDeleteModal from './CategoryDeleteModal';

type CategoryType = 'large' | 'middle' | 'small';
type CategoryItem = { id: number; title: string; isLeaf: boolean };

function Category() {
  const [categories, setCategories] = useState<{
    large: CategoryItem[];
    middle: CategoryItem[];
    small: CategoryItem[];
  }>({ large: [], middle: [], small: [] });

  const [selectedLargeId, setSelectedLargeId] = useState<number | null>(null);
  const [selectedMiddleId, setSelectedMiddleId] = useState<number | null>(null);

  const [addCategory, setAddCategory] = useState<{
    parentsTitle: string | null;
    type: CategoryType;
  } | null>(null);
  const [editCategory, setEditCategory] = useState<{
    id: number;
    name: string;
    type: CategoryType;
  } | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<{
    id: number;
    name: string;
    type: CategoryType;
  } | null>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // 헬퍼 함수: API 응답 데이터를 매핑
  const mapCategoryData = (
    data: { id: number; title: string; isLeaf: boolean }[]
  ): CategoryItem[] =>
    data.map((item) => ({
      id: item.id,
      title: item.title,
      isLeaf: item.isLeaf,
    }));

  // 대분류 데이터 가져오기
  useEffect(() => {
    const fetchLargeCategories = async () => {
      try {
        const data = await getAdminCategory(); // 대분류 API 호출
        setCategories((prev) => ({
          ...prev,
          large: mapCategoryData(data), // 대 카테고리 업데이트
          middle: [], //대 카테고리 선택 시 중 카테고리 초기화
          small: [], //소 카테고리 초기화
        }));
        console.log(categories);
      } catch (error) {
        console.error('대 카테고리 데이터를 가져오는 중 오류:', error);
      }
    };

    fetchLargeCategories();
  }, []);

  // 중분류 데이터 가져오기
  useEffect(() => {
    if (selectedLargeId === null) return;

    const fetchMiddleCategories = async () => {
      try {
        const data = await getAdminCategory(selectedLargeId); // 중분류 API 호출
        setCategories((prev) => ({
          ...prev,
          middle: mapCategoryData(data), // 중분류 업데이트
          small: [], // 대분류 선택 시 소분류 초기화
        }));
        console.log(categories);
      } catch (error) {
        console.error('중 카테고리 데이터를 가져오는 중 오류:', error);
      }
    };

    fetchMiddleCategories();
  }, [selectedLargeId]);

  // 소분류 데이터 가져오기
  useEffect(() => {
    if (selectedMiddleId === null) return;

    const fetchSmallCategories = async () => {
      try {
        const data = await getAdminCategory(selectedMiddleId); // 소분류 API 호출
        setCategories((prev) => ({
          ...prev,
          small: mapCategoryData(data), // 소분류 업데이트
        }));
        console.log(categories);
      } catch (error) {
        console.error('소 카테고리 데이터를 가져오는 중 오류:', error);
      }
    };

    fetchSmallCategories();
  }, [selectedMiddleId]);

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
    categoryId: number,
    categoryType: CategoryType
  ) => {
    e.stopPropagation();
    // 카테고리 유형에 따라 상태를 다르게 업데이트
    if (categoryType === 'large') {
      setSelectedLargeId(categoryId);
      setSelectedMiddleId(null); // 중 카테고리 초기화
    } else if (categoryType === 'middle') {
      setSelectedMiddleId(categoryId);
    }
  };

  // // 수정 클릭 이벤트
  // const handleEditClick = (
  //   e: React.MouseEvent,
  //   categoryId: number,
  //   categoryType: CategoryType
  // ) => {
  //   e.stopPropagation();
  //   setEditCategory({ categoryId: categoryId, type: categoryType });
  // };
  //
  // // 삭제 클릭 이벤트
  // const handleDeleteClick = (
  //   e: React.MouseEvent,
  //   categoryName: string,
  //   categoryType: CategoryType
  // ) => {
  //   e.stopPropagation();
  //   setDeleteCategory({ name: categoryName, type: categoryType }); // 삭제할 카테고리 설정
  // };
  //
  // // 추가 클릭 이벤트
  // const handleAddClick = (categoryType: CategoryType) => {
  //   setAddCategory({ type: categoryType }); // 카테고리 추가 상태 설정
  //   console.log('추가 상태 설정됨.');
  // };
  //
  // // 수정 내용 저장
  // const handleSave = (updatedCategory: string, categoryType: CategoryType) => {
  //   // Save logic for updating category
  //   setCategories((prevCategories) => {
  //     const updatedCategories = { ...prevCategories };
  //     if (categoryType === 'large') {
  //       updatedCategories.large = updatedCategories.large.map((cat) =>
  //         cat === editCategory?.name ? updatedCategory : cat
  //       );
  //     } else if (categoryType === 'middle') {
  //       updatedCategories.middle = updatedCategories.middle.map((cat) =>
  //         cat === editCategory?.name ? updatedCategory : cat
  //       );
  //     } else if (categoryType === 'small') {
  //       updatedCategories.small = updatedCategories.small.map((cat) =>
  //         cat === editCategory?.name ? updatedCategory : cat
  //       );
  //     }
  //     return updatedCategories;
  //   });
  //   setEditCategory(null);
  // };
  //
  // // 추가
  // const handleAdd = (newCategory: string, categoryType: CategoryType) => {
  //   setCategories((prevCategories) => {
  //     const updatedCategories = { ...prevCategories };
  //     updatedCategories[categoryType].push(newCategory);
  //     return updatedCategories;
  //   });
  //   setAddCategory(null); // 카테고리 추가 후 모달 닫기
  // };
  //
  // // 삭제
  // const handleDelete = () => {
  //   if (deleteCategory) {
  //     setCategories((prevCategories) => {
  //       const updatedCategories = { ...prevCategories };
  //       if (deleteCategory.type === 'large') {
  //         updatedCategories.large = updatedCategories.large.filter(
  //           (cat) => cat !== deleteCategory.name
  //         );
  //       } else if (deleteCategory.type === 'middle') {
  //         updatedCategories.middle = updatedCategories.middle.filter(
  //           (cat) => cat !== deleteCategory.name
  //         );
  //       } else if (deleteCategory.type === 'small') {
  //         updatedCategories.small = updatedCategories.small.filter(
  //           (cat) => cat !== deleteCategory.name
  //         );
  //       }
  //       return updatedCategories;
  //     });
  //     setDeleteCategory(null);
  //   }
  // };
  //
  // // 저장 안 하고 창 닫기
  // const handleCancel = () => {
  //   setEditCategory(null);
  //   setDeleteCategory(null);
  //   setAddCategory(null); //false면 모달 닫힘.
  // };

  return (
    <div>
      <div className={styles.categoryPanel}>
        {/* 대 카테고리 */}
        <div className={styles.categoryColumn}>
          <div className={styles.title}>
            <p>대 카테고리 </p>
            <button
              className={styles.categoryBtn}
              onClick={() =>
                setAddCategory({ parentsTitle: null, type: 'large' })
              }
            >
              등록하기
            </button>
          </div>
          <ul>
            {categories.large.map((largeCategory) => (
              <li
                key={largeCategory.id}
                className={
                  selectedLargeId === largeCategory.id ? styles.selected : ''
                }
                onClick={() => setSelectedLargeId(largeCategory.id)}
              >
                <span>{largeCategory.title}</span>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() =>
                      setEditCategory({
                        id: largeCategory.id,
                        name: largeCategory.title,
                        type: 'large',
                      })
                    }
                  >
                    ✎
                  </button>
                  <button
                    onClick={() =>
                      setDeleteCategory({
                        id: largeCategory.id,
                        name: largeCategory.title,
                        type: 'large',
                      })
                    }
                  >
                    ✖
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 중 카테고리 */}
        {selectedLargeId &&
          categories.large.find((cat) => cat.id === selectedLargeId)?.isLeaf ===
            false && (
            <div className={styles.categoryColumn}>
              <div className={styles.title}>
                <p>중 카테고리 </p>
                <button
                  className={styles.categoryBtn}
                  onClick={() => {
                    const selectedCategory = categories.large.find(
                      (cat) => cat.id === selectedLargeId
                    );
                    setAddCategory({
                      parentsTitle: selectedCategory
                        ? selectedCategory.title
                        : null,
                      type: 'middle',
                    });
                  }}
                >
                  등록하기
                </button>
              </div>
              <ul>
                {categories.middle.map((middleCategory) => (
                  <li
                    key={middleCategory.id}
                    className={
                      selectedMiddleId === middleCategory.id
                        ? styles.selected
                        : ''
                    }
                    onClick={() => setSelectedMiddleId(middleCategory.id)}
                  >
                    <span>{middleCategory.title}</span>
                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() =>
                          setEditCategory({
                            id: middleCategory.id,
                            name: middleCategory.title,
                            type: 'middle',
                          })
                        }
                      >
                        ✎
                      </button>
                      <button
                        onClick={() =>
                          setDeleteCategory({
                            id: middleCategory.id,
                            name: middleCategory.title,
                            type: 'middle',
                          })
                        }
                      >
                        ✖
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* 소 카테고리 */}
        {selectedMiddleId &&
          categories.middle.find((cat) => cat.id === selectedMiddleId)
            ?.isLeaf === false && (
            <div className={styles.categoryColumn}>
              <div className={styles.title}>
                <p>소 카테고리 </p>
                <button
                  className={styles.categoryBtn}
                  onClick={() => {
                    const selectedCategory = categories.middle.find(
                      (cat) => cat.id === selectedMiddleId
                    );
                    setAddCategory({
                      parentsTitle: selectedCategory
                        ? selectedCategory.title
                        : null, // 상위 카테고리 이름 전달
                      type: 'small',
                    });
                  }}
                >
                  등록하기
                </button>
              </div>
              <ul>
                {categories.small.map((smallCategory) => (
                  <li key={smallCategory.id}>
                    <span>{smallCategory.title}</span>
                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() =>
                          setEditCategory({
                            id: smallCategory.id,
                            name: smallCategory.title,
                            type: 'small',
                          })
                        }
                      >
                        ✎
                      </button>
                      <button
                        onClick={() =>
                          setDeleteCategory({
                            id: smallCategory.id,
                            name: smallCategory.title,
                            type: 'small',
                          })
                        }
                      >
                        ✖
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* 추가 모달 컴포넌트 */}
      {addCategory && (
        <CategoryAddModal
          parentsTitle={addCategory.parentsTitle}
          categoryType={addCategory.type}
          onSave={(name) => console.log(`Add: ${name}`)} // 추가 로직
          onCancel={() => setAddCategory(null)}
        />
      )}

      {/*{editCategory && (*/}
      {/*  <CategoryEditModal*/}
      {/*    category={editCategory.name}*/}
      {/*    categoryType={editCategory.type}*/}
      {/*    onSave={(name) => console.log(`Edit: ${name}`)} // 수정 로직*/}
      {/*    onCancel={() => setEditCategory(null)}*/}
      {/*  />*/}
      {/*)}*/}

      {/*{deleteCategory && (*/}
      {/*  <CategoryDeleteModal*/}
      {/*    category={deleteCategory.name}*/}
      {/*    categoryType={deleteCategory.type}*/}
      {/*    onDelete={() => console.log('Delete')} // 삭제 로직*/}
      {/*    onCancel={() => setDeleteCategory(null)}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
}

export default Category;
