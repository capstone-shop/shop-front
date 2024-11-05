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
                  required: '아이디를 입력해주세요.',
                })}
                placeholder="아이디를 입력해주세요"
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
                placeholder="아이디를 입력해주세요"
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
                  required: '아이디를 입력해주세요.',
                })}
                placeholder="아이디를 입력해주세요"
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
                  required: '아이디를 입력해주세요.',
                })}
                placeholder="아이디를 입력해주세요"
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
                  required: '아이디를 입력해주세요.',
                })}
                placeholder="아이디를 입력해주세요"
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
              <button type="button">주소 검색</button>
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 성별 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>성별</label>
            </div>
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
            <div></div>
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
                <span>*</span>
              </label>
            </div>
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
