import React, { useEffect, useRef, useState } from 'react';
import '../styles/css/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/css/Header.module.css';
import {
  CategoryResponse,
  getCategory,
  getCurrentUser,
  getProductHome,
  getSubCategory,
} from '../api/Utils';

// `Header` 컴포넌트에 전달되는 props의 타입 정의
interface HeaderProps {
  authenticated: boolean; // 로그인 상태를 나타냄
  onLogout: () => void; // 로그아웃 함수
}

export interface User {
  createdAt: string;
  modifiedAt: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  dealingCount: number;
  reputation: number;
  authProvider: string;
  profileImages: string;
}

function Header({ authenticated, onLogout }: HeaderProps) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // 선택된 대 카테고리 ID
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  ); // 선택된 중 카테고리 ID
  const [category, setCategory] = useState<CategoryResponse[]>([]); // 대 카테고리 목록
  const [subCategories, setSubCategories] = useState<CategoryResponse[]>([]); // 중 카테고리 목록
  const [smallCategories, setSmallCategories] = useState<CategoryResponse[]>(
    []
  ); // 소 카테고리 목록

  const dropdownRef = useRef<HTMLDivElement | null>(null); // 드롭다운을 참조하는 ref
  const navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedQuery = searchQuery.trim();

      // 공백 입력 시 기본 검색어나 빈 문자열로 대체
      const finalQuery = trimmedQuery || ''; // 기본 검색어 설정 가능: 예) "defaultSearch"

      // 검색 화면으로 이동
      navigate(`/productSearch?query=${encodeURIComponent(finalQuery)}`);
    }
  };

  // 드롭다운 열기/닫기 토글
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false); // 드롭다운 닫기
    }
  };

  // 사용자 유저 조회
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        console.log('유저 데이터:', response);
        setUser(response); // 유저 데이터를 상태로 설정
      } catch (err) {
        console.error('유저 데이터를 불러오는 중 오류 발생:', err);
      }
    };

    fetchUserData(); // 유저 데이터를 가져오는 함수 호출
  }, []);

  // 대 카테고리 데이터 조회
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategory();
        setCategory(Array.isArray(response) ? response : [response]); // 배열로 설정
      } catch (err) {
        console.error('대 카테고리 조회 중 오류 발생:', err);
      }
    };

    fetchCategory();
  }, []);

  // 중 카테고리 데이터 조회
  const fetchSubCategories = async (categoryId: number) => {
    try {
      const response = await getSubCategory({ id: categoryId });
      setSubCategories(Array.isArray(response) ? response : [response]); // 중 카테고리 설정
      setSmallCategories([]); // 소 카테고리 초기화
      setSelectedSubCategory(null); // 이전 선택 초기화
    } catch (err) {
      console.error('중 카테고리 조회 중 오류 발생:', err);
      setSubCategories([]);
    }
  };

  // 소 카테고리 데이터 조회
  const fetchSmallCategories = async (subCategoryId: number) => {
    try {
      const response = await getSubCategory({ id: subCategoryId });
      setSmallCategories(Array.isArray(response) ? response : [response]); // 소 카테고리 설정
    } catch (err) {
      console.error('소 카테고리 조회 중 오류 발생:', err);
      setSmallCategories([]);
    }
  };

  const handleCategoryHover = (categoryId: number) => {
    setSelectedCategory(categoryId); // 선택된 대 카테고리 업데이트
    fetchSubCategories(categoryId); // 중 카테고리 조회
  };

  const handleSubCategoryHover = (subCategoryId: number) => {
    setSelectedSubCategory(subCategoryId); // 선택된 중 카테고리 업데이트
    fetchSmallCategories(subCategoryId); // 소 카테고리 조회
  };

  // 대, 중, 소카테고리 클릭 검색 조회
  const handleCategoryClick = (categoryId: number) => {
    const filterString = `cate,${categoryId}`;
    navigate(`/productSearch?filter=${filterString}`);
  };
  const handleSubCategoryClick = (subCategoryId: number) => {
    const filterString = `cate,${subCategoryId}`;
    navigate(`/productSearch?filter=${filterString}`);
  };
  const handleSmallCategoryClick = (smallCategoryId: number) => {
    const filterString = `cate,${smallCategoryId}`;
    navigate(`/productSearch?filter=${filterString}`);
  };

  return (
    <div className={styles.HeaderContainer}>
      <div className={styles.HeaderSubContainer}>
        <div className="">
          <Link className={styles.HeaderLink} to="/">
            <span>FASTBUYING</span>
          </Link>
        </div>
        {/* 로그인/회원가입 또는 로그아웃 */}
        <div className={styles.HeaderLinks}>
          <Link className={styles.HeaderLink} to="/productAdd">
            판매하기
          </Link>

          {authenticated ? (
            <>
              {/* 사용자 이름과 드롭다운 */}
              <div className={styles.UserMenu}>
                <span className={styles.HeaderLink} onClick={toggleDropdown}>
                  {user?.name || 'Guest'}
                </span>
                {/* 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div ref={dropdownRef} className={styles.Dropdown}>
                    <div className={styles.Triangle}></div>
                    <ul className={styles.DropdownMenu}>
                      <li>
                        <Link
                          to="/userwishes"
                          className={styles.DropdownItem}
                          onClick={() => setIsDropdownOpen(false)} // 항목 클릭 시 드롭다운 닫기
                        >
                          찜한 상품
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/chat"
                          className={styles.DropdownItem}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          채팅 목록
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/userproducts"
                          className={styles.DropdownItem}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          등록 상품
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profileedit"
                          className={styles.DropdownItem}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          내 정보 수정
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* 로그아웃 버튼 */}
              <span className={styles.HeaderLink} onClick={onLogout}>
                로그아웃
              </span>
            </>
          ) : (
            <>
              <Link className={styles.HeaderLink} to="/signUp">
                회원가입
              </Link>
              <Link className={styles.HeaderLink} to="/signin">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
      <div className={styles.CenterContainer}>
        <div className={styles.HeaderSearch}>
          <input
            className={styles.HeaderSearchInput}
            type="text"
            placeholder="상품을 검색해주세요!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.HeaderSearchBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="white"
            >
              <path d="M10 2a8 8 0 016.32 12.905l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
            </svg>
          </button>
        </div>
      </div>
      {/* 헤더 카테고리 */}
      <div className={styles.HeaderContainer}>
        <div className={styles.HeaderCategory}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              fontWeight: '550',
              position: 'relative',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 24"
              fill="currentColor"
              aria-label="Hamburger menu icon"
              style={{ marginRight: '10px' }}
            >
              <rect y="3" width="18" height="2" rx="1" />
              <rect y="10" width="18" height="2" rx="1" />
              <rect y="17" width="18" height="2" rx="1" />
            </svg>
            <span>카테고리</span>

            {isDropdownVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  display: 'flex',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  width: '600px',
                  zIndex: 1,
                }}
              >
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
                      onMouseEnter={() => handleCategoryHover(item.id)}
                      onClick={() => handleCategoryClick(item.id)} // 대 카테고리 클릭
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
                        onMouseEnter={() => handleSubCategoryHover(subItem.id)}
                        onClick={() => handleSubCategoryClick(subItem.id)} // 중 카테고리 클릭
                      >
                        {subItem.title}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#999' }}>중 카테고리가 없습니다.</div>
                  )}
                </div>
                {/* 소 카테고리 */}
                <div className={styles.smalCategoryColumn}>
                  {smallCategories.length > 0 ? (
                    smallCategories.map((smallItem) => (
                      <div
                        key={smallItem.id}
                        className={`${styles.categoryItem} ${
                          selectedSubCategory === smallItem.id
                            ? styles.categoryItemSelected
                            : ''
                        }`}
                        onMouseEnter={() =>
                          setSelectedSubCategory(smallItem.id)
                        }
                        onClick={() => handleSmallCategoryClick(smallItem.id)} // 소 카테고리 클릭
                      >
                        {smallItem.title}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#999' }}>소 카테고리가 없습니다.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
