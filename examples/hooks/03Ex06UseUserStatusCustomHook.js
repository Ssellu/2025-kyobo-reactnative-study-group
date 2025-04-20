// hooks/useUserStatus.js
import { useState, useEffect } from 'react';

// 1초마다 온라인/오프라인 상태를 랜덤하게 바꿔주는 가짜 API
function subscribeUserStatus(userId, callback) {
  let isSubscribed = true;
  let timerId = null;

  function updateStatus() {
    if (!isSubscribed) return;
    // 50% 확률로 온라인/오프라인
    callback({ isOnline: Math.random() > 0.5 });
    timerId = setTimeout(updateStatus, 1000);
  }

  updateStatus();

  // 구독 해제 함수 반환
  return () => {
    isSubscribed = false;
    if (timerId) clearTimeout(timerId);
  };
}

export default function useUserStatus(userId) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    // 구독 시작
    const unsubscribe = subscribeUserStatus(userId, handleStatusChange);

    // 언마운트 시 구독 해제
    return unsubscribe;
  }, [userId]);

  return isOnline;
}
