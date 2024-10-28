import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/css/SignIn.css';
import { Link } from 'react-router-dom';

function SignIn() {
  return (
    <div className={'form-background'}>
      <form>
        <div>
          <span>로그인</span>
        </div>
        <div>
          <div>
            <input
              className={'form-input'}
              // value={id}
              // onChange={handleIdChange}
              type={'text'}
              placeholder={'아이디를 입력해주세요'}
            />
          </div>
          <div>
            <input
              className={'form-input'}
              // value={passWord}
              // onChange={handlePasswordChange}
              type={'password'}
              placeholder={'비밀번호를 입력해주세요'}
            />
          </div>
        </div>
        <div>
          <button type={'submit'} className={'form-button'}>
            로그인
          </button>
        </div>
        <div>
          <span>
            <Link className={'form-link'} to="/signup">
              회원가입
            </Link>
            <Link className={'form-link'} to="/find-id">
              ID 찾기
            </Link>
            <Link className={'form-link'} to="/find-password">
              비밀번호 찾기
            </Link>
          </span>
        </div>
        <div>
          <div>
            <button className="form-social-button naver">
              <span>Naver 계정으로 로그인</span>
            </button>
          </div>
          <div>
            <button className="form-social-button google">
              <span>Google 계정으로 로그인</span>
            </button>
          </div>
          <div>
            <button className="form-social-button kakao">
              <span>KaKao 계정으로 로그인</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
