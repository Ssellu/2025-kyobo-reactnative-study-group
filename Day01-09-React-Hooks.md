# 🚀 React Native Hooks
React Hooks는 React 16.8 버전에서 도입된 기능으로, 함수형 컴포넌트에서도 상태 관리와 생명주기 메서드(lifecycle features)를 사용할 수 있도록 만들어진 함수 기반의 도구입니다.     
기존에는 이러한 기능을 사용하기 위해 클래스형 컴포넌트를 작성해야 했지만,     
Hooks를 통해 함수형 컴포넌트만으로도 동일한 기능을 간결하게 구현할 수 있습니다.      
RN 환경에서도 Hooks를 사용할 수 있습니다.     
함수형 컴포넌트에서만 사용 가능하며, 클래스형 컴포넌트에서는 사용할 수 없습니다.

### 기본 제공 Hooks
| Hook 이름                | 주요 기능                              |
|--------------------------|---------------------------------------|
| **useState**             | 상태 관리                            |
| **useEffect**            | 사이드 이펙트 처리                   |
| **useContext**           | Context API 사용                     |
| **useReducer**           | 복잡한 상태 로직 관리                |
| **useRef**               | 레이아웃 접근 및 값 유지                  |
| **useMemo / useCallback**| 성능 최적화                           |
| **useLayoutEffect**      | 레이아웃 계산 이후 후 작업                 |
| **useId / useTransition / useDeferredValue / useSyncExternalStore / useDebugValue** | 기타 고급 기능 |

### Hooks의 주요 특징
#### 1. 생명주기 메서드 통합
- 클래스형 컴포넌트의 componentDidMount, componentDidUpdate, componentWillUnmount 같은 생명주기 메서드가 하나의 API(useEffect)로 통합되어 간결한 코드 작성이 가능합니다.

#### 2. 재사용성과 모듈화
- Hooks를 사용하면 상태 관련 로직을 컴포넌트에서 분리하여 독립적으로 테스트하고 재사용할 수 있습니다. 
- 이를 통해 코드의 가독성과 유지보수성이 크게 향상됩니다.

#### 3. 함수형 프로그래밍에 최적화
- 함수형 컴포넌트의 장점을 극대화하며, 클래스 기반의 복잡한 구조를 피할 수 있습니다.

#### Hooks의 규칙
Hooks를 사용할 때는 몇 가지 규칙을 반드시 따라야 합니다:
1. 최상위에서만 호출: 반복문, 조건문, 중첩된 함수 안에서는 호출할 수 없습니다. 이는 React가 Hook 호출 순서를 추적하기 위해 필요합니다.
2. React 함수 내에서만 호출: 일반 JavaScript 함수에서는 사용할 수 없으며, 반드시 React 함수형 컴포넌트나 커스텀 Hook에서 호출해야 합니다.
---

## **React의 주요 Hooks**

### **1. State 관리 관련 Hooks**
- **useState**: 상태를 추가하고 관리하는 데 사용됩니다.
  - `useState(초기값)`을 호출하면 상태 변수와 상태 변경 함수가 반환됩니다.
  - 상태 변경 함수는 비동기적으로 동작하며, 이전 상태를 기반으로 업데이트하려면 함수형 업데이트를 사용하는 것이 좋습니다.
  ```jsx
  import React, { useState } from 'react';
  import { View, Text, Button } from 'react-native';

  export default function Ex01Counter() {
    console.log('useState - App component re-rendered');
    const [count, setCount] = useState(0);

    return (
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={{ fontSize: 24 }}>Count: {count}</Text>
        <Button title="Add" onPress={() => setCount(count + 1)} />
      </View>
    );
  }
  ```
  
- **useReducer**: 복잡한 상태 로직을 처리할 때 사용되며, Redux의 리듀서와 유사합니다.
  ```jsx
  import React, { useReducer } from 'react';
  import { View, Text, Button, StyleSheet } from 'react-native';

  const initialState = { count: 0 };

  function reducer(state, action) {
    switch (action.type) {
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      default:
        throw new Error();
    }
  }

  export default function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <View style={styles.container}>
        <Text style={styles.count}>Count: {state.count}</Text>
        <View style={styles.buttonRow}>
          <Button title="+" onPress={() => dispatch({ type: 'increment' })} />
          <Button title="-" onPress={() => dispatch({ type: 'decrement' })} />
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: 40,
    },
    count: {
      fontSize: 32,
      marginBottom: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 16,
    },
  });

  ```

