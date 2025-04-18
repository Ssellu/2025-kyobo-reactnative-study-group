
# 화면간 데이터 전달하기
## **1. route.params를 통한 화면 간 데이터 전달**
React Router DOM에서는 `useParams`를 사용하여 URL의 동적 데이터를 가져올 수 있습니다.

### 코드 예제
```jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/details/123">Go to Details with ID 123</Link>
    </div>
  );
}

function Details() {
  const { id } = useParams();
  return <h1>Details Page with ID: {id}</h1>;
}
```

---

## **2. 화면 전환 시 상태 관리와 prop 전달 흐름**
React Router DOM에서는 `useLocation`과 `state`를 활용하여 화면 간 데이터를 전달할 수 있습니다.

### 코드 예제
```jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const user = { name: "John", age: 30 };
  
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/details" state={user}>Go to Details</Link>
    </div>
  );
}

function Details() {
  const location = useLocation();
  const user = location.state;

  return (
    <div>
      <h1>Details Page</h1>
      {user && (
        <>
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
        </>
      )}
    </div>
  );
}
```
