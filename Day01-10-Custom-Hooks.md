# **🚀 커스텀 Hook 제작: useCounter와 useUserStatus**

React에서 커스텀 Hook은 재사용 가능한 상태 관리 로직을 추출하여 컴포넌트 간 중복을 줄이고 코드의 가독성을 높이는 데 유용합니다.   
`useCounter`와 `useUserStatus` 커스텀 Hook을 구현하고 실제 컴포넌트에 적용해봅시다.

---
## **1. useCounter 커스텀 Hook**

카운터 값을 관리하는 커스텀 Hook으로, 초기 값 설정, 증가, 감소, 초기화 기능을 제공하는 `useCounter` Hook을 만들어봅시다.

### **구현 코드**
```jsx
import { useState } from "react";

export default function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(count - 1, 0)); // 음수 방지
  const reset = () => setCount(initialCount);

  return { count, increment, decrement, reset };
}
```

### **적용 예제**
```jsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import useCounter from "../hooks/03Ex05UseCounterCustomHook";

export default function Ex05Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>현재 카운트: {count}</Text>
      <View style={styles.buttonRow}>
        <Button title="증가" onPress={increment} />
        <Button title="감소" onPress={decrement} />
        <Button title="초기화" onPress={reset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },
  text: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10, // RN 0.71 이상에서 지원, 하위 버전이면 marginRight 등으로 처리
  },
});

```

---

## **2. useUserStatus 커스텀 Hook**

서버 API를 통해 사용자의 상태를 온라인 상태를 구독하여, 이를 실시간으로 업데이트할 수 있는 `useUserStatus` Hook을 만들어봅시다.

### **구현 코드**
```jsx
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


```

---

## **3. 함께 적용하기**
두 개의 커스텀 Hook을 하나의 컴포넌트에서 사용해 봅시다.

```jsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import useCounter from "../hooks/03Ex05UseCounterCustomHook";
import useUserStatus from "../hooks/03Ex06UseUserStatusCustomHook";

export default function Ex06Dashboard({ user }) {
  const { count, increment } = useCounter(0);
  const isOnline = useUserStatus(user.id);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>사용자 대시보드</Text>
      <Text style={styles.status}>
        {user.name}님은 현재{" "}
        <Text style={[styles.bold, { color: isOnline ? "green" : "gray" }]}>
          {isOnline === null ? "확인 중..." : isOnline ? "온라인" : "오프라인"}
        </Text>
        {" "}상태입니다.
      </Text>
      <Text style={styles.count}>방문 횟수: {count}</Text>
      <Button title="방문 횟수 증가" onPress={increment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    elevation: 2,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  status: {
    fontSize: 18,
    marginBottom: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  count: {
    fontSize: 20,
    marginBottom: 16,
  },
});

```

## 커스텀 Hook을 써야 하는 대표적인 React Native 사례

React Native에서 커스텀 Hook은 **반복되는 로직을 재사용**하고, **컴포넌트의 복잡도를 낮추며**, **코드를 깔끔하게 유지**하는 데 매우 유용합니다.  
아래는 실제로 커스텀 Hook을 도입해야 할 대표적인 사례와 예시입니다.

---

**1. 폼 입력값 및 유효성 검사 관리**

- 여러 입력 필드의 상태와 유효성 검사를 하나의 커스텀 Hook으로 관리하면, 코드 중복을 줄이고 유지보수성을 높일 수 있습니다.
- 예시:  
  ```jsx
  // useFormInput.jsx
  import { useState } from 'react';

  export function useFormInput(initialValue) {
    const [value, setValue] = useState(initialValue);
    const onChangeText = setValue;
    return { value, onChangeText };
  }

  // 사용
  const nameInput = useFormInput('');
  
  ```
  이런 방식으로 여러 입력 필드에 동일한 로직을 쉽게 적용할 수 있습니다.

---

**2. API 데이터 패칭 및 로딩/에러 상태 관리**

- 네트워크 요청, 로딩 상태, 에러 핸들링 등 반복되는 비동기 로직을 커스텀 Hook으로 분리하면 여러 화면에서 재사용이 가능합니다.
- 예시:
  ```jsx
  // useFetch.jsx
  import { useState, useEffect } from 'react';

  export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetch(url)
        .then(res => res.json())
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
  }
  ```
  여러 컴포넌트에서 동일한 방식으로 데이터 패칭 로직을 재사용할 수 있습니다.

---

**3. 네트워크 상태, 하드웨어 이벤트 등 시스템 상태 관리**

- 네트워크 연결 상태, 배터리 상태, 기기 방향 등 시스템 관련 이벤트를 감지하고 처리하는 로직을 커스텀 Hook으로 분리할 수 있습니다.
- 예시:
  ```jsx
  // useOnlineStatus.jsx
  import { useState, useEffect } from 'react';
  import NetInfo from '@react-native-community/netinfo';

  export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true);
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsOnline(state.isConnected);
      });
      return () => unsubscribe();
    }, []);
    return isOnline;
  }
  ```
  이런 식으로 네트워크 상태를 여러 컴포넌트에서 손쉽게 활용할 수 있습니다.

---

**4. Boolean 상태 토글, 타이머, 인터벌 등 반복 제어 로직**

- 단순한 토글, 주기적 실행, 타이머 관리 등도 커스텀 Hook으로 추출하면 코드가 간결해집니다.
- 예시:
  ```jsx
  // useToggle.jsx
  import { useState } from 'react';
  export function useToggle(initial = false) {
    const [value, setValue] = useState(initial);
    const toggle = () => setValue(v => !v);
    return [value, toggle];
  }
  ```
  여러 곳에서 같은 토글 로직을 재사용할 수 있습니다.

---

**5. 복잡한 Effect 관리 및 외부 라이브러리 연동**

- 예를 들어, 채팅방 연결, 이벤트 리스너 등록/해제, 외부 라이브러리와의 연동 등 Effect가 많은 로직을 커스텀 Hook으로 분리하면 컴포넌트가 훨씬 읽기 쉬워집니다.

---

## 요약 표

| 사례                              | 설명                                                         | 대표 예시 Hook         |
|------------------------------------|--------------------------------------------------------------|------------------------|
| 폼 입력/유효성 관리                | 여러 입력 필드 상태 및 유효성 검사 로직 재사용                | useForm, useInput      |
| API/비동기 데이터 패칭             | 데이터 요청, 로딩/에러 상태 관리                             | useFetch, useAsync     |
| 네트워크/시스템 상태 감지          | 네트워크, 배터리, 하드웨어 이벤트 등 시스템 상태 관리         | useOnlineStatus        |
| Boolean/타이머/인터벌 등 제어      | 토글, 타이머, 인터벌 등 반복 제어 로직                        | useToggle, useInterval |
| Effect/외부 라이브러리 연동        | 복잡한 Effect, 이벤트 리스너, 외부 라이브러리 연동            | useChatRoom, useEventListener |

---

### 결론

React Native에서 커스텀 Hook은 **공통 로직의 재사용**, **컴포넌트 코드의 간결화**, **유지보수성 향상**을 위해 반드시 활용해야 하는 강력한 도구입니다.  
특히 폼 관리, API 통신, 네트워크 상태, 타이머 등 **여러 컴포넌트에서 반복되는 로직**이 있다면 커스텀 Hook으로 분리하는 것이 모범 사례입니다.
