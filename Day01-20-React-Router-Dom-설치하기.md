# React Router DOM 환경설정

- React Router DOM을 사용하여 React Navigation의 주요 기능을 웹 환경에서 실습해봅시다.
---

### **React Router DOM 설치**
```bash
npm install react-router-dom
```
---

### **기본 설정**

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

function Home() {
  return <h1>Home Page</h1>;
}

function Details() {
  return <h1>Details Page</h1>;
}

export default App;
```

### **Test**
- 메인 페이지: http://localhost:3000/
- `details` 페이지: http://localhost:3000/details
