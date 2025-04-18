
# React Navigation - Stack Navigation과 Tab Navigation
Stack Navigation은 화면 간의 깊이 있는 이동(예: 로그인 → 상세 페이지)을 처리하며, Tab Navigation은 화면 하단 탭을 통해 평행적인 화면 간 전환을 제공합니다.

## Stack Navigation (React Router DOM)
React Router DOM에서는 `<Routes>`와 `<Route>`를 사용하여 Stack Navigation을 구현합니다.

```jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </Router>
  );
}
```
### 실전 예제제
```jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [stack, setStack] = useState([]); // 스택 상태 관리

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home stack={stack} setStack={setStack} />} />
        <Route path="/details" element={<Details stack={stack} setStack={setStack} />} />
        <Route path="/another" element={<AnotherPage stack={stack} setStack={setStack} />} />
      </Routes>
    </Router>
  );
}

function Home({ stack, setStack }) {
  const navigate = useNavigate();

  const goToDetails = () => {
    setStack([...stack, "/"]); // 현재 경로를 스택에 추가
    navigate("/details");
  };

  return (
    <div style={styles.page}>
      <h1>Home Page</h1>
      <button style={styles.button} onClick={goToDetails}>
        Go to Details
      </button>
    </div>
  );
}

function Details({ stack, setStack }) {
  const navigate = useNavigate();

  const goBack = () => {
    const prevRoute = stack.pop(); // 스택에서 이전 경로 가져오기
    setStack([...stack]); // 스택 업데이트
    if (prevRoute) navigate(prevRoute); // 이전 경로로 이동
  };

  return (
    <div style={styles.page}>
      <h1>Details Page</h1>
      <button style={styles.button} onClick={goBack}>
        Go Back
      </button>
    </div>
  );
}

function AnotherPage({ stack, setStack }) {
  const navigate = useNavigate();

  const goBack = () => {
    const prevRoute = stack.pop();
    setStack([...stack]);
    if (prevRoute) navigate(prevRoute);
  };

  return (
    <div style={styles.page}>
      <h1>Another Page</h1>
      <button style={styles.button} onClick={goBack}>
        Go Back
      </button>
    </div>
  );
}

// 간단한 스타일 정의
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
  },
};

export default App;
```

## Tab Navigation (React Router DOM)
Tab Navigation은 `<NavLink>`를 활용하여 구현할 수 있습니다.

```jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <NavLink
            to="/"
            style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Home
          </NavLink>
          <NavLink
            to="/details"
            style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Details
          </NavLink>
        </nav>
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details" element={<Details />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div style={styles.page}>
      <h1>Home Page</h1>
    </div>
  );
}

function Details() {
  return (
    <div style={styles.page}>
      <h1>Details Page</h1>
    </div>
  );
}

// 스타일 정의
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#282c34",
    padding: "10px",
  },
  link: {
    color: "#61dafb",
    textDecoration: "none",
    margin: "0 15px",
    fontSize: "18px",
  },
  activeLink: {
    color: "#ffffff",
    textDecoration: "underline",
    margin: "0 15px",
    fontSize: "18px",
  },
  content: {
    padding: "20px",
    textAlign: "center",
  },
  page: {
    backgroundColor: "#f5f5f5",
    padding: "50px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
};

```
