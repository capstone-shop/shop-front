import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/css/SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../api/Utils';
import {
  NAVER_AUTH_URL,
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
} from '../constants/constant';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);

      // 로그인 요청
      const response = await signIn(formData);

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      alert('로그인 성공!');
      // 로그인 성공 후 리디렉션
      navigate('/'); // 경로를 navigate 함수에 인자로 넘김
    } catch (err) {
      // 에러 처리
      const message =
        (err as Error).message ||
        '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.';
      setError(message);
      console.error(err);
    }
  };

  const handleSocialLogin = (url: string) => {
    window.location.href = url;
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="아이디(이메일)를 입력해주세요"
            />
          </div>
          <div>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
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
