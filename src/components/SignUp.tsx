import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../styles/css/SignUp.module.css';
import DaumPost from './DaumPost';

interface SignUpFormInputs {
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

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormInputs>();
  const [allChecked, setAllChecked] = useState(false);

  // 제출 핸들러
  const onSubmit: SubmitHandler<SignUpFormInputs> = useCallback((data) => {
    console.log(data);
  }, []);

  // 전체 체크박스 핸들러
  const handleAllCheck = useCallback(() => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setValue('termsOfService', newCheckedState);
    setValue('privacyPolicy', newCheckedState);
    setValue('optionalPrivacyPolicy', newCheckedState);
    setValue('marketingConsent', newCheckedState);
    setValue('smsConsent', newCheckedState);
    setValue('emailConsent', newCheckedState);
    setValue('ageConfirmation', newCheckedState);
  }, [allChecked, setValue]);

  const [address, setAddress] = useState(''); // 주소
  const [extraAddress, setExtraAddress] = useState(''); // 나머지 주소

  return (
    <div className={styles.signUpFormContainer}>
      <div className={styles.signUp}>
        <span>회원가입</span>
      </div>
      <div className={styles.signUpSubContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 아이디 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                아이디
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpInputContainer}>
              <input
                type="text"
                {...register('username', {
                  required: '아이디를 입력해주세요.',
                })}
                placeholder="아이디를 입력해주세요"
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
                type="text"
                {...register('username', {
                  required: '비밀번호를 입력해주세요.',
                })}
                placeholder="비밀번호를 입력해주세요"
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                비밀번호 확인
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpInputContainer}>
              <input
                type="text"
                {...register('username', {
                  required: '아이디를 입력해주세요.',
                })}
                placeholder="비밀번호를 한번 더 입력해주세요"
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
                {...register('username', {
                  required: '이름을 입력해주세요.',
                })}
                placeholder="이름을 입력해주세요"
                className={styles.signUpInput}
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

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
                type="text"
                {...register('username', {
                  required: '이메일을 입력해주세요.',
                })}
                placeholder="이메일을 입력해주세요"
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
                {...register('username', {
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
                <DaumPost setAddress={setAddress} />
              </div>
              <div>
                {/* DaumPost 컴포넌트에 setAddress 함수를 전달 */}
                <input type="text" value={address} readOnly />
              </div>
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 성별 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>성별</label>
            </div>
            <div className={styles.signUpRadioGroup}>
              {/* 남자 */}
              <input
                type="radio"
                id="male"
                value="남자"
                {...register('gender')}
                className={styles.signUpRadioInput}
              />
              <label htmlFor="male" className={styles.signUpRadioLabel}>
                남자
              </label>

              {/* 여자 */}
              <input
                type="radio"
                id="female"
                value="여자"
                {...register('gender')}
                className={styles.signUpRadioInput}
              />
              <label htmlFor="female" className={styles.signUpRadioLabel}>
                여자
              </label>

              {/* 선택안함 */}
              <input
                type="radio"
                id="none"
                value="선택안함"
                {...register('gender')}
                defaultChecked
                className={styles.signUpRadioInput}
              />
              <label htmlFor="none" className={styles.signUpRadioLabel}>
                선택안함
              </label>
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

          {/* 약관 동의 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                이용약관동의
                <span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.checkboxGroup}>
              {/* 전체 동의 체크박스 */}
              <input
                type="checkbox"
                id="allCheck" // id 추가
                checked={allChecked}
                onChange={handleAllCheck}
              />
              <label htmlFor="allCheck">
                <span>전체 동의합니다.</span>
              </label>
            </div>
            <div>
              {/* 이용약관 동의 체크박스 */}
              <input
                type="checkbox"
                id="termsOfService" // id 추가
                {...register('termsOfService', {
                  required: '이용약관에 동의해야 합니다.',
                })}
              />
              <label htmlFor="termsOfService">
                <span>이용약관 동의</span>
              </label>
            </div>
            <div></div>
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

export default SignUp;
