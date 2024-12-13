import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/css/SearchFilter.module.css';
import { CategoryResponse, getCategory, getSubCategory } from '../api/Utils';

const categories = [
  {
    name: '카테고리 선택',
    options: [],
  },
  {
    name: '찜 횟수 기준',
    options: [
      { label: '100 이상', value: 100 },
      { label: '50 이상', value: 50 },
      { label: '10 이상', value: 10 },
    ],
  },
  {
    name: '등록자 평점 기준',
    options: [
      { label: '100 이상', value: 100 },
      { label: '50 이상', value: 50 },
      { label: '10 이상', value: 10 },
    ],
  },
  {
    name: '거래 방식',
    options: [
      { label: '직거래 가능', value: 0 },
      { label: '택배거래 가능', value: 1 },
    ],
  },
  {
    name: '상품 상태',
    options: [
      { label: '새 상품(미사용)', value: 0 },
      { label: '사용감 적음', value: 1 },
      { label: '사용감 중간', value: 2 },
      { label: '사용감 많음', value: 3 },
      { label: '고장/파손 상품', value: 4 },
    ],
  },
];

function SearchFilter() {
  const [activeTab, setActiveTab] = useState<string>('카테고리 선택');
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: (string | number)[];
  }>({});
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    []
  );
  const [selectedSmallCategories, setSelectedSmallCategories] = useState<
    number[]
  >([]);
  const [category, setCategory] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]);
  const [smallCategories, setSmallCategories] = useState<CategoryResponse[]>(
    []
  );
  const navigate = useNavigate();

  // 필터 변경 시 URL 업데이트
  useEffect(() => {
    const generateFilterString = () => {
      const mappings: { [key: string]: string } = {
        '대 카테고리': 'cate',
        '중 카테고리': 'cate',
        '소 카테고리': 'cate',
        '찜 횟수 기준': 'wish',
        '등록자 평점 기준': 'repu',
        '거래 방식': 'tran',
        '상품 상태': 'stat',
      };

      // 병합된 카테고리 값 생성
      const categoryValues = [
        ...(selectedFilters['대 카테고리'] || []),
        ...(selectedFilters['중 카테고리'] || []),
        ...(selectedFilters['소 카테고리'] || []),
      ];

      // 필터 문자열 생성
      return Object.entries(selectedFilters)
        .filter(
          ([key]) =>
            key !== '대 카테고리' &&
            key !== '중 카테고리' &&
            key !== '소 카테고리'
        ) // 카테고리 제외
        .map(([key, values]) => {
          const filterKey = mappings[key];
          if (!filterKey) return '';
          const filterValues = values.join(',');
          return `${filterKey},${filterValues}`;
        })
        .filter(Boolean)
        .concat(categoryValues.length ? `cate,${categoryValues.join(',')}` : []) // 병합된 카테고리 추가
        .join(';');
    };

    const filterString = generateFilterString();
    navigate(`/productSearch?filter=${encodeURIComponent(filterString)}`);
  }, [selectedFilters]);

  const toggleFilter = (category: string, option: string | number) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      return {
        ...prev,
        [category]: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const resetFilters = () => {
    setSelectedFilters({});
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedSmallCategories([]);
    setSubCategories([]);
    setSmallCategories([]);
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
      setSmallCategories([]); // 중카테고리 선택 시 소카테고리 초기화
      setSelectedSmallCategories([]); // 소카테고리 선택 초기화
    } catch (err) {
      console.error('중 카테고리 조회 중 오류 발생:', err);
    }
  };

  const fetchSmallCategories = async (subCategoryId: number) => {
    try {
      const response = await getSubCategory({ id: subCategoryId });
      setSmallCategories(Array.isArray(response) ? response : [response]);
    } catch (err) {
      console.error('소 카테고리 조회 중 오류 발생:', err);
    }
  };

  useEffect(() => {
    if (activeTab === '카테고리 선택') {
      fetchCategory();
    }
  }, [activeTab]);

  const handleCategorySelect = (categoryId: number) => {
    const selected = category.find((c) => c.id === categoryId);
    if (selected) {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );

      setSelectedFilters((prev) => ({
        ...prev,
        '대 카테고리': selectedCategories.includes(categoryId)
          ? selectedCategories.filter((id) => id !== categoryId)
          : [...selectedCategories, categoryId],
      }));

      fetchSubCategories(categoryId);
    }
  };

  const handleSubCategorySelect = (subCategoryId: number) => {
    const selected = subCategories.find((c) => c.id === subCategoryId);
    if (selected) {
      setSelectedSubCategories((prev) =>
        prev.includes(subCategoryId)
          ? prev.filter((id) => id !== subCategoryId)
          : [...prev, subCategoryId]
      );

      // 업데이트된 필터에 반영
      setSelectedFilters((prev) => ({
        ...prev,
        '중 카테고리': prev['중 카테고리']
          ? prev['중 카테고리'].includes(subCategoryId)
            ? prev['중 카테고리'].filter((id) => id !== subCategoryId)
            : [...prev['중 카테고리'], subCategoryId]
          : [subCategoryId],
      }));

      fetchSmallCategories(subCategoryId);
    }
  };

  const handleSmallCategorySelect = (smallCategoryId: number) => {
    const selected = smallCategories.find((c) => c.id === smallCategoryId);
    if (selected) {
      setSelectedSmallCategories((prev) =>
        prev.includes(smallCategoryId)
          ? prev.filter((id) => id !== smallCategoryId)
          : [...prev, smallCategoryId]
      );

      // `selectedFilters` 업데이트
      setSelectedFilters((prev) => ({
        ...prev,
        '소 카테고리': prev['소 카테고리']
          ? prev['소 카테고리'].includes(smallCategoryId)
            ? prev['소 카테고리'].filter((id) => id !== smallCategoryId)
            : [...prev['소 카테고리'], smallCategoryId]
          : [smallCategoryId],
      }));
    }
  };

  const renderCategoryItems = (
    items: CategoryResponse[],
    selectedItems: number[],
    onSelect: (id: number) => void
  ) => (
    <div className={styles.categoryColumn}>
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
            className={`${styles.categoryItem} ${
              selectedItems.includes(item.id) ? styles.categoryItemSelected : ''
            }`}
            onClick={() => onSelect(item.id)}
          >
            {item.title}
          </div>
        ))
      ) : (
        <div className={styles.noItems}>하위 카테고리가 없습니다.</div>
      )}
    </div>
  );

  const renderOptionItems = (
    items: { label: string; value: number | string }[]
  ) => (
    <div className={styles.categoryColumn}>
      {items.map((item) => (
        <div
          key={item.value}
          className={`${styles.categoryItem} ${
            (selectedFilters[activeTab] || []).includes(item.value)
              ? styles.categoryItemSelected
              : ''
          }`}
          onClick={() => toggleFilter(activeTab, item.value)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
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

      {activeTab === '카테고리 선택' ? (
        <div className={styles.categoryContainer}>
          {renderCategoryItems(
            category,
            selectedCategories,
            handleCategorySelect
          )}
          {renderCategoryItems(
            subCategories,
            selectedSubCategories,
            handleSubCategorySelect
          )}
          {renderCategoryItems(
            smallCategories,
            selectedSmallCategories,
            handleSmallCategorySelect // 수정된 부분
          )}
        </div>
      ) : (
        renderOptionItems(
          categories.find((cat) => cat.name === activeTab)?.options || []
        )
      )}

      <div className={styles.selectedFilters}>
        <div className={styles.selectedFilters}>
          <div className={styles.selectedFiltersHeader}>
            <span>선택한 필터</span>
            <button className={styles.resetButton} onClick={resetFilters}>
              초기화
            </button>
          </div>
          <div className={styles.selectedFiltersList}>
            {Object.entries(selectedFilters).map(([categoryKey, values]) => (
              <div key={categoryKey} className={styles.filterItem}>
                <strong>{categoryKey}: </strong>
                {values
                  .map((value) => {
                    if (categoryKey === '대 카테고리') {
                      const found = category.find((cat) => cat.id === value);
                      return found ? found.title : value;
                    }
                    if (categoryKey === '중 카테고리') {
                      const found = subCategories.find(
                        (cat) => cat.id === value
                      );
                      return found ? found.title : value;
                    }
                    if (categoryKey === '소 카테고리') {
                      const found = smallCategories.find(
                        (cat) => cat.id === value
                      );
                      return found ? found.title : value;
                    }
                    const option = categories
                      .find((cat) => cat.name === categoryKey)
                      ?.options?.find((opt) => opt.value === value);
                    return option?.label || value; // label이 없으면 value 출력
                  })
                  .join(', ')}
                <button
                  className={styles.removeButton}
                  onClick={() =>
                    setSelectedFilters((prev) => {
                      const updated = { ...prev };
                      delete updated[categoryKey];
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
    </div>
  );
}

export default SearchFilter;
