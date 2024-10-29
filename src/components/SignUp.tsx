import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../styles/css/SignUp.module.css';

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

  return (
    <div className={styles.signUpFormContainer}>
      <div>
        <span>회원가입</span>
      </div>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          {/* 아이디 */}
          <div className={styles.signUpGroup}>
            <label>
              아이디
              <span className={styles.signUpRequired}>*</span>
            </label>
            <input
              type="text"
              {...register('username', { required: '아이디를 입력해주세요.' })}
              placeholder="아이디를 입력해주세요"
              className={styles.signUpInput}
            />
            {errors.username && (
              <p className={styles.errorMessage}>{errors.username.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className={styles.signUpGroup}>
            <label>
              비밀번호
              <span className={styles.signUpRequired}>*</span>
            </label>
            <input
              type="password"
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
              })}
              placeholder="비밀번호를 입력해주세요"
              className={styles.signUpInput}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.signUpGroup}>
            <label>
              비밀번호 확인
              <span className={styles.signUpRequired}>*</span>
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: '비밀번호 확인을 입력해주세요.',
                validate: (value) =>
                  value === watch('password') ||
                  '비밀번호가 일치하지 않습니다.',
              })}
              placeholder="비밀번호를 한번 더 입력해주세요"
              className={styles.signUpInput}
            />
            {errors.confirmPassword && (
              <p className={styles.errorMessage}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* 이름 */}
          <div className={styles.signUpGroup}>
            <label>
              이름
              <span className={styles.signUpRequired}>*</span>
            </label>
            <input
              type="text"
              {...register('name', { required: '이름을 입력해주세요.' })}
              placeholder="이름을 입력해주세요"
              className={styles.signUpInput}
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className={styles.signUpGroup}>
            <label>
              이메일
              <span className={styles.signUpRequired}>*</span>
            </label>
            <input
              type="text"
              {...register('email', { required: '이메일을 입력해주세요.' })}
              placeholder="예: marketkurly"
              className={styles.signUpInput}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>

          {/* 휴대폰 */}
          <div className={styles.signUpGroup}>
            <label>
              휴대폰
              <span className={styles.signUpRequired}>*</span>
            </label>
            <input
              type="text"
              {...register('phone', {
                required: '휴대폰 번호를 입력해주세요.',
                pattern: { value: /^[0-9]+$/, message: '숫자만 입력해주세요.' },
              })}
              placeholder="숫자만 입력해주세요."
              className={styles.signUpInput}
            />
            {errors.phone && (
              <p className={styles.errorMessage}>{errors.phone.message}</p>
            )}
          </div>

          {/* 주소 */}
          <div className={styles.signUpGroup}>
            <label>
              주소
              <span className={styles.signUpRequired}>*</span>
            </label>
            <button type="button" className={styles.signUpAddressButton}>
              주소 검색
            </button>
            {/*<input*/}
            {/*  type="text"*/}
            {/*  {...register('address', { required: '주소를 입력해주세요.' })}*/}
            {/*  placeholder="주소를 입력해주세요"*/}
            {/*  className={styles.inputField}*/}
            {/*/>*/}
            {/*{errors.address && (*/}
            {/*  <p className={styles.errorMessage}>{errors.address.message}</p>*/}
            {/*)}*/}
          </div>

          {/* 성별 */}
          <div className={styles.signUpGroup}>
            <label>성별</label>
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" value="남자" {...register('gender')} /> 남자
              </label>
              <label>
                <input type="radio" value="여자" {...register('gender')} /> 여자
              </label>
              <label>
                <input
                  type="radio"
                  value="선택안함"
                  {...register('gender')}
                  defaultChecked
                />{' '}
                선택안함
              </label>
            </div>
          </div>

          {/* 생년월일 */}
          <div className={styles.signUpGroup}>
            <label>생년월일</label>
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
          </div>

          {/* 약관 동의 */}
          <div className={styles.signUpGroup}>
            <label>
              이용약관동의
              <span>*</span>
            </label>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleAllCheck}
              />
              <span>전체 동의합니다.</span>
            </div>
            <div>
              <input
                type="checkbox"
                {...register('termsOfService', {
                  required: '이용약관에 동의해야 합니다.',
                })}
              />
              <span>이용약관 동의 (필수)</span>
            </div>
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
