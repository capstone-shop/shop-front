import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../styles/css/SignUp.module.css';
import DaumPost from './DaumPost';
import { signUp } from '../api/Utils';
import { useNavigate } from 'react-router-dom';

interface ProfileEditFormInputs {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  profileImages?: string; // 프로필 이미지 (선택사항)
}

function ProfileEdit() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileEditFormInputs>();

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // 주소 업데이트 핸들러
  const handleAddressChange = (newAddress: string) => {
    setValue('address', newAddress); // 폼 데이터로 주소 반영
  };

  // 내 정보 수정 폼 제출 핸들러
  const onSubmit: SubmitHandler<ProfileEditFormInputs> = async (data) => {
    // 데이터 변환: 필드 이름 매핑 및 기본값 추가
    const formData = {
      name: data.name,
      email: data.email,
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
      console.log('내정보 수정 성공:', response);
      alert('내정보 수정 성공!');
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('내정보 수정 실패:', error);
      alert('내정보 수정 실패!');
    }
  };

  return (
    <div className={styles.signUpFormContainer}>
      <div className={styles.signUp}>
        <span>내 정보 수정</span>
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
            <div className={styles.signUpInputContainer}>
              <input
                type="email"
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                })}
                placeholder="이메일을 입력해주세요"
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

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
                })}
                placeholder="비밀번호를 입력해주세요"
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

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
                })}
                placeholder="이름을 입력해주세요"
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

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
                  required: '숫자만 입력해주세요.',
                })}
                placeholder="숫자만 입력해주세요."
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

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
                  {...register('address', { required: '주소를 입력해주세요.' })}
                  readOnly
                />
              </div>
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 프로필 이미지 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                프로필 이미지
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpInputContainer}>
              <label htmlFor="profileImage" className={styles.fileInputLabel}>
                이미지 등록
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className={styles.hiddenFileInput} // 기본 파일 입력 숨김
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 생년월일 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>생년월일</label>
            </div>
            <div className={styles.signUpBirthGroup}>
              <input
                type="text"
                maxLength={4}
                placeholder="YYYY"
                className={styles.signUpBirthInput}
              />
              <span className={styles.separator}>/</span>
              <input
                type="text"
                maxLength={2}
                placeholder="MM"
                className={styles.signUpBirthInput}
              />
              <span className={styles.separator}>/</span>
              <input
                type="text"
                maxLength={2}
                placeholder="DD"
                className={styles.signUpBirthInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 수정하기 버튼 */}
          <div className={styles.signUpGroup}>
            <button type="submit" className={styles.signUpButton}>
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
