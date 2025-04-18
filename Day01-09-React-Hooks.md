# React Hooks
React Hooks는 React 16.8 버전에서 도입된 기능으로, 함수형 컴포넌트에서도 상태 관리와 생명주기 메서드(lifecycle features)를 사용할 수 있도록 만들어진 함수 기반의 도구입니다.      
기존에는 이러한 기능을 사용하기 위해 클래스형 컴포넌트를 작성해야 했지만,     
Hooks를 통해 함수형 컴포넌트만으로도 동일한 기능을 간결하게 구현할 수 있습니다.    

### 기본 제공 Hooks
| Hook 이름                | 주요 기능                              |
|--------------------------|---------------------------------------|
| **useState**             | 상태 관리                            |
| **useEffect**            | 사이드 이펙트 처리                   |
| **useContext**           | Context API 사용                     |
| **useReducer**           | 복잡한 상태 로직 관리                |
| **useRef**               | DOM 접근 및 값 유지                  |
| **useMemo / useCallback**| 성능 최적화                           |
| **useLayoutEffect**      | DOM 업데이트 후 작업                 |
| **useId / useTransition / useDeferredValue / useSyncExternalStore / useDebugValue** | 기타 고급 기능 |

### Hooks의 주요 특징
#### 1. 클래스 없이 상태 관리 가능
- 기존 클래스형 컴포넌트에서 사용하던 state와 setState를 함수형 컴포넌트에서도 사용할 수 있습니다. 
- 대표적으로 useState Hook이 이를 지원합니다.

#### 2. 생명주기 메서드 통합
- 클래스형 컴포넌트의 componentDidMount, componentDidUpdate, componentWillUnmount 같은 생명주기 메서드가 하나의 API(useEffect)로 통합되어 간결한 코드 작성이 가능합니다.

#### 3. 재사용성과 모듈화
- Hooks를 사용하면 상태 관련 로직을 컴포넌트에서 분리하여 독립적으로 테스트하고 재사용할 수 있습니다. 
- 이를 통해 코드의 가독성과 유지보수성이 크게 향상됩니다.