---

### **2. Context 관련 Hooks**
- **useContext**: Context API를 쉽게 사용할 수 있도록 지원하며, props drilling 문제를 해결합니다.

```javascript
import React, { createContext, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Context 생성 (기본값: 'light')
const ThemeContext = createContext('light');

function ThemedComponent() {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>The current theme is {theme}</Text>
    </View>
  );
}

// 예시: ThemeContext.Provider로 감싸서 사용
export default function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  text: {
    fontSize: 20,
  },
});

```

---

### **3. Ref 관련 Hooks: useRef()**
- **useRef**는 React Native에서 컴포넌트가 리렌더링되어도 값을 유지할 수 있는 특별한 객체(`{ current: value }`)를 반환하는 Hook입니다. 
- DOM 직접 접근이 필요한 웹과 달리, React Native에서는 주로 다음과 같은 용도로 활용합니다.
  - **컴포넌트 참조(예: TextInput 등)**
  - **이전 값 저장 및 렌더링과 무관한 데이터 유지**
  - **불필요한 렌더링 방지**

---

**핵심 특징**
- `useRef`로 생성한 객체는 `.current` 프로퍼티에 값을 저장하며, 이 값은 컴포넌트가 리렌더링되어도 초기화되지 않고 계속 유지됩니다.
- `.current` 값을 변경해도 컴포넌트는 리렌더링되지 않습니다. 즉, 화면에 영향을 주지 않는 임시 데이터나 이전 값을 저장할 때 적합합니다.
---

#### useRef 주요 활용 예시

##### 1. 컴포넌트(예: TextInput) 참조 및 제어

React Native에서는 `TextInput` 같은 컴포넌트에 포커스를 주거나, 직접 메서드를 호출해야 할 때 useRef를 사용합니다.

```jsx
import React, { useRef } from 'react';
import { View, TextInput, Button } from 'react-native';

export default function Ex04TextInputFocus() {
  const nameInput = useRef(null);
  const ageInput = useRef(null);
  console.log('useRef - App component re-rendered');
  return (
    <View>
      <TextInput
        ref={nameInput}
        placeholder="이름"
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <TextInput
        ref={ageInput}
        placeholder="나이"
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <Button title="이름 입력란 포커스" onPress={() => nameInput.current.focus()} />
      <Button title="나이 입력란 포커스" onPress={() => ageInput.current.focus()} />
    </View>
  );
};
```
이 예제에서는 버튼 클릭 시 해당 입력란에 포커스를 줄 수 있습니다.

---

##### 2. 이전 값 저장 및 렌더링과 무관한 값 관리

useRef는 값이 바뀌어도 렌더링이 발생하지 않으므로, 이전 값 저장이나 임시 데이터 관리에 유용합니다.

```jsx
import React, { useRef, useState } from 'react';
import { View, Button, Text } from 'react-native';

const Example = () => {
  const [count, setCount] = useState(0);
  const prevCount = useRef(count);

  const handleIncrease = () => {
    prevCount.current = count; // 이전 값 저장
    setCount(count + 1);
  };

  return (
    <View>
      <Text>현재 값: {count}</Text>
      <Text>이전 값: {prevCount.current}</Text>
      <Button title="증가" onPress={handleIncrease} />
    </View>
  );
};
```
이렇게 하면, 버튼 클릭 시 이전 값을 별도로 저장해 둘 수 있습니다.

---

##### 3. 렌더링과 무관한 임시 데이터 저장

예를 들어, API 호출 횟수 제한, 타이머 ID, 입력값 임시 저장 등에 활용할 수 있습니다.

