import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/css/SignIn.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../api/Utils';
import {
  NAVER_AUTH_URL,
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
} from '../constants/constant';
import SuccessModal from './SuccessModal';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
        localStorage.setItem('accessToken', response.accessToken);
      }

      setModalMessage('로그인이 성공적으로 완료되었습니다!');
      setIsModalOpen(true);
    } catch (err) {
      const message =
        (err as Error).message ||
        '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.';
      setError(message);
      console.error(err);

      setModalMessage('로그인이 실패했습니다. 다시 시도해주세요.');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);

    if (error) {
      navigate('/signIn'); // 로그인 실패 시 로그인 페이지로 이동
    } else {
      navigate('/'); // 성공 시 메인 페이지로 이동
      window.location.reload(); // 강제 새로고침
    }
  };

  const handleSocialLogin = (url: string) => {
    // const response = await signIn(formData);
    // localStorage.setItem('accessToken', response.accessToken);
    window.location.href = url;
  };

  return (
    <div className={styles.signInFormContainer}>
      <form onSubmit={handleSignIn}>
        <div className={styles.signIn}>
          <span>로그인</span>
        </div>

        <div>
          <div>
            <input
              className={styles.signInFormInput}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="아이디(이메일)를 입력해주세요"
            />
          </div>
          <div>
            <input
              className={styles.signInFormInput}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력해주세요"
            />
          </div>
        </div>
        <div>
          <button type="submit" className={styles.signInFormBtn}>
            로그인
          </button>
        </div>
        <div className={styles.signInFormLinkContainer}>
          <span>
            <Link className={styles.signInFormLink} to="/signup">
              회원가입
            </Link>
            <Link className={styles.signInFormLink} to="/find-id">
              아이디 찾기
            </Link>
            <Link className={styles.signInFormLink} to="/find-password">
              비밀번호 찾기
            </Link>
          </span>
        </div>
        <div>
          <div>
            <button
              type="button"
              className={styles.signInFormNaverBtn}
              aria-label="Naver로 로그인"
              onClick={() => handleSocialLogin(NAVER_AUTH_URL)}
            >
              <span>Naver 계정으로 로그인</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              className={styles.signInFormGoogleBtn}
              aria-label="Google로 로그인"
              onClick={() => handleSocialLogin(GOOGLE_AUTH_URL)}
            >
              <span>Google 계정으로 로그인</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              className={styles.signInFormKaKaoBtn}
              aria-label="Kakao로 로그인"
              onClick={() => handleSocialLogin(KAKAO_AUTH_URL)}
            >
              <span>KaKao 계정으로 로그인</span>
            </button>
          </div>
        </div>
      </form>
      {/* 모달 렌더링 */}
      {isModalOpen && (
        <SuccessModal
          message={modalMessage}
          onClose={closeModal} // 확인 버튼 클릭 시 닫기
        />
      )}
    </div>
  );
}

export default SignIn;
