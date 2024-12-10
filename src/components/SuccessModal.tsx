import React from 'react';
import styles from '../styles/css/SuccessModal.module.css';

interface SuccessModalProps {
  message: string; // 모달에 표시할 메시지
  onClose: () => void; // 모달 닫기 핸들러
}

function SuccessModal({ message, onClose }: SuccessModalProps) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <p className={styles.message}>{message}</p>
        <button onClick={onClose} className={styles.closeButton}>
          확인
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
