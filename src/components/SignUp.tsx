import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../styles/css/SignUp.module.css';
import DaumPost from './DaumPost';
import { signUp } from '../api/Utils';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';

interface SignUpFormInputs {
  emailLocal: string; // 이메일 앞부분
  emailDomain: string; // 이메일 도메인
  password: string;
  name: string;
  phone: string;
  address: string;
  profileImages?: string; // 프로필 이미지 (선택사항)
}

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormInputs>();
  const navigate = useNavigate();
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 주소 업데이트 핸들러
  const handleAddressChange = (newAddress: string) => {
    setValue('address', newAddress); // 폼 데이터로 주소 반영
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    navigate('/'); // 성공 시 메인 페이지로 이동
  };

  // 회원가입 폼 제출 핸들러
  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    // 이메일 필드 합치기
    const email = `${data.emailLocal}@${data.emailDomain}`;

    // 데이터 변환: 필드 이름 매핑 및 기본값 추가
    const formData = {
      name: data.name,
      email: email, // 결합된 이메일 사용
      password: data.password,
      address: data.address,
      phone_number: data.phone, // 필드명 변환
      profileImages: data.profileImages || '', // 선택적 필드 (기본값은 빈 문자열)
      authProvider: 'local', // 고정 값
      role: 'ROLE_USER', // 고정 값
    };

    console.log('전송 데이터:', formData);

    try {
      const response = await signUp(formData); // API 호출
      console.log('회원가입 성공:', response);
      // 성공 시 모달 띄우기
      setModalMessage('회원가입이 성공적으로 완료되었습니다!');
      setIsModalOpen(true);
      // navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      // 실패 시 모달 띄우기
      setModalMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      setIsModalOpen(true);
    }
  };

  const domainOptions = [
    'naver.com',
    'gmail.com',
    'hanmail.net',
    'kakao.com',
    'daum.net',
    'hotmail.com',
    'yahoo.co.kr',
    'custom',
  ];

  return (
    <div className={styles.signUpFormContainer}>
      <div className={styles.signUp}>
        <span>회원가입</span>
      </div>
      <div className={styles.signUpSubContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 이메일 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                이메일
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            {/* 입력 필드 */}
            <div className={styles.emailInputWrapper}>
              <input
                type="text"
                {...register('emailLocal', {
                  required: '이메일 앞부분을 입력해주세요.',
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+$/,
                    message: '영문, 숫자, 마침표, 하이픈만 입력 가능합니다.',
                  },
                })}
                placeholder="예: fastbuying"
                className={styles.emailInput}
              />
              <span className={styles.emailAtSymbol}>@</span>
              {isCustomDomain ? (
                <>
                  <input
                    type="text"
                    {...register('emailDomain', {
                      required: '도메인을 입력해주세요.',
                      pattern: {
                        value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message:
                          '유효한 도메인 형식이 아닙니다. (예: example.com)',
                      },
                    })}
                    placeholder="직접 입력"
                    className={styles.emailInput}
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomDomain(false)}
                    className={styles.emailToggle}
                  ></button>
                </>
              ) : (
                <select
                  {...register('emailDomain', {
                    required: '도메인을 선택해주세요.',
                  })}
                  className={styles.emailSelect}
                >
                  <option value="" disabled>
                    선택하기
                  </option>
                  {domainOptions.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain === 'custom' ? '직접 입력' : domain}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 이메일 오류 메세지 */}
          {(errors.emailLocal || errors.emailDomain) && (
            <div className={styles.signUpGroup}>
              <div className={styles.labelContainer}>
                <label>
                  <span className={styles.signUpRequired}></span>
                </label>
              </div>
              <div className={styles.errorMessageContainer}>
                <span className={styles.errorMessage}>
                  {errors.emailLocal?.message || errors.emailDomain?.message}
                </span>
              </div>
              <div className={styles.emptySpace}></div>
            </div>
          )}

          {/* 비밀번호 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                비밀번호
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpInputContainer}>
              <input
                type="password"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      '최소 8자, 대문자/소문자, 숫자, 특수문자를 포함해야 합니다.',
                  },
                })}
                placeholder="비밀번호를 입력해주세요"
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 비밀번호 오류 메세지 */}
          {errors.password && (
            <div className={styles.signUpGroup}>
              <div className={styles.labelContainer}>
                <label>
                  <span className={styles.signUpRequired}></span>
                </label>
              </div>
              <div className={styles.errorMessageContainer}>
                <span className={styles.errorMessage}>
                  {errors.password.message}
                </span>
              </div>
              <div className={styles.emptySpace}></div>
            </div>
          )}

          {/* 이름 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                이름
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpInputContainer}>
              <input
                type="text"
                {...register('name', {
                  required: '이름을 입력해주세요.',
                  pattern: {
                    value: /^[가-힣a-zA-Z]+$/,
                    message: '한글 또는 영문만 입력 가능합니다.',
                  },
                })}
                placeholder="이름을 입력해주세요"
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 이름 오류 메세지 */}
          {errors.name && (
            <div className={styles.signUpGroup}>
              <div className={styles.labelContainer}>
                <label>
                  <span className={styles.signUpRequired}></span>
                </label>
              </div>
              <div className={styles.errorMessageContainer}>
                <span className={styles.errorMessage}>
                  {errors.name.message}
                </span>
              </div>
              <div className={styles.emptySpace}></div>
            </div>
          )}

          {/* 휴대폰 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                휴대폰
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpInputContainer}>
              <input
                type="text"
                {...register('phone', {
                  required: '휴대폰 번호를 입력해주세요.',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: '휴대폰 번호는 10~11자리 숫자만 입력 가능합니다.',
                  },
                })}
                placeholder="숫자만 입력해주세요."
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 휴대폰 오류 메세지 */}
          {errors.phone && ( // 오류가 있을 때만 렌더링
            <div className={styles.signUpGroup}>
              <div className={styles.labelContainer}>
                <label>
                  <span className={styles.signUpRequired}></span>
                </label>
              </div>
              <div className={styles.errorMessageContainer}>
                <span className={styles.errorMessage}>
                  {errors.phone.message}
                </span>
              </div>
              <div className={styles.emptySpace}></div>
            </div>
          )}

          {/* 주소 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                주소
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpAddressButton}>
              <div>
                <DaumPost setAddress={handleAddressChange} />
                <input
                  type="text"
                  {...register('address', {
                    required: '주소를 입력해주세요.',
                  })}
                  readOnly
                  className={styles.signUpInput}
                />
              </div>
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 주소 오류 메세지 */}
          {errors.address && (
            <div className={styles.signUpGroup}>
              <div className={styles.labelContainer}>
                <label>
                  <span className={styles.signUpRequired}></span>
                </label>
              </div>
              <div className={styles.errorMessageContainer}>
                <span className={styles.errorMessage}>
                  {errors.address.message}
                </span>
              </div>
              <div className={styles.emptySpace}></div>
            </div>
          )}

          {/* 가입하기 버튼 */}
          <div className={styles.signUpGroup}>
            <button type="submit" className={styles.signUpButton}>
              가입하기
            </button>
          </div>
        </form>
      </div>

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

export default SignUp;
