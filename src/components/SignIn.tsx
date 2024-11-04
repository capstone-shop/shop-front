import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/css/SignIn.css';
import { Link } from 'react-router-dom';
import { signIn } from '../api/Auth';
import {
  NAVER_AUTH_URL,
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
} from '../constants/constant';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 로그인 핸들러
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    try {
      setError(null); // 에러 메시지 초기화
      const response = await signIn(email, password);

      // 성공적으로 로그인했을 때 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      alert('로그인 성공!');
    } catch (err) {
      // 에러 메시지를 설정하고 콘솔에 전체 에러 출력
      const message =
        (err as Error).message ||
        '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.';
      setError(message);
      console.error(err);
    }
  };

  const handleSocialLogin = (url: string) => {
    window.location.href = url; // 해당 URL로 페이지 이동
  };

  return (
    <div className="form-background">
      <form onSubmit={handleSignIn}>
        <div>
          <span>로그인</span>
        </div>

        <div>
          <div>
            <input
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 이메일 입력 상태 업데이트
              type="email" // type을 email로 설정
              placeholder="아이디(이메일)를 입력해주세요"
            />
          </div>
          <div>
            <input
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 상태 업데이트
              type="password"
              placeholder="비밀번호를 입력해주세요"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="form-button">
            로그인
          </button>
        </div>

        {/* 에러 메시지 표시 */}
        {error && <p className="error-message">{error}</p>}

        <div>
          <span>
            <Link className="form-link" to="/signup">
              회원가입
            </Link>
            <Link className="form-link" to="/find-id">
              ID 찾기
            </Link>
            <Link className="form-link" to="/find-password">
              비밀번호 찾기
            </Link>
          </span>
        </div>

        <div>
          <div>
            <button
              type="button"
              className="form-social-button naver"
              aria-label="Naver로 로그인"
              onClick={() => handleSocialLogin(NAVER_AUTH_URL)}
            >
              <span>Naver 계정으로 로그인</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              className="form-social-button google"
              aria-label="Google로 로그인"
              onClick={() => handleSocialLogin(GOOGLE_AUTH_URL)}
            >
              <span>Google 계정으로 로그인</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              className="form-social-button kakao"
              aria-label="Kakao로 로그인"
              onClick={() => handleSocialLogin(KAKAO_AUTH_URL)}
            >
              <span>KaKao 계정으로 로그인</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
