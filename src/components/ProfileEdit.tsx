import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from '../styles/css/SignUp.module.css';
import DaumPost from './DaumPost';
import { getCurrentUser, putCurrentUser } from '../api/Utils';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';

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
    setValue,
    formState: { errors },
  } = useForm<ProfileEditFormInputs>();

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // 이미지 미리보기 URL 저장
  const fileInputRef = useRef<HTMLInputElement | null>(null); // 파일 입력 요소 참조
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    navigate('/profileedit'); // 성공 시 메인 페이지로 이동
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string); // 읽은 파일의 URL 저장
      reader.readAsDataURL(file); // 파일 읽기
    }
  };

  // 미리보기 클릭 핸들러
  const handlePreviewClick = () => {
    fileInputRef.current?.click(); // 파일 입력 요소 클릭
  };

  // 주소 업데이트 핸들러
  const handleAddressChange = (newAddress: string) => {
    setValue('address', newAddress); // 폼 데이터로 주소 반영
  };

  // 내 정보 수정 폼 제출 핸들러
  const onSubmit: SubmitHandler<ProfileEditFormInputs> = async (data) => {
    console.log('onSubmit 실행됨:', data); // 실행 확인
    const formData = {
      name: data.name,
      email: data.email,
      password: data.password,
      address: data.address,
      phone_number: data.phone,
      profileImages: data.profileImages || '',
      authProvider: 'local',
      role: 'ROLE_USER',
    };

    try {
      console.log('전송 데이터:', formData);
      await putCurrentUser(formData); // 서버 요청
      // 성공 시 모달 띄우기
      setModalMessage('내 정보 수정이 성공적으로 완료되었습니다!');
      setIsModalOpen(true);
    } catch (error) {
      console.error('내정보 수정 실패:', error);
      // 실패 시 모달 띄우기
      setModalMessage('내 정보 수정이 실패했습니다. 다시 시도해주세요');
      setIsModalOpen(true);
    }
  };

  // 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        console.log('유저 데이터:', response);

        // 폼 필드 초기화
        setValue('email', response.email);
        setValue('name', response.name);
        setValue('phone', response.phoneNumber);
        setValue('address', response.address);
        setValue('profileImages', response.profileImages || '');
      } catch (err) {
        console.error('데이터를 불러오는 중 오류 발생:', err);
        setError('사용자 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchUser();
  }, [setValue]);

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
                이메일<span className={styles.signUpRequired}>*</span>
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
                readOnly // 이메일은 수정 불가
              />
            </div>
            <div className={styles.emptySpace}></div>
          </div>

          {/* 비밀번호 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>
                비밀번호<span className={styles.signUpRequired}>*</span>
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
                이름<span className={styles.signUpRequired}>*</span>
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
                휴대폰<span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpInputContainer}>
              <input
                type="text"
                {...register('phone', {
                  required: '숫자만 입력해주세요.',
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
                주소<span className={styles.signUpRequired}>*</span>
              </label>
            </div>
            <div className={styles.signUpAddressButton}>
              <div>
                <DaumPost setAddress={handleAddressChange} />
                <input
                  type="text"
                  {...register('address', { required: '주소를 입력해주세요.' })}
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

          {/* 프로필 이미지 */}
          <div className={styles.signUpGroup}>
            <div className={styles.labelContainer}>
              <label>프로필 이미지</label>
            </div>
            <div className={styles.imageInputContainer}>
              {preview ? (
                <img
                  src={preview}
                  alt="미리보기"
                  className={styles.previewImage}
                  onClick={handlePreviewClick}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <label htmlFor="profileImage" className={styles.fileInputLabel}>
                  이미지 등록
                </label>
              )}
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className={styles.hiddenFileInput}
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

      {/* 모달 렌더링 */}
      {isModalOpen && (
        <SuccessModal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
}

export default ProfileEdit;
