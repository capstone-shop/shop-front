// 상수 및 외부 모듈 임포트
import { ACCESS_TOKEN, API_BASE_URL } from '../constants/constant';
import category from '../admin/components/Category';

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

// 사용자 정보 수정 데이터 타입()
export interface userRequest {
  name: string;
  email: string;
  address: string;
  phone_number: string;
  profileImages: string;
  authProvider: string;
  role: string;
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

export interface UserProductRequest {
  images: string[]; // 이미지 배열
  name: string; // 상품명
  categoryId: number; // 카테고리 ID
  state: string;
  description: string; // 상품 설명
  price: number; // 가격
  direct: boolean; // 직거래 가능 여부
  nego: boolean; // 가격 네고 가능 여부
  delivery: boolean; // 택배 거래 가능 여부
  location: string; // 거래 장소
}

export interface UserProductResponse {}

// 카테고리 데이터 타입 (API) 응답 데이터)
export interface CategoryResponse {
  id: number;
  title: string;
  isLeaf: boolean;
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
  filter?: string | null; // null도 허용 필터 조건, 예: "wish,0;stat,1,2"
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

// 상품 찜하기 조회 요청
export interface ProductWishGetResponse {
  merchandiseId: number;
  isWished: boolean;
}

// 상품 찜하기/찜하기 취소 요청
export interface ProductWishPatchResponse {
  merchandiseId: number;
  isWished: boolean;
}

export interface ChatResponse {
  id: number; // Chat의 고유 ID
  sellerId: number; // 판매자의 ID
  buyerId: number; // 구매자의 ID
  createdAt: string; // 생성 시간, ISO 형식
  lastMessage?: string; // 선택적으로 마지막 메시지를 저장
  unreadCount?: number; // 읽지 않은 메시지 개수
}

export interface ChatRoomResponse {
  chatRoomId: number;
  otherUserName: string;
  otherUserProfileImage: string;
  lastMessage: string;
  lastMessageSendTime: string;
}

export interface ChatLogResponse {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  chatRoomId: number;
  read: boolean;
  otherUserName?: string; // 추가 속성
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
    'Content-Type': 'application/json', // 기본 Content-Type 헤더
  });