#### 4. 함수형 프로그래밍에 최적화
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

  function Counter() {
    const [count, setCount] = useState(0);

    const addCount = () => {
      setCount(prevCount => prevCount + 1); // 이전 상태값을 기반으로 업데이트
    };

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={addCount}>Add</button>
      </div>
    );
  }
  ```
- **useReducer**: 복잡한 상태 로직을 처리할 때 사용되며, Redux의 리듀서와 유사합니다.
  ```jsx
  // useReducer 예제
  import React, { useReducer } from 'react';

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

  function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <div>
        <p>Count: {state.count}</p>
        <button onClick={() => dispatch({ type: 'increment' })}>+</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      </div>
    );
  }
  ```

---

### **2. Context 관련 Hooks**
- **useContext**: Context API를 쉽게 사용할 수 있도록 지원하며, props drilling 문제를 해결합니다.

```javascript
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedComponent() {
  const theme = useContext(ThemeContext);
  return <div>The current theme is {theme}</div>;
}
```

---

### **3. Ref 관련 Hooks**
- **useRef**: 
  - `useRef`는 `{ current: value }` 형태의 객체를 반환하며, 컴포넌트가 리렌더링되어도 값을 유지합니다.
  - DOM 접근 외에도 이전 값 저장 등 다양한 용도로 활용할 수 있습니다.
  ```javascript
  import React, { useRef } from 'react';

  function TextInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
      inputRef.current.focus(); // DOM 요소에 직접 접근
    };

    return (
      <div>
        <input ref={inputRef} type="text" />
        <button onClick={focusInput}>Focus Input</button>
      </div>
    );
  }

  ```
- **useImperativeHandle**: 부모 컴포넌트에서 자식 컴포넌트의 특정 메서드를 호출할 수 있도록 Ref를 커스터마이징합니다.
---

### **4. Effect 관련 Hooks**
- **useEffect**: 사이드 이펙트를 처리하며, 컴포넌트가 렌더링될 때 실행됩니다.
  - 컴포넌트의 생명주기 메서드(componentDidMount, componentDidUpdate, componentWillUnmount)를 대체하여 사이드 이펙트를 처리합니다.

  ```jsx
  import React, { useState, useEffect } from 'react';

  function Timer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      console.log('컴포넌트가 렌더링되었습니다.');

      return () => {
        console.log('컴포넌트가 언마운트되었습니다.');
      };
    }, [count]); // count 값이 변경될 때만 실행

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
  }
  ```
  - 의존성 배열(`[]`)을 통해 특정 값이 변경될 때만 실행되도록 설정할 수 있습니다.
  - `return`을 사용하여 cleanup 함수를 정의하면 컴포넌트가 언마운트될 때 실행됩니다.

- **useLayoutEffect**: DOM 업데이트 후 바로 실행되며, 레이아웃 측정을 위한 작업에 적합합니다.
- **useInsertionEffect**: DOM 변경 전에 실행되며, 주로 CSS 삽입 라이브러리에서 사용됩니다.

---

### **5. 성능 최적화 관련 Hooks**
- **useMemo**: 
  - 컴포넌트가 렌더링될 때마다 동일한 함수 객체를 재사용(Memoization)하도록 도와주는 불필요한 함수 재생성을 방지합니다.
  ```jsx
  import React, { useState, useMemo } from 'react';

  function ExpensiveCalculation({ num }) {
    const result = useMemo(() => {
      console.log('Calculating...');
      return num * 2;
    }, [num]);

    return <div>Result: {result}</div>;
  }
  ```
- **useCallback**: 
  - `useCallback`은 첫 번째 인자로 `함수`를 받고, 두 번째 인자로 의존성 배열(`[]`)을 받습니다
  - 의존성 배열이 변경되지 않으면 기존 함수를 재사용하여 성능 최적화를 제공합니다.
  ```javascript
  import React, { useState, useCallback } from 'react';

  function App() {
    const [count, setCount] = useState(0);

    const increment = useCallback(() => {
      setCount(prevCount => prevCount + 1);
    }, []);

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={increment}>Increment</button>
      </div>
    );
  }
  ```
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
- **useRef**: DOM 요소에 직접 접근하거나 렌더링 간 값을 유지할 때 사용됩니다. `.current`를 통해 값을 읽거나 설정합니다.

| Hook          | 주요 기능                              | 예시 활용              | 사용 방법                                                                 |
|---------------|---------------------------------------|-----------------------|-------------------------------------------------------------------------|
| **useState**   | 상태 관리                             | 카운터 구현           | `const [state, setState] = useState(initialValue);`                     |
| **useEffect**  | 사이드 이펙트 처리 및 생명주기 관리   | API 호출 및 cleanup   | `useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, []);`|
| **useCallback**| 함수 메모이제이션                    | 자식 컴포넌트 최적화  | `const memoizedFn = useCallback(() => { /* logic */ }, [dependencies]);`|
| **useRef**     | DOM 접근 및 값 유지                   | 포커스 제어           | `const ref = useRef(initialValue); ref.current`                         |


## 예제: 타이머 App 만들기
```jsx
import React, { useState, useEffect, useCallback, useRef } from "react";

function TimerApp() {
  // 상태 관리 (useState)
  const [time, setTime] = useState(0); // 타이머 시간
  const [isRunning, setIsRunning] = useState(false); // 타이머 실행 여부

  // 타이머를 제어하기 위한 ref (useRef)
  const timerRef = useRef(null);

  // 타이머 시작/정지 토글 함수 (useCallback)
  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev); // 이전 상태를 토글
  }, []);

  // 타이머 초기화 함수 (useCallback)
  const resetTimer = useCallback(() => {
    setIsRunning(false); // 타이머 정지
    setTime(0); // 시간 초기화
    if (timerRef.current) {
      clearInterval(timerRef.current); // 기존 타이머 클리어
    }
  }, []);

  // 타이머 동작 처리 (useEffect)
  useEffect(() => {
    if (isRunning) {
      // 타이머가 실행 중일 때
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1); // 매초마다 시간 증가
      }, 1000);
    } else {
      // 타이머가 정지되었을 때
      clearInterval(timerRef.current);
    }

    // 컴포넌트 언마운트 시 클리어
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React Timer</h1>
      <h2>{time} seconds</h2>
      <button onClick={toggleTimer} style={{ marginRight: "10px" }}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default TimerApp;
```