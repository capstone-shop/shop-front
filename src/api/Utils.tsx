// 상수 및 외부 모듈 임포트
import { ACCESS_TOKEN, API_BASE_URL } from '../constants/constant';

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

// 소셜로그인시 추가정보 입력 타입
export interface AdditionalInfoRequest {
  address: string;
  phone_number: string;
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

// 검색 요청 데이터 타입
export interface ProductRequest {
  page?: number; // 페이지 번호 (기본값=0)
  size?: number; // 페이지 크기 (기본값=20)
  sort?: string; // 정렬 기준, 예: "wish,desc"
  search?: string; // 검색어 (기본값="")
  filter?: string; // 필터 조건, 예: "wish,0;stat,1,2"
}

// 검색 화면 데이터 타입 (API 응답 데이터)
interface ProductSearchResponse {
  merchandise: Product[];
  totalPage: number;
}

// 상품 상세조회 화면 데이터 타입
export interface ProductDetailResponse {
  merchandise: Product;
  relatedMerchandise: Product[];
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

    // 상태 코드와 응답 내용을 확인
    console.log('HTTP 상태 코드:', response.status);

    if (!response.ok) {
      const errorText = await response.text(); // 오류 응답 본문을 텍스트로 읽음
      try {
        const errorResponse = JSON.parse(errorText);
        throw new Error(errorResponse.message || 'API 요청 실패');
      } catch {
        throw new Error('API 요청 실패: 응답 본문을 파싱할 수 없습니다.');
      }
    }

    // 응답 본문 처리
    const text = await response.text();
    if (!text) {
      // 빈 본문 처리
      console.log('응답 본문이 비어 있습니다.');
      return null;
    }

    // JSON 파싱 시도
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('응답 JSON 파싱 오류:', error);
      throw new Error('API 응답을 JSON으로 파싱할 수 없습니다.');
    }
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 사용자 로그인 요청 함수
export function signIn(data: SignInRequest): Promise<SignInResponse> {
  return request(
    {
      url: `${API_BASE_URL}/api/v1/user/signin`,
      method: 'POST',
      body: JSON.stringify(data),
    },
    false
  )
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
      url: `${API_BASE_URL}/api/v1/user/signup`, // 회원가입 API 엔드포인트
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

// 소셜로그인 추가 정보 요청 함수
export function postAdditionalInfo(data: AdditionalInfoRequest): Promise<void> {
  return request({
    url: `${API_BASE_URL}/api/v1/user/additional-info`,
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(() => {
      // 서버 응답 본문이 없더라도 성공적으로 처리
      console.log('추가 정보 요청이 성공적으로 처리되었습니다.');
    })
    .catch((error) => {
      console.error('추가 정보 요청 중 오류가 발생했습니다:', error);
      throw error;
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

// 현재 사용자 정보 요청 함수
export function postCurrentUser(): Promise<any> {
  const token = localStorage.getItem(ACCESS_TOKEN);

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

// 쿼리 파라미터 생성 유틸리티
export function createQueryParams(data: ProductRequest): string {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value)); // 값이 존재하는 경우만 추가
    }
  });

  return params.toString(); // "key1=value1&key2=value2" 형식 반환
}

// 검색화면 상품 조회
export function getProductSearch(
  data: ProductRequest
): Promise<ProductSearchResponse> {
  const queryParams = createQueryParams(data);

  return request(
    {
      url: `${API_BASE_URL}/api/v1/merchandise?${queryParams}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    false
  )
    .then((response) => response as ProductSearchResponse)
    .catch((error) => {
      console.error('상품 조회 중 오류 발생:', error);
      return Promise.reject(new Error('상품 조회 중 문제가 발생했습니다.'));
    });
}

// 상품 상세보기 조회
export function getProductDetail(data: {
  id: number;
}): Promise<ProductDetailResponse> {
  const { id } = data;

  return request(
    {
      url: `${API_BASE_URL}/api/v1/merchandise/${id}`, // id를 URL에 삽입
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    false // 인증 헤더 제거 "필수"임
  )
    .then((response) => response as ProductDetailResponse)
    .catch((error) => {
      console.error('상품 상세보기 조회 중 오류 발생:', error);
      return Promise.reject(
        new Error('상품 상세보기 조회 중 문제가 발생했습니다.')
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

// 시간 함수
export default function formatDate(isoDateString: string): string {
  const date = new Date(isoDateString);

  const year = date.getFullYear(); // 연도
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
  const day = String(date.getDate()).padStart(2, '0'); // 일

  const hours24 = date.getHours(); // 24시간 형식의 시
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 분

  const isPM = hours24 >= 12; // 오후 여부
  const hours12 = hours24 % 12 || 12; // 12시간 형식 (0시 -> 12시)

  const period = isPM ? '오후' : '오전'; // 오전/오후

  return `${year}-${month}-${day} ${period} ${hours12}:${minutes}`;
}
