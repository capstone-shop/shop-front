import React from 'react';
import '../styles/css/Footer.css';

function Footer() {
  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="footer-container2">
          <div className="company-info">
            <div className="company-list">
              <ul>
                <li>회사로고</li>
                <li>개인정보처리방침</li>
                <li>이용약관</li>
                <li>고용정보</li>
              </ul>
            </div>
            <span>
              (주)회사명 | 대표자: 이상민 | 사업자번호: 000-00-00000 사업자 정보
              확인
            </span>
            <br />
            <span>
              통신판매업: 2024-성남분당B-0000 | 개인정보보호책임자: 이상민 |
              이메일: github.com/geniusBrainLsm
            </span>
            <br />
            <span>
              전화번호: 010-1234-5678 | 주소: 경기도 성남시 분당구 대왕판교로
              660 유스페이스 1A동 405호
            </span>
            <br />
            <br />
            <span>&copy; 2024 우리 회사. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
