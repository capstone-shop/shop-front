import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/login.module.css';
import { signIn } from '../../api/Utils';

function Login() {
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

  // 토큰 디코딩
  const decodeJWT = (token: string) => {
    try {
      const payload = token.split('.')[1]; // JWT의 payload 부분
      const decoded = JSON.parse(atob(payload)); // Base64 디코딩 후 JSON 파싱
      return decoded;
    } catch (error) {
      console.error('JWT 디코딩 실패:', error);
      return null;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);

      // 로그인 요청
      const response = await signIn(formData);

      // 토큰 디코딩
      const decoded = decodeJWT(response.accessToken);

      // role 확인
      if (
        decoded?.role?.some(
          (r: { authority: string }) => r.authority === 'ROLE_ADMIN'
        )
      ) {
        localStorage.setItem('isAdmin', 'true');
        alert('관리자 권한 확인 완료');
      } else {
        localStorage.setItem('isAdmin', 'false');
        alert('관리자 권한이 없습니다.');
        return; // 권한이 없으면 종료
      }

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // 로그인 성공 후 리디렉션
      navigate('/admin/category'); // 경로를 navigate 함수에 인자로 넘김
      window.location.reload(); // 강제 새로고침
    } catch (err) {
      // 에러 처리
      const message =
        (err as Error).message ||
        '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.';
      setError(message);
      console.error(err);
    }
  };

  return (
    <div className={styles.login}>
      <h1>로그인</h1>
      <form onSubmit={handleSignIn}>
        <div>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="아이디(이메일)을 입력해주세요."
          />
        </div>
        <div>
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력해주세요."
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <a href="#">비밀번호 찾기</a>
    </div>
  );
}
export default Login;
