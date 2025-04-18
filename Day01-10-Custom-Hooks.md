# **커스텀 Hook 제작: useCounter와 useUserStatus**

React에서 커스텀 Hook은 재사용 가능한 상태 관리 로직을 추출하여 컴포넌트 간 중복을 줄이고 코드의 가독성을 높이는 데 유용합니다. 아래는 `useCounter`와 `useUserStatus` 커스텀 Hook을 구현하고 실제 컴포넌트에 적용해봅시다.

---
## **1. useCounter 커스텀 Hook**

카운터 값을 관리하는 커스텀 Hook으로, 초기 값 설정, 증가, 감소, 초기화 기능을 제공하는 `useCounter` Hook을을 만들어봅시다.

### **구현 코드**
```jsx
import { useState } from "react";

function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(count - 1, 0)); // 음수 방지
  const reset = () => setCount(initialCount);

  return { count, increment, decrement, reset };
}

export default useCounter;
```

### **적용 예제**
```jsx
import React from "react";
import useCounter from "./useCounter";

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={increment}>증가</button>
      <button onClick={decrement}>감소</button>
      <button onClick={reset}>초기화</button>
    </div>
  );
}

export default Counter;
```

---

## **2. useUserStatus 커스텀 Hook**

서버 API를 통해 사용자의 상태를 온라인 상태를 구독하여, 이를 실시간으로 업데이트할 수 있는 `useUserStatus` Hook을 만들어봅시다.

### **구현 코드**
```jsx
import { useState, useEffect } from "react";

function useUserStatus(userId) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ServerAPI.subscribeUserStatus(userId, handleStatusChange);
    return () => {
      ServerAPI.unsubscribeUserStatus(userId, handleStatusChange);
    };
  }, [userId]);

  return isOnline;
}

export default useUserStatus;
```

### **적용 예제**
```jsx
import React from "react";
import useUserStatus from "./useUserStatus";

function User({ user }) {
  const isOnline = useUserStatus(user.id);

  return (
    <li style={{ color: isOnline ? "green" : "gray" }}>
      {user.name} ({isOnline ? "온라인" : "오프라인"})
    </li>
  );
}

export default User;
```

---

## **3. 함께 적용하기**
두 개의 커스텀 Hook을 하나의 컴포넌트에서 사용해 봅시다.

```jsx
import React from "react";
import useCounter from "./useCounter";
import useUserStatus from "./useUserStatus";

function Dashboard({ user }) {
  const { count, increment } = useCounter(0);
  const isOnline = useUserStatus(user.id);

  return (
    <div>
      <h1>사용자 대시보드</h1>
      <p>{user.name}님은 현재 {isOnline ? "온라인" : "오프라인"} 상태입니다.</p>
      <p>방문 횟수: {count}</p>
      <button onClick={increment}>방문 횟수 증가</button>
    </div>
  );
}

export default Dashboard;
```