  // includeAuth가 true인 경우 Authorization 헤더 추가
  if (includeAuth) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    console.log('Access Token:', accessToken); // 디버깅 로그
    if (accessToken) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    } else {
      console.warn('Access Token이 없습니다.');
    }
  }

  // 옵션 병합
  const mergedOptions = { ...options, headers };

  // 헤더와 요청 정보 디버깅 출력
  console.log('Request Headers:', Array.from(headers.entries())); // 헤더 확인
  console.log('Request Options:', mergedOptions);

  try {
    const response = await fetch(mergedOptions.url, mergedOptions);

    // 응답 상태 코드와 본문 출력
    console.log('HTTP 상태 코드:', response.status);
    const responseText = await response.text();

    // 응답 확인
    if (!response.ok) {
      try {
        const errorResponse = JSON.parse(responseText);
        throw new Error(errorResponse.message || 'API 요청 실패');
      } catch {
        throw new Error(`API 요청 실패: ${responseText}`);
      }
    }

    // 응답 본문 처리
    if (responseText) {
      try {
        return JSON.parse(responseText); // JSON 파싱 성공
      } catch (error) {
        console.warn('JSON 파싱 실패, 텍스트로 반환:', responseText);
        return responseText; // JSON 파싱 실패 시 텍스트 반환
      }
    } else {
      console.log('응답 본문이 비어 있습니다.');
      return null; // 빈 응답 반환
    }
  } catch (error) {
    console.error('API 요청 중 오류:', error);
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

// 사용자 정보 수정 API
export function putCurrentUser(data: userRequest): Promise<SignUpResponse> {
  return request(
    {
      url: `${API_BASE_URL}/api/v1/user/update`, // 회원가입 API 엔드포인트
      method: 'PUT',
      body: JSON.stringify(data), // 사용자 입력 데이터를 JSON으로 변환하여 요청 본문에 포함
    },
    true // 헤더 포함
  )
    .then((response) => {
      // 응답을 `SignUpResponse` 타입으로 반환
      return response as SignUpResponse;
    })
    .catch((error) => {
      // 에러 발생 시 한글로 에러 메시지 반환
      console.error('사용자 정보 수정 요청중 오류가 발생했습니다:', error);
      return Promise.reject(
        new Error('사용자 정보 수정 요청중 문제가 발생했습니다.')
      );
    });
}

// 대 카테고리 목록 조회
export function getCategory(): Promise<CategoryResponse> {
  return request(
    {
      url: `${API_BASE_URL}/api/v1/category`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    false
  )
    .then((response) => response as CategoryResponse)
    .catch((error) => {
      console.error('카테고리 목록 조회 중 오류 발생:', error);
      return Promise.reject(
        new Error('카테고리 목록 조회 중 문제가 발생했습니다.')
      );
    });
}

// 중, 소 카테고리 목록 조회
export function getSubCategory(data: {
  id: number;
}): Promise<CategoryResponse> {
  const { id } = data;
  return request(
    {
      url: `${API_BASE_URL}/api/v1/category/${id}/sub`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    false
  )
    .then((response) => response as CategoryResponse)
    .catch((error) => {
      console.error('카테고리 목록 조회 중 오류 발생:', error);
      return Promise.reject(
        new Error('카테고리 목록 조회 중 문제가 발생했습니다.')
      );
    });
}

// 유저 상품 등록 API
export function postProduct(data: UserProductRequest): Promise<void> {
  return request(
    {
      url: `${API_BASE_URL}/api/v1/merchandise`,
      method: 'POST',
      body: JSON.stringify(data), // 사용자 입력 데이터를 JSON으로 변환하여 요청 본문에 포함
    },
    true // 헤더 포함
  )
    .then(() => {
      console.log('상품 등록 성공');
    })
    .catch((error) => {
      console.error('상품 등록 요청중 오류가 발생했습니다:', error);
      return Promise.reject(new Error('상품 등록 요청중 문제가 발생했습니다.'));
    });
}

// 유저 상품 수정 API
export function putProduct(
  data: { id: number } & UserProductRequest
): Promise<void> {
  const { id } = data;
  return request(
    {
      url: `${API_BASE_URL}/api/v1/merchandise/${id}`, // URL에 상품 ID 포함
      method: 'PUT', // 수정 작업은 PUT 메서드 사용
      body: JSON.stringify(data), // 전체 데이터를 JSON 문자열로 변환하여 본문에 포함
    },
    true // true로 설정하여 헤더를 포함
  )
    .then(() => {
      console.log('상품 수정 성공');
    })
    .catch((error) => {
      console.error('상품 수정 요청 중 오류 발생:', error);
      return Promise.reject(
        new Error('상품 수정 요청 중 문제가 발생했습니다.')
      );
    });
}

// 유저 상품 삭제 API
export function deleteProduct(data: { id: number }): Promise<void> {
  const { id } = data;
  return request(
    {
      url: `${API_BASE_URL}/api/v1/merchandise/${id}`, // URL에 상품 ID 포함
      method: 'DELETE',
      body: JSON.stringify(data), // 전체 데이터를 JSON 문자열로 변환하여 본문에 포함
    },
    true // true로 설정하여 헤더를 포함
  )
    .then(() => {
      console.log('상품 삭제 성공');
    })
    .catch((error) => {
      console.error('상품 삭제 요청 중 오류 발생:', error);
      return Promise.reject(
        new Error('상품 삭제 요청 중 문제가 발생했습니다.')
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

export function createQueryParams(data: ProductRequest): string {
  return Object.entries(data)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (key === 'filter') {
        return `${key}=${value}`; // filter는 그대로 추가 (인코딩하지 않음)
      }
      return `${key}=${encodeURIComponent(String(value))}`; // 다른 값은 인코딩
    })
    .join('&');
}

// 검색화면 상품 조회
export function getProductSearch(
  data: ProductRequest
): Promise<ProductSearchResponse> {
  const queryParams = createQueryParams({
    search: data.search,
    filter: data.filter,
    page: data.page,
    size: data.size,
  });

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

// 상품 찜하기 조회 API
export function getProductWish(data: {
  id: number;
}): Promise<ProductWishGetResponse> {
  const { id } = data;

  return request(
    {
      url: `${API_BASE_URL}/api/v1/merchandise/${id}/wish`, // id를 URL에 삽입
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true // 인증 헤더
  )
    .then((response) => response as ProductWishGetResponse)
    .catch((error) => {
      console.error('상품 찜하기 조회 중 오류 발생:', error);
      return Promise.reject(
        new Error('상품 찜하기 조회 중 문제가 발생했습니다.')
      );
    });
}

// 상품 찜하기/찜하기 취소 API
export function patchProductWish(data: {
  id: number;
}): Promise<ProductWishPatchResponse> {
  const { id } = data;

  return request(
    {
      url: `${API_BASE_URL}/api/v1/merchandise/${id}/wish`, // id를 URL에 삽입
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true // 인증 헤더
  )
    .then((response) => response as ProductWishPatchResponse)
    .catch((error) => {
      console.error('상품 찜하기/찜하기 취소 중 오류 발생:', error);
      return Promise.reject(
        new Error('상품 찜하기/찜하기 취소 중 문제가 발생했습니다.')
      );
    });
}

// 찜한 상품 조회 API
export function getUserWishlist(
  data: ProductRequest & { page: number; size: number }
): Promise<ProductSearchResponse> {
  // 쿼리 파라미터 생성
  const queryParams = createQueryParams(data);

  return request(
    {
      url: `${API_BASE_URL}/api/v1/my-info/wishlist?${queryParams}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true
  )
    .then((response) => response as ProductSearchResponse)
    .catch((error) => {
      console.error('찜한 상품 조회 중 오류 발생:', error);
      return Promise.reject(
        new Error('찜한 상품 조회 중 문제가 발생했습니다.')
      );
    });
}

// 등록한 상품 목록 조회 API
export function getUserRegisterdMerchandise(
  data: ProductRequest & { page: number; size: number } // page와 size를 포함한 타입
): Promise<ProductSearchResponse> {
  // 쿼리 파라미터 생성
  const queryParams = createQueryParams(data);

  return request(
    {
      url: `${API_BASE_URL}/api/v1/my-info/registered-merchandise?${queryParams}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true
  )
    .then((response) => response as ProductSearchResponse)
    .catch((error) => {
      console.error('사용자 등록 조회 중 오류 발생:', error);
      return Promise.reject(
        new Error('사용자 등록 조회 중 문제가 발생했습니다.')
      );
    });
}

// 채팅하기 요청 API
export function postChat(data: { id: number }): Promise<ChatResponse> {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const { id } = data;
  if (!token) {
    // 토큰이 없을 경우 즉시 한글 메시지로 에러 반환
    return Promise.reject(
      new Error('채팅하기 액세스 토큰이 설정되지 않았습니다.')
    );
  }

  return request(
    {
      url: `${API_BASE_URL}/api/v1/chat/create?sellerId=${id}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    true // 반드시 true로 설정
  );
}

// 채팅방 조회 요청 API
export function getChatRoom(data: { id: number }): Promise<ChatRoomResponse[]> {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    // 토큰이 없을 경우 즉시 한글 메시지로 에러 반환
    return Promise.reject(
      new Error('채팅방 액세스 토큰이 설정되지 않았습니다.')
    );
  }

  return request(
    {
      url: `${API_BASE_URL}/api/v1/chat/my-chat-rooms`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true // 반드시 true로 설정
  );
}

// 채팅 전송 API

// 채팅 로그 조회 API
export function getChatLog(data: { id: number }): Promise<ChatLogResponse[]> {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const { id } = data;
  if (!token) {
    // 토큰이 없을 경우 즉시 한글 메시지로 에러 반환
    return Promise.reject(
      new Error('채팅방 액세스 토큰이 설정되지 않았습니다.')
    );
  }

  return request(
    {
      url: `${API_BASE_URL}/api/v1/chat/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true // 반드시 true로 설정
  );
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

// 시간 유틸리티
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
