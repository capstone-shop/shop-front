import React, { useEffect, useState, useRef } from 'react';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from '../styles/css/Chat.module.css';
import {
  ChatLogResponse,
  ChatRoomResponse,
  getChatLog,
  getChatRoom,
  getCurrentUser,
} from '../api/Utils';
import { useNavigate, useParams } from 'react-router-dom';

export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  content: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate(); // useNavigate 훅 추가
  const [chatRooms, setChatRooms] = useState<ChatRoomResponse[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const stompClient = useRef<Client | null>(null);
  const currentUserId = useParams<{ id: string }>(); // 실제 로그인된 사용자 ID로 대체
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { id } = useParams<{ id: string }>(); // URL에서 id 가져오기
  const [chatLogs, setChatLogs] = useState<ChatLogResponse[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);

  // 현재 유저 조회
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // 로그인된 사용자 정보 API 호출
        const response = await getCurrentUser(); // API 함수 가정
        setCurrentUser(response);
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // 채팅방 목록 가져오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const data = { id: Number(id) }; // API 요청 데이터
        const response = await getChatRoom(data); // 배열 형태로 응답 받음
        console.log('채팅방 목록:', response);

        // 상태 업데이트
        setChatRooms(response);
      } catch (error) {
        console.error('채팅방 목록 불러오기 실패:', error);
        setError('채팅방 목록을 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchChatRooms();
  }, []);

  // 채팅방 선택 핸들러 수정
  const enterChatRoom = async (chatRoomId: string) => {
    try {
      const selectedRoom = chatRooms.find(
        (room) => room.chatRoomId === Number(chatRoomId)
      );

      const logs = await getChatLog({ id: Number(chatRoomId) });

      const enrichedLogs = logs.map((log) => ({
        ...log,
        otherUserName: selectedRoom?.otherUserName ?? '알 수 없음',
      }));

      setChatLogs(enrichedLogs);
      setCurrentRoomId(Number(chatRoomId));

      // URL 업데이트
      navigate(`/chat/${chatRoomId}`);
    } catch (error) {
      console.error('채팅 로그 불러오기 실패:', error);
    }
  };

  // STOMP 클라이언트 초기화
  useEffect(() => {
    const socket = new SockJS('https://api.induk.shop/chat');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('STOMP 연결 성공');

        // 연결 성공 시 메시지 구독
        if (stompClient.current) {
          stompClient.current.subscribe(
            `/topic/messages/${currentRoomId}`,
            (message: StompMessage) => {
              console.log('수신한 메시지:', message.body);
              const newMessage = JSON.parse(message.body);
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
          );
        }
      },
      onDisconnect: () => {
        console.log('STOMP 연결 종료');
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [currentRoomId]);

  // 메시지 전송
  const sendMessage = () => {
    if (!messageInput.trim() || !currentRoomId || !stompClient.current) {
      console.error(
        '메시지 전송 실패: 입력 값, 채팅방 ID, 또는 STOMP 클라이언트가 없습니다.'
      );
      return;
    }

    const message = {
      chatRoomId: currentRoomId,
      senderId: currentUserId,
      content: messageInput,
    };

    console.log('전송 중인 메시지:', message);

    stompClient.current.publish({
      destination: `/app/sendMessage/${currentRoomId}`,
      body: JSON.stringify(message),
    });

    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 키의 기본 동작 방지 (폼 제출 등)
      sendMessage(); // 메시지 전송
    }
  };

  const getFormattedTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const period = hours >= 12 ? '오후' : '오전';
    const adjustedHours = hours % 12 || 12; // 12시간제로 변환 (0을 12로 표시)

    return `${period} ${adjustedHours}:${minutes}`;
  };

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      {/* 좌측 채팅방 목록 */}
      <div className={styles.userList}>
        {chatRooms.map((room) => (
          <div
            key={room.chatRoomId}
            className={`${styles.userCard} ${
              currentRoomId === room.chatRoomId ? styles.active : ''
            }`}
            onClick={() => enterChatRoom(room.chatRoomId.toString())}
          >
            <div className={styles.profileImage}>
              {room.otherUserProfileImage ? (
                <img
                  src={room.otherUserProfileImage}
                  alt={`${room.otherUserName}의 프로필`}
                />
              ) : (
                <div className={styles.placeholder}></div>
              )}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{room.otherUserName}</div>
              <div className={styles.lastMessage}>
                {room.lastMessage ? room.lastMessage : '채팅이 없습니다.'}
              </div>
            </div>
            <div className={styles.time}>
              {getFormattedTime(room.lastMessageSendTime)}
            </div>
          </div>
        ))}
      </div>

      {/* 우측 채팅창 */}
      <div className={styles.chatWindow}>
        <div className={styles.chatMessages}>
          {chatLogs.map((message, index) => (
            <React.Fragment key={message.id}>
              {/* 이름 출력 조건: sender가 'other'이고, 첫 메시지거나 이전 메시지의 senderId가 다른 경우 */}
              {message.senderId !== currentUserId &&
                (index === 0 ||
                  chatLogs[index - 1]?.senderId === currentUserId) && (
                  <div className={styles.chatSenderName}>
                    {message.otherUserName}
                  </div>
                )}

              <div
                className={`${styles.chatMessage} ${
                  message.senderId === currentUserId ? styles.me : styles.other
                }`}
              >
                <div className={styles.messageBubble}>{message.content}</div>
                <div className={styles.messageTime}>
                  {/* 읽지 않은 메시지의 읽음 상태 표시 */}
                  {message.senderId === currentUserId && !message.read && (
                    <span className={styles.unreadBadge}>1</span>
                  )}
                  {getFormattedTime(message.createdAt)}
                </div>
              </div>
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
            placeholder="메시지를 입력해주세요"
            className={styles.chatInput}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