```jsx
const timerId = useRef(null);

// 타이머 시작
timerId.current = setInterval(() => { ... }, 1000);

// 타이머 종료
clearInterval(timerId.current);
```
이처럼 리렌더링과 무관하게 값을 저장하고 관리할 수 있습니다.

---

##### 요약

| 용도                | 설명                                                                 | 예시 컴포넌트          |
|---------------------|----------------------------------------------------------------------|------------------------|
| 컴포넌트 참조       | TextInput 등 특정 컴포넌트에 직접 접근(포커스 등)                     | TextInput, FlatList 등 |
| 이전 값 저장        | 렌더링과 무관하게 이전 값, 임시 데이터 저장                           | 숫자, 문자열 등        |
| 불필요한 렌더링 방지| 값이 바뀌어도 렌더링이 필요 없는 데이터 관리                          | 타이머 ID, 카운터 등   |

React Native에서 **useRef**는 컴포넌트 참조뿐 아니라, 렌더링과 무관하게 값이 유지되어야 하는 다양한 상황에서 매우 유용하게 사용됩니다.  
특히 입력란 포커스 이동, 이전 값 저장, 타이머 등 실제 앱에서 자주 활용되는 패턴이므로, 다양한 예제와 함께 익혀두면 좋습니다.


### **4. Effect 관련 Hooks**
- **useEffect**: 사이드 이펙트를 처리하며, 컴포넌트가 렌더링될 때 실행됩니다.
  - 컴포넌트의 생명주기 메서드(componentDidMount, componentDidUpdate, componentWillUnmount)를 대체하여 사이드 이펙트를 처리합니다.

  ```jsx
  import React, { useState, useEffect} from "react";
  import { View, Text, Button } from "react-native";

  export default function Ex02Timer() {
      console.log('useEffect - App component re-rendered');
      const [count, setCount] = useState(0);

      useEffect(() => {   
          const timer = setInterval(() => setCount(c => c + 1), 1000);
          return () => clearInterval(timer);  // UseEffect는 cleanup 함수를 리턴할 수 있다.
      }, []); // 빈 배열을 넣으면 componentDidMount와 같은 역할을 한다. 빈 배열이 아니면, componentDidUpdate와 같은 역할을 한다.

      return (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ fontSize: 24 }}>Timer: {count}</Text>
              <Button title="Reset" onPress={() => setCount(0)} />
          </View>
      );
  }
  ```
  - 의존성 배열(`[]`)을 통해 특정 값이 변경될 때만 실행되도록 설정할 수 있습니다.
  - `return`을 사용하여 cleanup 함수를 정의하면 컴포넌트가 언마운트될 때 실행됩니다.

**useEffect 동작 원리 이해하기**  
React의 `useEffect` 와 관련 컴포넌트 생명주기
---

### 1. 기본 구조 (componentDidMount)
```javascript
useEffect(() => {
  // 마운트 시 실행할 코드
  console.log('컴포넌트가 화면에 나타남!');
  
  return () => {
    // 클린업 함수 (componentWillUnmount)
    console.log('컴포넌트가 화면에서 사라짐!');
  };
}, []); // 빈 배열 = 마운트/언마운트 시만 실행
```

**실행 결과**  
- 컴포넌트가 처음 렌더링될 때: "컴포넌트가 화면에 나타남!" 출력  
- 컴포넌트가 제거될 때: "컴포넌트가 화면에서 사라짐!" 출력
---

### 2. 타이머 예제 (의존성 배열 없음)
```javascript
function Ex02Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
      console.log('카운트 업데이트:', count + 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
      console.log('타이머 정리 완료');
    };
  }, []); // 빈 배열 = 최초 1회만 실행

  return (
    <View>
      <Text>현재 카운트: {count}</Text>
    </View>
  );
}
```


### 3. 의존성 배열 사용 (componentDidUpdate)
```javascript
const [user, setUser] = useState('');

// user 상태가 변경될 때마다 실행
useEffect(() => {
  console.log('사용자 정보 변경:', user);
  // API 호출 등 추가 로직
}, [user]); // 의존성 배열에 user 추가
```

**실행 시나리오**  
1. 초기 렌더링: 효과 실행  
2. user 상태 변경: 효과 재실행  
3. 다른 상태 변경: 효과 무시

