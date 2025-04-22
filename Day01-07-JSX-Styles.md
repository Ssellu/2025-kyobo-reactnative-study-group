# 🚀 React Native의 JSX 문법, 스타일, 레이아웃 작성법

## 1. JSX 문법

React Native도 React와 동일하게 JSX를 사용합니다. 하지만 **HTML 태그 대신 React Native 전용 컴포넌트**(`<View>`, `<Text>`, 등)를 사용해야 합니다.

- **JavaScript 표현식 사용**: `{}`를 이용해 변수나 연산 결과를 JSX에 삽입할 수 있습니다.
  ```jsx
  const name = "React Native";
  const element = <Text>Hello, {name}!</Text>;
  ```

- **단일 루트 요소**: JSX는 항상 하나의 루트 요소로 감싸야 합니다.
  ```jsx
  const element = (
    <View>
      <Text>첫 번째 문장</Text>
      <Text>두 번째 문장</Text>
    </View>
  );
  ```

- **React Fragment**: 여러 요소를 감쌀 때 불필요한 뷰 계층을 만들고 싶지 않다면 Fragment를 사용할 수 있습니다.
  1. 명시적 사용:
    ```jsx
    import React from 'react';

    function App() {
      return (
        <React.Fragment>
          <Text>첫 번째 요소</Text>
          <Text>두 번째 요소</Text>
        </React.Fragment>
      );
    }
    ```
  2. 축약형 사용:
    ```jsx
    function App() {
      return (
        <>
          <Text>첫 번째 요소</Text>
          <Text>두 번째 요소</Text>
        </>
      );
    }
    ```

---

## 2. JSX 주석 처리

JSX에서 주석은 `{/* ... */}` 형태로 작성합니다.

- **단일 라인 주석**
  ```jsx
  <View>
    {/* 단일 라인 주석 */}
    <Text>Hello, World!</Text>
  </View>
  ```

- **멀티 라인 주석**
  ```jsx
  <View>
    {/*
      여러 줄에 걸친
      멀티 라인 주석
    */}
    <Text>Hello, React Native!</Text>
  </View>
  ```

> **주의:** HTML 스타일의 `<!-- -->` 주석은 JSX에서 사용할 수 없습니다.

---

## 3. `className` 대신 스타일 작성법

React Native에서는 HTML/CSS의 `class`나 `className`을 사용하지 않습니다.  
대신 **스타일 객체** 또는 **StyleSheet**를 사용합니다.

### 인라인 스타일
```jsx
<Text style={{ color: 'blue', fontSize: 20 }}>Hello, Style!</Text>
```

### StyleSheet로 스타일 재사용
```jsx
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  title: {
    color: 'white',
    backgroundColor: 'blue',
    padding: 10,
    fontSize: 24,
  },
});

function App() {
  return <Text style={styles.title}>Styled Header</Text>;
}
```

### 동적 스타일
```jsx
function Notification({ type }) {
  const styles = {
    success: { color: 'green' },
    error: { color: 'red' },
    warning: { color: 'orange' },
  };

  return <Text style={styles[type]}>This is a {type} message.</Text>;
}
```

> **참고:**  
> - React Native의 스타일 속성은 항상 camelCase(`backgroundColor`)로 작성해야 합니다.  
> - 단위(px 등)는 생략하며, 숫자는 dp(density-independent pixel, 밀도 독립 픽셀)로 인식됩니다.
> - '%'와 함께 사용할 수 있습니다.
> - 그 외의 단위는 react-native-units 등 라이브러리를 사용하면 vw, vh, px, su(rem 비슷) 등 다양한 단위처럼 쓸 수 있습니다.
```jsx
import RNU from 'react-native-units';
const boxStyle = {
  width: RNU.vw(50), // 화면 너비의 50%
  height: RNU.vh(30), // 화면 높이의 30%
  borderWidth: RNU.px(1), // 실제 1픽셀
  fontSize: RNU.su(2), // rem 비슷하게 스케일 조정
};
```


---

## 4. 실습 예제

### 1) 주석 처리 실습
```jsx
import React from 'react';
import { View, Text } from 'react-native';

function App() {
  return (
    <View>
      {/* 이 컴포넌트는 제목을 렌더링합니다 */}
      <Text style={{ fontSize: 20 }}>React Native 주석 처리</Text>
    </View>
  );
}
```

### 2) 스타일 작성 실습 (className 대신 style 사용)
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Style Example</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
```

### 3) 인라인 스타일 실습
```jsx
import React from 'react';
import { View } from 'react-native';

function App() {
  return (
    <View>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'yellow',
          borderRadius: 10,
        }}
      />
    </View>
  );
}
```

---

## 요약

- React Native에서는 HTML 태그와 className 대신, **전용 컴포넌트(View, Text 등)와 style/StyleSheet**를 사용합니다.
- JSX 문법, 주석 처리, 동적 스타일 적용 등은 React와 거의 동일하지만, 스타일 작성법과 적용 방식에 차이가 있습니다.
- 스타일 속성은 camelCase, 단위 생략, 숫자는 dp로 처리됨을 기억하세요.