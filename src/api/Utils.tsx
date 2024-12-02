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
  name: string;
  email: string;
  password: string;
  address: string;
  phone_number: string;
  profileImages: string;
  authProvider: string;
  role: string;
}

// 회원가입 응답 타입
interface SignUpResponse {
  success: boolean; // 요청 성공 여부
  message: string; // 응답 메시지 (예: '회원가입이 완료되었습니다.')
}

export interface ProductRequest {
  category?: string; // 카테고리 필터
  minPrice?: number; // 최소 가격
  maxPrice?: number; // 최대 가격
}

// 상품 데이터 타입 (API 응답 데이터)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  category: {
    id: number;
    title: string;
    isLeaf: boolean;
  }[];
  register: {
    id: number;
    name: string;
    reputation: number;
  };
  saleState: string;
  merchandiseState: string;
  negotiationAvailable: boolean;
  transactionMethod: string;
  view: number;
  wish: number;
  chat: number;
  images: string[];
  createdAt: string;
}

// 홈 화면 데이터 타입 (API 응답 데이터)
export interface HomeData {
  recentlyRegistered: Product[];
  mostWished: Product[];
}

// 어드민 카테고리 응답 타입
interface AdminCategory {
  id: number;
  title: string;
  isLeaf: boolean;
}

// request 함수: 주어진 옵션을 사용하여 HTTP 요청을 보내고, 응답을 처리
const request = async (
  options: RequestOptions,
  includeAuth = true
): Promise<any> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  // includeAuth가 true인 경우에만 Authorization 헤더 추가
  if (includeAuth) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      headers.append('Authorization', 'Bearer ' + accessToken);
    }
  }

  // 옵션 병합
  options = { ...options, headers };

  try {
    const response = await fetch(options.url, options);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'API 요청 실패');
    }

    return await response.json();
  } catch (error) {
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
  return request(
    {
      url: `${API_BASE_URL}/signUp`, // 회원가입 API 엔드포인트
      method: 'POST',
      body: JSON.stringify(data), // 사용자 입력 데이터를 JSON으로 변환하여 요청 본문에 포함
    },
    false // 헤더 포함하지 않음
  )
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
    url: `${API_BASE_URL}/api/v1/user/me`,
    method: 'GET',
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(
        '현재 사용자 정보를 불러오는 중 오류가 발생했습니다:',
        error
      );
      return Promise.reject(
        new Error('현재 사용자 정보를 불러오는 중 문제가 발생했습니다.')
      );
    });
}

// 홈화면 상품 조회
export function getProductHome(data: ProductRequest): Promise<HomeData> {
  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams(
    data as Record<string, string>
  ).toString();

  return request(
    {
      url: `${API_BASE_URL}/api/v1/home/merchandise?${queryParams}`,
      method: 'GET', // GET 요청 유지
      headers: {
        'Content-Type': 'application/json',
      },
    },
    false
  )
    .then((response) => response as HomeData)
    .catch((error) => {
      console.error('상품 조회 중 오류 발생:', error);
      return Promise.reject(new Error('상품 조회 중 문제가 발생했습니다.'));
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
