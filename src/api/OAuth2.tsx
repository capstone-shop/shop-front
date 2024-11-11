import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants/constant';

// OAuth2 리디렉션을 처리하는 컴포넌트
const OAuth2RedirectHandler: React.FC = () => {
  // 현재 URL에 대한 정보를 제공하는 `location`과 페이지 이동을 처리하는 `navigate` 훅을 사용
  const location = useLocation();
  const navigate = useNavigate();

  // 컴포넌트가 처음 렌더링될 때 실행
  useEffect(() => {
    // 특정 파라미터를 URL 쿼리 스트링에서 추출하는 함수
    const getUrlParameter = (name: string): string | null => {
      // 정규 표현식을 이용해 쿼리 스트링에서 원하는 파라미터 값을 찾음
      const escapedName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + escapedName + '=([^&#]*)');
      const results = regex.exec(location.search);

      // 찾은 값을 디코딩하여 반환. 찾지 못하면 `null`을 반환
      return results ? decodeURIComponent(results[1]) : null;
    };

    // URL에서 `token`과 `error` 파라미터를 추출
    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    // `token`이 있는 경우, 로그인 성공으로 간주
    if (token) {
      // 로컬 스토리지에 `ACCESS_TOKEN`으로 토큰을 저장
      localStorage.setItem(ACCESS_TOKEN, token);
      // 홈 페이지로 이동하며, `from`에 현재 위치 정보를 함께 전달
      navigate('/', { state: { from: location } });
    } else {
      // `token`이 없는 경우, 로그인 실패로 간주하고 로그인 페이지로 이동
      navigate('/signIn', {
        state: {
          from: location, // 이전 위치 정보를 전달
          error: error || 'Unknown error occurred', // 오류 메시지 전달. 없으면 기본 메시지 설정
        },
      });
    }
  }, [location, navigate]); // `location`과 `navigate`가 변경될 때만 `useEffect` 재실행

  // 컴포넌트는 렌더링할 내용이 없으므로 `null` 반환
  return null;
};

export default OAuth2RedirectHandler;
