# 🎨 React의 주요 UI 컴포넌트

## 1. 🔳 카드 컴포넌트
```jsx
// 03-프로젝트\00_hello_react\src\components\Day01_02_Components.jsx
import React from 'react'
import '../styles/Day01_02_Components.css'  // 이 부분!

export function Card( {title, content}) {
  return (
    <div className="Card">
        <h2 className="card-title">{title}</h2>
        <p className="card-content">{content}</p>
    </div>
  )
}
```
```jsx
// 03-프로젝트\00_hello_react\src\Day01_02_App.js
import React from 'react';
import { Card } from './components/Day01_02_Components';


export default function App({title, content}) {
    return (
        <div className="App">
            <Card title="안녕하세요" content="리액트에 오신 것을 환영합니다." />
            <Card title={title} content={content} />
        </div>
    );
}
```
```jsx
// 03-프로젝트\00_hello_react\src\index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './Day01_02_App';  // 이 부분!

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App title="Hello, React!" content="React is fun!" />  {/* 이 부분! */}
  </React.StrictMode>
);
reportWebVitals();

```
### 스타일 추가
```css
/* 03-프로젝트\00_hello_react\src\styles\Day01_02_Components.css */
/* Card 컴포넌트 스타일 */
.Card {
    background-color: #ffffff; /* 카드 배경색 */
    border-radius: 10px; /* 모서리를 둥글게 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
    padding: 20px; /* 내부 여백 */
    margin: 15px; /* 외부 여백 */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* 호버 효과를 위한 트랜지션 */
  }
  
  /* 카드 호버 효과 */
  .Card:hover {
    transform: translateY(-5px); /* 약간 위로 올라가는 효과 */
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* 그림자 강조 */
  }
  
  /* 제목 스타일 */
  .card-title {
    font-size: 1.5rem; /* 제목 글꼴 크기 */
    font-weight: bold; /* 굵은 텍스트 */
    color: #333333; /* 제목 글씨 색상 */
    margin-bottom: 10px; /* 아래 여백 */
  }
  
  /* 내용 스타일 */
  .card-content {
    font-size: 1rem; /* 내용 글꼴 크기 */
    color: #555555; /* 내용 글씨 색상 */
    line-height: 1.6; /* 줄 간격 */
  }
  
```
---
## 2. 🔘 버튼 컴포넌트
````jsx
// 03-프로젝트\00_hello_react\src\components\Day01_02_Components.jsx
export function Button({ onClick, children, variant = 'primary' }) {
  return (
    <button 
      className={`button ${variant}`} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}
````

```css
/* 03-프로젝트\00_hello_react\src\styles\Day01_02_Components.css */
/* 공통 버튼 스타일 */
.button {
  padding: 10px 20px; /* 버튼 내부 여백 */
  font-size: 16px; /* 글꼴 크기 */
  font-weight: bold; /* 글꼴 굵기 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 둥근 모서리 */
  cursor: pointer; /* 마우스 포인터 변경 */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* 호버 효과 */
}

/* Primary 버튼 스타일 */
.button.primary {
  background-color: #007bff; /* 파란색 배경 */
  color: white; /* 흰색 글씨 */
}

.button.primary:hover {
  background-color: #0056b3; /* 어두운 파란색 배경 */
}

/* Secondary 버튼 스타일 */
.button.secondary {
  background-color: #6c757d; /* 회색 배경 */
  color: white;
}

.button.secondary:hover {
  background-color: #5a6268; /* 어두운 회색 배경 */
}

/* Danger 버튼 스타일 */
.button.danger {
  background-color: #dc3545; /* 빨간색 배경 */
  color: white;
}

.button.danger:hover {
  background-color: #a71d2a; /* 어두운 빨간색 배경 */
}

/* 버튼 클릭 시 효과 (살짝 눌리는 느낌) */
.button:active {
  transform: scale(0.95); /* 크기를 살짝 줄임 */
}

/* 버튼 그룹 정렬 */
.button-group {
  display: flex;
  gap: 10px; /* 버튼 간격 */
}
```
```jsx
// 03-프로젝트\00_hello_react\src\Day01_02_App.js
import React from 'react';
import { Button } from './components/Day01_02_Components';


export default function App({title, content}) {
    const handleClick = (variant) => {
        alert(`${variant} 버튼이 클릭되었습니다!`);
    }

    return (
        <div className="App">
            <div className="button-group">
                <Button onClick={() => handleClick('Primary')} variant="primary">
                Primary 버튼
                </Button>
                <Button onClick={() => handleClick('Secondary')} variant="secondary">
                Secondary 버튼
                </Button>
                <Button onClick={() => handleClick('Danger')} variant="danger">
                Danger 버튼
                </Button>
            </div>
        </div>
    );
}
```

## 3. 📝 입력 필드 컴포넌트
````jsx
import React from 'react';

export const Input = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text' 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input-field"
    />
  );
};
````

