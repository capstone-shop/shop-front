import React from 'react';
import { useDaumPostcodePopup, Address } from 'react-daum-postcode';

// Props 타입 정의: setAddress가 문자열 상태를 변경할 수 있도록 함
interface DaumPostProps {
  setAddress: (address: string) => void; // 단순 문자열을 전달하는 함수
}

// DaumPost 컴포넌트: '주소 검색' 버튼을 렌더링하고, Daum 우편번호 팝업을 화면 중앙에 표시
function DaumPost({ setAddress }: DaumPostProps) {
  // Daum 우편번호 API 스크립트 URL
  const scriptUrl =
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

  // useDaumPostcodePopup Hook을 사용하여 팝업 열기 함수 설정
  const open = useDaumPostcodePopup(scriptUrl);

  // 팝업에서 주소 선택이 완료되었을 때 호출될 함수
  const handleComplete = (data: Address) => {
    let fullAddress = data.address; // 기본 주소
    let extraAddress = ''; // 추가 주소 정보 (예: 동, 건물 이름 등)

    // 만약 도로명 주소라면, 추가 주소 정보를 조합
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname; // 법정동명이 존재할 경우 추가
      }
      if (data.buildingName !== '') {
        // 건물명이 존재할 경우 추가 (법정동명과 조합)
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      // 최종 주소 형식: 기본 주소 + 추가 주소
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    // 선택한 주소를 setAddress 함수를 통해 상위 컴포넌트에 전달
    setAddress(fullAddress);

    console.log(fullAddress); // 예시 출력: '서울 성동구 왕십리로2길 20 (성수동1가)'
  };

  // 버튼 클릭 시 팝업을 화면 중앙에 표시하는 함수
  const handleClick = () => {
    const width = 500; // 팝업 너비
    const height = 600; // 팝업 높이
    // 화면 중앙에 팝업 위치 계산
    const left = Math.ceil((window.innerWidth - width) / 2);
    const top = Math.ceil((window.innerHeight - height) / 2);

    // 팝업 열기, 위치 및 크기 설정
    open({
      onComplete: handleComplete, // 주소 선택 완료 시 호출될 함수
      left: left, // 팝업의 x 좌표 (가로 위치)
      top: top, // 팝업의 y 좌표 (세로 위치)
      width: width, // 팝업의 너비
      height: height, // 팝업의 높이
    });
  };

  return (
    // 주소 검색 버튼, 클릭 시 handleClick 함수 호출
    <button type="button" onClick={handleClick}>
      주소 검색
    </button>
  );
}

export default DaumPost;
