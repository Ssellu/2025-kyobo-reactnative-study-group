# JSX 문법, `className`, 인라인 스타일 작성법
### **1. JSX 문법**
JSX는 HTML과 비슷한 구조를 가지지만 JavaScript와 결합되어 다양한 기능을 제공합니다. 
- **JavaScript 표현식 사용**: `{}`은 JavaScript 표현식을 삽입할 때 사용합니다.
  ```jsx
  const name = "React";
  const element = <h1>Hello, {name}!</h1>;
  ```
- **단일 루트 요소**: [주의!] JSX는 항상 하나의 루트 요소로 감싸야 합니다.
  ```jsx
  const element = (
    <div>
      <p>첫 번째 문장</p>
      <p>두 번째 문장</p>
    </div>
  );  
  ```
- **React Fragment**: 
  - JSX에서 **이름이 없는 태그**는 Fragment라고 합니다.    
  - 이는 여러 요소를 하나로 감싸야 하지만, 불필요한 DOM 요소를 생성하고 싶지 않을 때 사용됩니다
  - Fragment는 브라우저에 별도의 엘리먼트로 나타나지 않습니다.
  1. React.Fragment를 명시적으로 사용:
  ```jsx
  import React from 'react';

  function App() {
    return (
      <React.Fragment>
        <p>첫 번째 요소</p>
        <p>두 번째 요소</p>
      </React.Fragment>
    );
  }

  export default App;
  ```
  2. 축약형 문법: React에서는 React.Fragment의 축약형으로 이름 없는 태그 `<>`와 `</>`를 사용할 수 있습니다.
  ```jsx
  function App() {
  return (
      <>
        <p>첫 번째 요소</p>
        <p>두 번째 요소</p>
      </>
    );
  }

  export default App;
  ```
---

### **2. JSX 주석 처리**
JSX에서 주석은 `{/* */}` 형태로 작성됩니다.

#### **단일 라인 주석**
```jsx
const element = (
  <div>
    {/* 단일 라인 주석 */}
    <h1>Hello, World!</h1>
  </div>
);
```

#### **멀티 라인 주석**
```jsx
const element = (
  <div>
    {/*
      멀티 라인 주석
      여러 줄에 걸쳐 작성 가능
    */}
    <h1>Hello, React!</h1>
  </div>
);
```

**주의**: HTML 스타일의 `<!-- -->` 주석은 JSX에서 사용할 수 없습니다.

---

### **3. `className` 사용**
JSX에서는 HTML의 `class` 속성을 사용할 수 **없으며**, 대신 `className`을 사용해야 합니다. 이는 JavaScript에서 `class`가 예약어이기 때문입니다.

#### **예제**
```jsx
const element = <h1 className="title">Hello, React!</h1>;
```

#### **동적 클래스 이름**
JavaScript 표현식을 사용하여 동적으로 클래스 이름을 설정할 수 있습니다.
```jsx
const isActive = true;
const element = <div className={isActive ? "active" : "inactive"}>Dynamic Class</div>;
```

---

### **4. 인라인 스타일 작성법**
JSX에서 인라인 스타일은 JavaScript 객체를 사용하여 정의합니다. CSS 속성은 camelCase로 작성해야 합니다.

#### **기본 예제**
```jsx
const element = <h1 style={{ color: "blue", fontSize: "20px" }}>Hello, Style!</h1>;
```

#### **스타일 객체 활용**
스타일 객체를 만들어 재사용성을 높일 수 있습니다.
```jsx
const headerStyle = {
  color: "white",
  backgroundColor: "blue",
  padding: "10px",
};

const element = <h1 style={headerStyle}>Styled Header</h1>;
```

#### **동적 스타일**
컴포넌트 상태나 props를 기반으로 동적으로 스타일을 설정할 수 있습니다.
```jsx
function Notification({ type }) {
  const styles = {
    success: { color: "green" },
    error: { color: "red" },
    warning: { color: "orange" },
  };

  return <p style={styles[type]}>This is a {type} message.</p>;
}
```

**주의**:
- 숫자 값은 기본적으로 픽셀 단위로 적용됩니다. 다른 단위를 사용할 경우 문자열로 명시해야 합니다[6][9][13].
- CSS 속성 이름에 하이픈(`-`)이 포함된 경우 camelCase로 변환해야 합니다(예: `background-color` → `backgroundColor`).

---

### **5. 실습 예제**

#### **주석 처리 실습**
```jsx
function App() {
  return (
    <div>
      {/* 이 컴포넌트는 제목을 렌더링합니다 */}
      <h1>React 주석 처리</h1>
    </div>
  );
}
```

#### **`className` 실습**
```jsx
function App() {
  return (
    <div className="container">
      <h1 className="title">React ClassName Example</h1>
    </div>
  );
}
```

#### **인라인 스타일 실습**
```jsx
function App() {
  const boxStyle = {
    width: "100px",
    height: "100px",
    backgroundColor: "yellow",
    borderRadius: "10px",
  };

  return (
    <div>
      <div style={boxStyle}></div>
    </div>
  );
}
```
