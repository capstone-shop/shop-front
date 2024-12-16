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
      console.log('fetchCurrentUser 실행');
      try {
        const response = await getCurrentUser();
        console.log('사용자 데이터:', response); // 여기에 로그 추가
        setCurrentUser(response);
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchCurrentUser().then(() => console.log('fetchCurrentUser 완료'));
  }, []);

  // `currentUser`에서 `id` 추출
  const currentUserId = currentUser?.id;

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

      setChatLogs(enrichedLogs); // 채팅 로그 초기화
      setCurrentRoomId(Number(chatRoomId)); // 현재 채팅방 ID 설정
      console.log('채팅 로그:', enrichedLogs);

      // URL 업데이트
      navigate(`/chat/${chatRoomId}`);
    } catch (error) {
      console.error('채팅 로그 불러오기 실패:', error);
    }
  };

  // STOMP 클라이언트 초기화 및 메시지 구독
  const [isConnected, setIsConnected] = useState(false); // STOMP 연결 상태

  useEffect(() => {
    const socket = new SockJS('https://api.induk.shop/chat');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 3000, // 3초 간격으로 재연결
      heartbeatIncoming: 5000, // 5초 간격으로 서버와 연결 확인
      heartbeatOutgoing: 5000, // 5초 간격으로 클라이언트에서 확인
      onConnect: () => {
        console.log('STOMP 연결 성공');
        setIsConnected(true); // 연결 상태 업데이트

        // 모든 채팅방에 대해 메시지 구독
        chatRooms.forEach((room) => {
          const subscription = stompClient.current?.subscribe(
            `/topic/messages/${room.chatRoomId}`,
            (message: StompMessage) => {
              console.log('수신한 메시지:', message.body);
              const newMessage = JSON.parse(message.body);

              // 1. 채팅방 목록 업데이트
              setChatRooms((prevRooms) => {
                const updatedRooms = prevRooms.map((r) =>
                  r.chatRoomId === newMessage.chatRoomId
                    ? {
                        ...r,
                        lastMessage: newMessage.content,
                        lastMessageSendTime: newMessage.createdAt,
                      }
                    : r
                );

                // 최신 메시지를 포함한 채팅방을 맨 위로 이동
                return updatedRooms.sort(
                  (a, b) =>
                    new Date(b.lastMessageSendTime).getTime() -
                    new Date(a.lastMessageSendTime).getTime()
                );
              });

              // 2. 현재 채팅방의 메시지 갱신
              if (newMessage.chatRoomId === currentRoomId) {
                setChatLogs((prevLogs) => [...prevLogs, newMessage]);
              }
            }
          );

          // 중복 구독 방지
          return () => {
            subscription?.unsubscribe();
          };
        });
      },
      onDisconnect: () => {
        console.log('STOMP 연결 종료');
        setIsConnected(false); // 연결 상태 해제
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
        setIsConnected(false); // 오류 발생 시 연결 상태 해제
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
      setIsConnected(false); // 클라이언트 비활성화 시 상태 해제
    };
  }, [chatRooms, currentRoomId]); // chatRooms와 currentRoomId 변경 시 재구독

  // 자동 스크롤
  // 기존의 자동 스크롤 기능을 개선한 부분
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement; // 스크롤 컨테이너
      if (container) {
        // 현재 컨테이너의 전체 스크롤 높이
        const scrollHeight = container.scrollHeight;

        // 컨테이너의 뷰포트 높이
        const clientHeight = container.clientHeight;

        // 스크롤 조정 (예: 전체 높이에서 클라이언트 높이를 빼고 약간 더 빼기)
        const targetScroll = scrollHeight - clientHeight - 20; // 20px 여유

        // 스크롤 설정
        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        });
      }
    }
  }, [chatLogs]); // chatLogs 변경 시 호출

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

    stompClient.current.publish({
      destination: `/app/sendMessage/${currentRoomId}`,
      body: JSON.stringify(message),
    });

    // 채팅방 목록 업데이트 (내 메시지 반영)
    setChatRooms((prevRooms) => {
      const updatedRooms = prevRooms.map((room) =>
        room.chatRoomId === currentRoomId
          ? {
              ...room,
              lastMessage: message.content,
              lastMessageTime: new Date().toISOString(), // 현재 시간으로 설정
            }
          : room
      );

      return updatedRooms.sort(
        (a, b) =>
          new Date(b.lastMessageSendTime).getTime() -
          new Date(a.lastMessageSendTime).getTime()
      );
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
              {/* 상대방 이름 출력 조건: senderId가 currentUserId와 다르고, 첫 메시지이거나 이전 메시지의 senderId가 다른 경우 */}
              {message.senderId !== currentUserId &&
                (index === 0 ||
                  chatLogs[index - 1]?.senderId === currentUserId) && (
                  <div className={styles.chatSenderName}>
                    {message.otherUserName}
                  </div>
                )}

              {/* 메시지 버블 */}
              <div
                className={`${styles.chatMessage} ${
                  message.senderId === currentUserId ? styles.me : styles.other
                }`}
              >
                <div className={styles.messageBubble}>{message.content}</div>
                <div className={styles.messageTime}>
                  {/* 메시지 시간 출력 */}
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