---

### 4. 클린업 함수의 중요성
```javascript
useEffect(() => {
  const subscription = someEventSource.subscribe();
  
  return () => {
    subscription.unsubscribe(); // 메모리 누수 방지
    console.log('구독 해제 완료');
  };
}, []);
```

**주요 사용처**  
- 이벤트 리스너 제거  
- API 요청 취소  
- 타이머/인터벌 정리

---

### 📌 핵심 비교표
| 클래스 생명주기  | useEffect 동작           | 사용 예시                  |
|------------------|--------------------------|---------------------------|
| componentDidMount | `useEffect(..., [])`     | 초기 데이터 로딩          |
| componentDidUpdate | `useEffect(..., [dep])` | 상태 변경 시 추가 작업    |
| componentWillUnmount | 클린업 함수            | 리소스 정리              |

**올바른 사용 패턴**  
```javascript
// 1. 모든 상태 의존성 명시
useEffect(() => {
  // count와 user가 변경될 때 실행
}, [count, user]); 

// 2. 빈 배열: 컴포넌트 생명주기 관리
useEffect(() => {
  // 초기화 코드
  return () => { /* 정리 코드 */ };
}, []);
```
---
- **useLayoutEffect**: 레이아웃 업데이트 후 바로 실행되며, 레이아웃 측정을 위한 작업에 적합합니다.
- **useInsertionEffect**: 레이아웃 변경 전에 실행되며, 주로 CSS 삽입 라이브러리에서 사용됩니다.
---

### **5. 성능 최적화 관련 Hooks**
- **useMemo**: 
  - 컴포넌트가 렌더링될 때마다 동일한 함수 객체를 재사용(Memoization)하도록 도와주는 불필요한 함수 재생성을 방지합니다.
  ```jsx
  import React, { useMemo } from 'react';
  import { View, Text, StyleSheet } from 'react-native';

  function ExpensiveCalculation({ num }) {
    const result = useMemo(() => {
      console.log('Calculating...');
      return num * 2;
    }, [num]);

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Result: {result}</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: 20,
    },
    text: {
      fontSize: 20,
    },
  });

  export default ExpensiveCalculation;

  ```
- **useCallback**: 
  - `seCallback`은 React에서 제공하는 Hook으로, **함수의 메모이제이션(Memoization)**을 통해 불필요한 함수 재생성을 방지하고 성능을 최적화하는 데 사용됩니다.
  - `useCallback`은 첫 번째 인자로 `함수`를 받고, 두 번째 인자로 의존성 배열(`[]`)을 받습니다.
  - 주요 특징:
    - 함수 재사용: useCallback은 의존성 배열이 변경되지 않는 한 동일한 함수 객체를 반환합니다.
    - 성능 최적화: 자식 컴포넌트에 함수를 props로 전달할 때, 불필요한 리렌더링을 방지합니다.
    - 의존성 배열: 함수가 참조하는 값(상태, props 등)을 의존성 배열에 명시해야 합니다.
    ```jsx
    import React, { useState, useCallback } from 'react';
    import { View, Text, Button, StyleSheet } from 'react-native';

    export default function Ex03Counter() {
        console.log('useCallback - App component re-rendered');
        const [count, setCount] = useState(0);

        const increment = useCallback(() => {
            setCount(prevCount => prevCount + 1);
        }, []); // increment 함수는 컴포넌트가 리렌더링되더라도 동일한 함수 객체를 유지

        return (
            <View style={styles.container}>
            <Text style={styles.text}>Count: {count}</Text>
            <Button title="Increment" onPress={increment} />
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            marginTop: 40,
        },
        text: {
            fontSize: 24,
            marginBottom: 16,
        },
    });

    ```
  - useCallback은 자식 컴포넌트에 props로 함수를 전달할 때 유용합니다. 함수가 매번 새로 생성되면 자식 컴포넌트가 불필요하게 리렌더링될 수 있기 때문입니다.
    ```jsx
    import React, { useState, useCallback } from 'react';
    import { Button, Text, View } from 'react-native';

    const Child = React.memo(({ onClick }) => {
      console.log('Child rendered');
      return <Button title="Click Me" onPress={onClick} />;
      // React.memo로 감싼 Child 컴포넌트는 onClick 함수가 변경되지 않는 한 리렌더링되지 않는다.
    });

    export default function Parent() {
      const [count, setCount] = useState(0);

      const handleClick = useCallback(() => {
        console.log('Button clicked');
      }, []); // 빈 배열: handleClick은 항상 동일한 함수 객체를 유지

      return (
        <View>
          <Text>Count: {count}</Text>
          <Button title="Increment" onPress={() => setCount(count + 1)} />
          <Child onClick={handleClick} />
        </View>
      );
    }
    ```
  - 주의사항
    1. 의존성 배열 관리:
        - 의존성 배열에 포함된 값이 변경되면 함수가 새로 생성됩니다.
        - 의존성을 정확히 관리하지 않으면 의도치 않은 동작이나 성능 문제가 발생할 수 있습니다.
    2. 불필요한 사용 피하기:
        - 모든 함수에 useCallback을 사용하는 것은 오히려 성능을 저하시킬 수 있습니다.
        - 함수가 자식 컴포넌트에 props로 전달되거나, 리렌더링 비용이 높은 경우에만 사용하세요.
