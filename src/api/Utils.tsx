// 상수 및 외부 모듈 임포트
import { ACCESS_TOKEN, API_BASE_URL } from '../constants/constant';
import exp from 'constants';

// 인터페이스 정의
interface RequestOptions extends RequestInit {
  url: string;
}

// 로그인 요청 데이터 타입
interface SignInRequest {
  email: string;
  password: string;
}

// 로그인 응답 데이터 타입
interface SignInResponse {
  accessToken: string;
  refreshToken?: string; // refreshToken이 선택적임을 명시
  tokenType: string;
}

// 회원가입 시 필요한 정보 타입 정의
interface SignUpRequest {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  additionalInfo?: string;
  termsOfService: boolean;
  privacyPolicy: boolean;
  optionalPrivacyPolicy?: boolean;
  marketingConsent?: boolean;
  smsConsent?: boolean;
  emailConsent?: boolean;
  ageConfirmation: boolean;
}

// 회원가입 응답 타입
interface SignUpResponse {
  success: boolean; // 요청 성공 여부
  message: string; // 응답 메시지 (예: '회원가입이 완료되었습니다.')
}

// 어드민 카테고리 응답 타입
interface AdminCategory {
  id: number;
  title: string;
  isLeaf: boolean;
}

// request 함수: 주어진 옵션을 사용하여 HTTP 요청을 보내고, 응답을 처리
const request = async (options: RequestOptions): Promise<any> => {
  // 요청 헤더 설정. Content-Type을 JSON으로 설정
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  // 로컬 스토리지에서 ACCESS_TOKEN을 가져와 Authorization 헤더에 추가
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    headers.append('Authorization', 'Bearer ' + accessToken);
  }

  // 기본 옵션에 사용자 옵션을 병합
  options = { ...options, headers };

  try {
    // fetch API를 사용하여 HTTP 요청을 보냄
    const response = await fetch(options.url, options);

    // 응답이 성공적이지 않을 경우, 에러를 던짐
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'API 요청 실패');
    }

    // 응답을 JSON으로 반환
    return await response.json();
  } catch (error) {
    // 에러가 발생하면 에러를 로깅하거나, 필요에 따라 추가 작업 가능
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 사용자 로그인 요청 함수
export function signIn(data: SignInRequest): Promise<SignInResponse> {
  return request({
    url: `${API_BASE_URL}/api/v1/user/signin`,
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((response) => {
      // 서버 응답이 예상한 형태인지 확인 후, 맞지 않으면 에러 반환
      if (!response.accessToken || !response.tokenType) {
        return Promise.reject(new Error('유효하지 않은 로그인 응답입니다.'));
      }
      return response as SignInResponse;
    })
    .catch((error) => {
      // 한글 에러 메시지를 사용하여 일관성 있는 에러 처리
      console.error('로그인 요청 중 오류가 발생했습니다:', error);
      return Promise.reject(new Error('로그인 요청 중 문제가 발생했습니다.'));
    });
}

// 회원가입 요청 함수
export function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  return request({
    url: `${API_BASE_URL}/signUp`, // 회원가입 API 엔드포인트
    method: 'POST',
    body: JSON.stringify(data), // 사용자 입력 데이터를 JSON으로 변환하여 요청 본문에 포함
  })
    .then((response) => {
      // 응답을 `SignUpResponse` 타입으로 반환
      return response as SignUpResponse;
    })
    .catch((error) => {
      // 에러 발생 시 한글로 에러 메시지 반환
      console.error('회원가입 요청 중 오류가 발생했습니다:', error);
      return Promise.reject(new Error('회원가입 중 문제가 발생했습니다.'));
    });
}

// 현재 사용자 정보 요청 함수
export function getCurrentUser(): Promise<any> {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    // 토큰이 없을 경우 즉시 한글 메시지로 에러 반환
    return Promise.reject(new Error('액세스 토큰이 설정되지 않았습니다.'));
  }

  return request({
    url: `${API_BASE_URL}/user/me`,
    method: 'GET',
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      // 한글 에러 메시지를 사용하여 에러 처리
      console.error(
        '현재 사용자 정보를 불러오는 중 오류가 발생했습니다:',
        error
      );
      return Promise.reject(
        new Error('현재 사용자 정보를 불러오는 중 문제가 발생했습니다.')
      );
    });
}

// Admin 카테고리 조회 요청 함수
export function getAdminCategory(categoryId: string | number = '') {
  const url = categoryId
    ? `${API_BASE_URL}/api/v1/category/${categoryId}/sub` // 선택된 카테고리 ID가 있을 때, 하위 카테고리 요청
    : `${API_BASE_URL}/api/v1/category`; // 기본 카테고리 리스트 요청

  return request({
    url,
    method: 'GET',
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error('카테고리 정보를 불러오는 중 오류가 발생했습니다:', error);
      return Promise.reject(
        new Error('카테고리 정보를 불러오는 중 문제가 발생했습니다.')
      );
    });
}
