import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/css/Header.css';
function Header() {
  return (
    <div className={'div0'}>
      <div className={'div1'}>
        <div className={'div1-1'}>
          <img src={''} alt={'회사 로고'} />
          <span>회사이름</span>
        </div>
        <div className={'div1-2'}>
          <input
            className={'search-header-input'}
            type="text"
            placeholder={'검색어를 입력해주세요'}
          />
          <button className={'search-header-btn'}>
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
        <div className={'div1-3'}>
          <a href={''}>회원가입</a>
          <a href={'signIn'}>로그인</a>
        </div>
      </div>
      <div className={'div2'}>
        <div>
          <span>카테고리</span>
        </div>
        <div>
          <li>
            <span>
              <a href={''}>목록 1</a>
            </span>
          </li>
          <li>
            <span>
              <a href={''}>목록 2</a>
            </span>
          </li>
          <li>
            <span>
              <a href={''}>목록 3</a>
            </span>
          </li>
          <li>
            <span>
              <a href={''}>목록 4</a>
            </span>
          </li>
        </div>
      </div>
    </div>
  );
}

export default Header;
