# 🔢 React 카운터 앱 만들기 단계별 가이드

## 📁 1단계: 프로젝트 구조 생성
```sh
# 프로젝트 폴더 생성
mkdir 01_counter
cd 01_counter

# React 프로젝트 생성
npx create-react-app .
```

## 📝 2단계: App.js 수정
````javascript
import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>React Counter App</h1>
      <div className="counter-container">
        <button onClick={() => setCount(count - 1)}>-</button>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );
}

export default App;
````

## 🎨 3단계: App.css 스타일링
````css
.App {
  text-align: center;
  padding: 50px;
}

.counter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #0056b3;
}

span {
  font-size: 24px;
  font-weight: bold;
  min-width: 50px;
}
````

## 🚀 4단계: 실행 및 테스트
```sh
# 개발 서버 시작
npm start
```

## 🔄 5단계: 기능 개선 (선택사항)
````javascript
import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="App">
      <h1>React Counter App</h1>
      <div className="counter-container">
        <button onClick={decrement}>-</button>
        <span>{count}</span>
        <button onClick={increment}>+</button>
      </div>
      <button className="reset-button" onClick={reset}>Reset</button>
    </div>
  );
}

export default App;
````

## ✨ 추가 스타일 (선택사항)
````css
/* 기존 CSS에 추가 */
.reset-button {
  margin-top: 20px;
  background-color: #dc3545;
}

.reset-button:hover {
  background-color: #c82333;
}
````

## 📌 주요 개념 설명
1. `useState` Hook을 사용하여 카운터 상태 관리
2. 이벤트 핸들러로 상태 업데이트
3. CSS를 사용한 기본 스타일링
4. 컴포넌트 기반 구조

