import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../styles/css/AdditionalInfo.module.css';
import DaumPost from './DaumPost';
import { AdditionalInfoRequest, postAdditionalInfo } from '../api/Utils';
import { useNavigate } from 'react-router-dom';

function AdditionalInfo() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdditionalInfoRequest>();
  const [allChecked, setAllChecked] = useState(false);

  // 약관 전체 동의 핸들러
  const handleAllCheck = useCallback(() => {
    setAllChecked((prev) => !prev);
  }, []);

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // 주소 업데이트 핸들러
  const handleAddressChange = (newAddress: string) => {
    setValue('address', newAddress); // 폼 데이터로 주소 반영
  };

  // 추가 정보 입력 폼 제출 핸들러
  const onSubmit: SubmitHandler<AdditionalInfoRequest> = async (data) => {
    const formData = {
      address: data.address,
      phone_number: data.phone_number, // 필드명 변환
      authProvider: 'local', // 고정 값
      role: 'ROLE_USER', // 고정 값
    };

    console.log('전송 데이터:', formData);

    try {
      await postAdditionalInfo(formData); // 응답 본문을 확인하지 않음
      console.log('추가 정보 입력 성공!');
      alert('추가 정보 입력 성공!');
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('추가 정보 입력 실패:', error);
      alert('추가 정보 입력 실패!');
    }
  };

  return (
    <div className={styles.signUpFormContainer}>
      <div className={styles.signUp}>
        <span>추가 정보 입력</span>
      </div>
      <div className={styles.signUpSubContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register('phone_number', {
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

          {/* 가입하기 버튼 */}
          <div className={styles.signUpGroup}>
            <button type="submit" className={styles.signUpButton}>
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdditionalInfo;
