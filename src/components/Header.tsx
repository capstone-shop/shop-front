import React, { useEffect, useRef, useState } from 'react';
import '../styles/css/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/css/Header.module.css';
import { getCurrentUser, getProductHome } from '../api/Utils';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getCurrentUser();
        console.log('유저 데이터:', response);
        setUser(response);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류 발생:', err);
      }
    };

    fetchProducts();
  }, []);

  // 카테고리 목록 데이터 예시
  const categories = [
    {
      name: '채소',
      subcategories: [
        '친환경',
        '고구마·감자·당근',
        '시금치·쌈채소·나물',
        '브로콜리·피프리카·양배추',
        '양파·대파·마늘·배추',
      ],
    },
    {
      name: '과일·견과·쌀',
      subcategories: [
        '제철과일',
        '국산과일',
        '수입과일',
        '간편과일',
        '냉동·건과일',
      ],
    },
    {
      name: '수산·해산·건어물',
      subcategories: ['생선류', '조개류', '오징어·낙지·문어', '건어물·해조류'],
    },
    {
      name: '정육·가공육·계란',
      subcategories: ['소고기', '돼지고기', '닭고기', '계란류', '양고기'],
    },
    {
      name: '국·반찬·메인요리',
      subcategories: [
        '국/탕/찌개',
        '밑반찬',
        '김치/젓갈/장류',
        '두부/어묵/부침개',
        '메인요리',
      ],
    },
    {
      name: '간편식·밀키트·샐러드',
      subcategories: ['간편식', '밀키트', '샐러드', '도시락', '즉석밥/죽'],
    },
    {
      name: '면·양념·오일',
      subcategories: ['면류', '파스타', '양념', '소스/드레싱', '식용유/오일'],
    },
    {
      name: '생수·음료',
      subcategories: ['생수/탄산수', '주스', '탄산음료', '커피', '차류'],
    },
    {
      name: '베이커리·간식',
      subcategories: ['빵류', '케이크', '과자/스낵', '초콜릿', '떡/한과'],
    },
    {
      name: '유제품·아이스크림',
      subcategories: ['우유', '치즈', '버터/마가린', '요거트', '아이스크림'],
    },
  ];

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
                          to="/favorites"
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
                          to="/products"
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
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                width: '400px',
                zIndex: 1,
              }}
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)} // 드롭다운 전체 영역에서 마우스가 벗어날 때 닫힘
            >
              {/* 왼쪽 카테고리 목록 */}
              <div
                style={{
                  width: '50%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  borderRight: '1px solid #ccc',
                }}
              >
                {categories.map((category, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      color:
                        selectedCategory === category.name ? '#5c2ea6' : '#333',
                      backgroundColor:
                        selectedCategory === category.name
                          ? '#f5f5f5'
                          : 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>

              {/* 오른쪽 하위 카테고리 목록 */}
              <div
                style={{
                  width: '50%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '8px 16px',
                }}
              >
                {selectedCategory &&
                  categories
                    .find((category) => category.name === selectedCategory)
                    ?.subcategories.map((subcategory, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '4px 0',
                          fontSize: '14px',
                          color: '#333',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget as HTMLDivElement;
                          target.style.backgroundColor = '#f0f0f0';
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget as HTMLDivElement;
                          target.style.backgroundColor = 'transparent';
                        }}
                      >
                        {subcategory}
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