### 컴포턴트 안에 컴포넌트 넣기 예시
````jsx

function App() {
  const [inputValue, setInputValue] = useState('');

  return (
    <Container>
      <Card 
        title="입력 예시" 
        content={
          <>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="텍스트를 입력하세요"
            />
            <Button onClick={() => alert(inputValue)}>
              확인
            </Button>
          </>
        }
      />
    </Container>
  );
}

export default App;
````
---
## 4. 📜 스크롤뷰 컴포넌트
```jsx
import React from 'react';

export const ScrollView = ({ 
    children, 
    height = '300px',
    width = '100%'
}) => {
    return (
        <div
            style={{
                overflowY: 'auto',
                height,
                width
            }}
            className="scroll-view"
        >
            {children}
        </div>
    );
};
```
---

## 5. 📦 **Modal 컴포넌트**
- 모달은 사용자에게 중요한 정보를 보여주거나, 특정 작업을 수행하도록 요구할 때 사용.
- 사용자 상호작용을 위한 필수적인 UI 요소.

### 코드 예제:
```jsx
import React from 'react';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
        {children}
      </div>
    </div>
  );
};
```

### 사용 예제:
```jsx
import React, { useState } from 'react';
import { Modal } from './Modal';

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>모달 열기</button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2>모달 내용</h2>
        <p>여기에 중요한 메시지를 표시합니다.</p>
      </Modal>
    </div>
  );
};
```

---

## 7. 🖼 **Image 컴포넌트**
- 이미지를 렌더링하고, 크기나 스타일을 쉽게 조정할 수 있는 컴포넌트.
- 다양한 UI에서 이미지 렌더링은 필수적이며, 스타일링을 쉽게 처리할 수 있음.
- `props`를 통해 크기와 레이아웃을 유연하게 조정 가능.
  
### 코드 예제:
```jsx
import React from 'react';

export const Image = ({ src, alt, width = '100%', height = 'auto' }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ width, height }} 
      className="image"
    />
  );
};
```

### 사용 예제:
```jsx
<Image 
  src="https://via.placeholder.com/150" 
  alt="샘플 이미지" 
  width="150px" 
  height="150px" 
/>
```
---

## 8. 📊 **ProgressBar 컴포넌트**

- 작업 상태를 시각적으로 표시하거나 진행률을 나타낼 때 사용.
- 로딩 화면이나 업로드 상태를 보여줄 때 유용함.
### 코드 예제:
```jsx
import React from 'react';

export const ProgressBar = ({ progress, color = 'blue' }) => {
  return (
    <div className="progress-bar-container" style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
      <div 
        className="progress-bar" 
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          height: '10px',
          borderRadius: '5px'
        }}
      ></div>
    </div>
  );
};
```

### 사용 예제:
```jsx
<ProgressBar progress={70} color="green" />
```
---

## 9. 📁 **Accordion 컴포넌트**

- 접이식 메뉴를 제공하여 정보를 그룹화하고 사용자 인터페이스를 간결하게 유지.
- 정보를 그룹화하고 UI를 간결하게 유지.
- FAQ 페이지나 상세 정보 제공에 자주 사용됨.

### 코드 예제:
```jsx
import React, { useState } from 'react';

export const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};
```

### 사용 예제:
```jsx
<Accordion title="자세히 보기">
  <p>여기에 숨겨진 내용을 표시합니다.</p>
</Accordion>
```
---

## 📌 주요 특징
- 재사용 가능한 컴포넌트 구조
- Props를 통한 유연한 커스터마이징
- 일관된 디자인 시스템
- 모듈화된 스타일링

## 🔧 사용 방법
1. 컴포넌트 파일들을 `src/components` 폴더에 생성
2. CSS 파일을 `src/styles` 폴더에 생성
3. 필요한 곳에서 import하여 사용

## 💡 추가 팁
- TypeScript를 사용하는 경우 Props 타입을 정의하면 더 안전한 개발 가능
- styled-components나 Emotion을 사용하여 CSS-in-JS 스타일링도 가능
- Material-UI나 Chakra UI 같은 UI 라이브러리와 함께 사용 가능

