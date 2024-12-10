import React from 'react';
import styles from '../styles/css/Chat.module.css';

function Chat() {
  const chatUsers = [
    {
      id: 1,
      name: '유저1',
      lastMessage: '마지막 나눈 채팅 마지막 나눈 채팅 마지막 나눈 채팅',
      time: '오후 20:27',
    },
    {
      id: 2,
      name: '유저2',
      lastMessage: '감사합니다',
      time: '오후 20:24',
    },
    {
      id: 3,
      name: '유저3',
      lastMessage: '수고하세요~',
      time: '오후 20:24',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'other',
      name: '유저1',
      text: '채팅메시지 1번',
      time: '오후 20:24',
      isRead: true,
    },
    {
      id: 2,
      sender: 'other',
      name: '유저1',
      text: '채팅메시지 2번',
      time: '오후 20:24',
      isRead: true,
    },
    {
      id: 3,
      sender: 'other',
      name: '유저1',
      text: '채팅메시지 3번',
      time: '오후 20:25',
      isRead: true,
    },
    {
      id: 4,
      sender: 'me',
      name: '나',
      text: '매우 매우 매우 매우 긴 채팅메시지 예시',
      time: '오후 20:26',
      isRead: false, // 아직 읽히지 않은 메시지
    },
    {
      id: 5,
      sender: 'me',
      name: '나',
      text: '채팅메시지 5번',
      time: '오후 20:27',
      isRead: false,
    },
    {
      id: 6,
      sender: 'other',
      name: '유저1',
      text: '채팅메시지 6번',
      time: '오후 20:25',
      isRead: false,
    },
  ];

  return (
    <div className={styles.chatContainer}>
      {/* 좌측 채팅한 유저 목록 */}
      <div className={styles.userList}>
        {chatUsers.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.profileImage}></div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.lastMessage}>{user.lastMessage}</div>
            </div>
            <div className={styles.time}>{user.time}</div>
          </div>
        ))}
      </div>

      {/* 우측 채팅창 */}
      <div className={styles.chatWindow}>
        <div className={styles.chatMessages}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              {/* 이름 출력 조건: sender가 'other'이고, 첫 메시지이거나 이전 메시지의 sender가 다른 경우 */}
              {message.sender === 'other' &&
                (index === 0 || messages[index - 1]?.sender !== 'other') && (
                  <div className={styles.chatSenderName}>{message.name}</div>
                )}
              <div
                className={`${styles.chatMessage} ${
                  message.sender === 'me' ? styles.me : styles.other
                }`}
              >
                <div className={styles.messageBubble}>{message.text}</div>
                <div className={styles.messageTime}>
                  {/* 읽지 않은 메시지의 읽음 상태 표시 */}
                  {message.sender === 'me' && !message.isRead && (
                    <span>1 </span>
                  )}
                  {message.time}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            placeholder="메시지를 입력해주세요"
            className={styles.chatInput}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