---

### **6. 기타 Hooks**
- **useId**: 고유한 ID를 생성하여 접근성을 향상시킵니다.
- **useTransition**: UI 업데이트와 관련된 트랜지션을 처리합니다.
- **useDeferredValue**: 값의 업데이트를 지연시켜 성능을 최적화합니다.
- **useSyncExternalStore**: 외부 스토어와 동기화 상태를 유지합니다.
- **useDebugValue**: 커스텀 Hook 디버깅 정보를 표시할 때 사용됩니다.


### \[중요!\] **useState/useEffect/useCallback/useRef** 요약 비교
- **useState**: 초기값을 설정하고, 상태 변경 함수(`setState`)를 통해 상태를 업데이트합니다.
- **useEffect**: 의존성 배열을 활용해 특정 값이 변경될 때만 실행되도록 설정하며, cleanup 함수도 정의할 수 있습니다.
- **useCallback**: 의존성 배열이 변경되지 않는 한 동일한 함수 객체를 반환하여 불필요한 렌더링을 방지합니다.
- **useRef**: 레이아웃 요소에 직접 접근하거나 렌더링 간 값을 유지할 때 사용됩니다. `.current`를 통해 값을 읽거나 설정합니다.

| Hook          | 주요 기능                              | 예시 활용              | 사용 방법                                                                 |
|---------------|---------------------------------------|-----------------------|-------------------------------------------------------------------------|
| **useState**   | 상태 관리                             | 카운터 구현           | `const [state, setState] = useState(initialValue);`                     |
| **useEffect**  | 사이드 이펙트 처리 및 생명주기 관리   | API 호출 및 cleanup   | `useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, []);`|
| **useCallback**| 함수 메모이제이션                    | 자식 컴포넌트 최적화  | `const memoizedFn = useCallback(() => { /* logic */ }, [dependencies]);`|
| **useRef**     | 레이아웃 접근 및 값 유지                   | 포커스 제어           | `const ref = useRef(initialValue); ref.current`                         |


## 예제: 타이머 App 만들기
```jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function TimerApp() {
  const [time, setTime] = useState(0);        // 타이머 시간
  const [isRunning, setIsRunning] = useState(false); // 타이머 실행 여부
  const timerRef = useRef(null);

  // 타이머 시작/정지 토글
  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // 타이머 초기화
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  // 타이머 동작 처리
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Timer</Text>
      <Text style={styles.time}>{time} seconds</Text>
      <View style={styles.buttonRow}>
        <Button
          title={isRunning ? 'Pause' : 'Start'}
          onPress={toggleTimer}
        />
        <View style={{ width: 10 }} />
        <Button
          title="Reset"
          onPress={resetTimer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16
  },
  time: {
    fontSize: 28,
    marginBottom: 32
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

```