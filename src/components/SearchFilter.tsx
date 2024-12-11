import React, { useEffect, useState } from 'react';
import styles from '../styles/css/SearchFilter.module.css';
import { CategoryResponse, getCategory, getSubCategory } from '../api/Utils';

const categories = [
  {
    name: '카테고리 선택',
    options: [],
  },
  {
    name: '찜 횟수 기준',
    options: ['100 이상', '50 이상', '10 이상'],
  },
  {
    name: '등록자 평점 기준',
    options: ['100 이상', '50 이상', '10 이상'],
  },
  {
    name: '거래 방식',
    options: ['직거래 가능', '택배거래 가능'],
  },
  {
    name: '상품 상태',
    options: [
      '새 상품(미사용)',
      '사용감 적음',
      '사용감 중간',
      '사용감 많음',
      '고장/파손 상품',
    ],
  },
];

function SearchFilter() {
  const [activeTab, setActiveTab] = useState<string>('카테고리 선택');
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string | string[];
  }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );
  const [selectedSmallCategory, setSelectedSmallCategory] = useState<
    number | null
  >(null);
  const [category, setCategory] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]);
  const [smallCategories, setSmallCategories] = useState<CategoryResponse[]>(
    []
  );

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category];
      if (Array.isArray(current)) {
        // 다중 선택
        return {
          ...prev,
          [category]: current.includes(option)
            ? current.filter((item) => item !== option)
            : [...current, option],
        };
      }
      // 단일 선택
      return { ...prev, [category]: option };
    });
  };

  const resetFilters = () => {
    setSelectedFilters({});
    setSelectedCategory(null);
    setSubCategories([]);
    setSelectedSubCategory(null);
    setSmallCategories([]);
    setSelectedSmallCategory(null);
  };

  const fetchCategory = async () => {
    try {
      const response = await getCategory();
      setCategory(Array.isArray(response) ? response : [response]);
    } catch (err) {
      console.error('대 카테고리 조회 중 오류 발생:', err);
    }
  };

  const fetchSubCategories = async (categoryId: number) => {
    try {
      const response = await getSubCategory({ id: categoryId });
      setSubCategories(Array.isArray(response) ? response : [response]);
      setSmallCategories([]);
      setSelectedSubCategory(null);
      setSelectedSmallCategory(null);
    } catch (err) {
      console.error('중 카테고리 조회 중 오류 발생:', err);
    }
  };

  const fetchSmallCategories = async (subCategoryId: number) => {
    try {
      const response = await getSubCategory({ id: subCategoryId });
      setSmallCategories(Array.isArray(response) ? response : [response]);
      setSelectedSmallCategory(null);
    } catch (err) {
      console.error('소 카테고리 조회 중 오류 발생:', err);
    }
  };

  useEffect(() => {
    if (activeTab === '카테고리 선택') {
      fetchCategory();
    }
  }, [activeTab]);

  // 카테고리 선택 렌더링
  const renderCategoryItems = (
    items: string[],
    selectedItem: string | null,
    onSelect: (item: string) => void
  ) => (
    <div className={styles.categoryColumn}>
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item}
            className={`${styles.categoryItem} ${
              selectedItem === item ? styles.categoryItemSelected : ''
            }`}
            onClick={() => onSelect(item)}
          >
            {item}
          </div>
        ))
      ) : (
        <div className={styles.noItems}>하위 카테고리가 없습니다.</div>
      )}
    </div>
  );

  // 옵션 탭 렌더링
  const renderOptionItems = (items: string[]) => (
    <div className={styles.categoryColumn}>
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item}
            className={`${styles.categoryItem} ${
              (selectedFilters[activeTab] || []).includes(item)
                ? styles.categoryItemSelected
                : ''
            }`}
            onClick={() => toggleFilter(activeTab, item)}
          >
            {item}
          </div>
        ))
      ) : (
        <div className={styles.noItems}>항목이 없습니다.</div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 카테고리 탭 */}
      <div className={styles.tabs}>
        {categories.map((category) => (
          <div
            key={category.name}
            className={`${styles.tab} ${
              activeTab === category.name ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>

      {/* 카테고리 선택 또는 옵션 테이블 */}
      {activeTab === '카테고리 선택' ? (
        <div className={styles.categoryContainer}>
          {renderCategoryItems(
            category.map((c) => c.title),
            selectedCategory
              ? category.find((c) => c.id === selectedCategory)?.title || null
              : null,
            (title) => {
              const selected = category.find((c) => c.title === title);
              if (selected) {
                setSelectedCategory(selected.id);
                setSelectedSubCategory(null);
                setSelectedSmallCategory(null);
                fetchSubCategories(selected.id);

                // Update selectedFilters with selected category
                setSelectedFilters((prev) => ({
                  ...prev,
                  '대 카테고리': selected.title,
                }));
              }
            }
          )}

          {renderCategoryItems(
            subCategories.map((c) => c.title),
            selectedSubCategory
              ? subCategories.find((c) => c.id === selectedSubCategory)
                  ?.title || null
              : null,
            (title) => {
              const selected = subCategories.find((c) => c.title === title);
              if (selected) {
                setSelectedSubCategory(selected.id);
                setSelectedSmallCategory(null);
                fetchSmallCategories(selected.id);

                // Update selectedFilters with selected subcategory
                setSelectedFilters((prev) => ({
                  ...prev,
                  '중 카테고리': selected.title,
                }));
              }
            }
          )}

          {renderCategoryItems(
            smallCategories.map((c) => c.title),
            selectedSmallCategory
              ? smallCategories.find((c) => c.id === selectedSmallCategory)
                  ?.title || null
              : null,
            (title) => {
              const selected = smallCategories.find((c) => c.title === title);
              if (selected) {
                setSelectedSmallCategory(selected.id);

                // Update selectedFilters with selected small category
                setSelectedFilters((prev) => ({
                  ...prev,
                  '소 카테고리': selected.title,
                }));
              }
            }
          )}
        </div>
      ) : (
        renderOptionItems(
          categories.find((cat) => cat.name === activeTab)?.options || []
        )
      )}

      {/* 선택한 필터 */}
      <div className={styles.selectedFilters}>
        <div className={styles.selectedFiltersHeader}>
          <span>선택한 필터</span>
          <button className={styles.resetButton} onClick={resetFilters}>
            초기화
          </button>
        </div>
        <div className={styles.selectedFiltersList}>
          {Object.entries(selectedFilters).map(([category, value]) => (
            <div key={category} className={styles.filterItem}>
              <strong>{category}: </strong>
              {Array.isArray(value) ? value.join(', ') : value}{' '}
              <button
                className={styles.removeButton}
                onClick={() =>
                  setSelectedFilters((prev) => {
                    const updated = { ...prev };
                    delete updated[category];
                    return updated;
                  })
                }
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
