import {
  API_BASE_URL,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../constants/constant';

interface LoginResponse {
  tokenType: string; // 토큰의 타입 (예: "Bearer")
  accessToken: string; // 사용자 인증에 사용할 액세스 토큰
  refreshToken: string; // 액세스 토큰 갱신에 사용할 리프레시 토큰
}

export const signIn = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || '로그인 요청 실패';
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();

    // 로그인 성공 시 토큰을 로컬 스토리지에 저장
    localStorage.setItem(ACCESS_TOKEN, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN, data.refreshToken);

    return data; // 토큰 데이터를 반환 (필요할 경우)
  } catch (error) {
    console.error('로그인 요청 중 오류 발생:', error);
    throw new Error(
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    );
  }
};
