# To-do 앱 심화 과정 (3시간 분량)

## 강의 목표
React를 활용하여 CRUD 기능이 포함된 To-do 리스트 앱을 완성합니다. 이 과정에서 사용자 입력 관리, 리스트 렌더링, 조건부 렌더링, 컴포넌트 분리 및 props 전달 방식을 학습하고 실습합니다.

---

## 1. 사전 준비: 앱 환경 설정 (30분)

### **1.1 React 프로젝트 생성**
```bash
npx create-react-app todo-app
cd todo-app
```

### **1.2 디렉토리 구조**
프로젝트 구조를 아래와 같이 구성합니다:
```
src/
├── components/
│   ├── TodoForm.js
│   ├── TodoItem.js
│   └── TodoList.js
├── App.js
└── index.css
```

---

## 2. To-do 앱 기본 구성 (1시간)

### **2.1 사용자 입력 관리**

#### `TodoForm.js` (입력 폼 컴포넌트)
```jsx
import React, { useState } from "react";

const TodoForm = ({ addTodo }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return; // 빈 입력 방지
    addTodo(input);
    setInput(""); // 입력 필드 초기화
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task"
        style={{ padding: "10px", width: "70%" }}
      />
      <button type="submit" style={{ padding: "10px" }}>
        Add
      </button>
    </form>
  );
};

export default TodoForm;
```

#### 주요 학습 포인트:
- **`useState`**로 입력값 상태 관리.
- `addTodo` 함수를 부모 컴포넌트에서 props로 전달받아 사용.

---

### **2.2 리스트 렌더링 및 조건부 렌더링**

#### `TodoItem.js` (개별 To-do 항목 컴포넌트)
```jsx
import React from "react";

const TodoItem = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />
      <p
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          marginLeft: "10px",
          flexGrow: 1,
        }}
      >
        {todo.text}
      </p>
      <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: "10px" }}>
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
```

#### 주요 학습 포인트:
- `props`를 통해 부모 컴포넌트에서 전달된 데이터를 표시.
- 조건부 렌더링(`textDecoration`)으로 완료된 항목을 시각적으로 구분.

---

### **2.3 리스트 컴포넌트**

#### `TodoList.js`
```jsx
import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, toggleComplete, deleteTodo }) => {
  if (todos.length === 0) {
    return <p>No tasks available. Add a task to get started!</p>;
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
```

#### 주요 학습 포인트:
- **리스트 렌더링**: `map()`을 사용해 각 항목을 렌더링.
- **조건부 렌더링**: 할 일이 없을 때 메시지 표시.

---

## 3. CRUD 기능 구현 및 상태 관리 (1시간)

### **3.1 CRUD 기능 통합**

#### `App.js`
```jsx
import React, { useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const App = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>To-do List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
    </div>
  );
};

export default App;
```

#### 주요 학습 포인트:
- **CRUD 기능 구현**:
  - Create: `addTodo` 함수로 새로운 항목 추가.
  - Read: `todos` 배열을 기반으로 리스트 렌더링.
  - Update: `toggleComplete` 함수로 완료 상태 토글.
  - Delete: `deleteTodo` 함수로 항목 삭제.

---

## 4. 컴포넌트 분리 및 Props 전달 방식 (30분)

### **4.1 Props 전달**
- 부모 컴포넌트(`App.js`)에서 자식 컴포넌트(`TodoForm`, `TodoList`, `TodoItem`)로 props를 전달하여 데이터와 이벤트를 공유합니다.

### **4.2 Props.children 사용**
#### 예제: 버튼 컴포넌트 생성
```jsx
const CustomButton = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: "10px", backgroundColor: "#007BFF", color: "#fff" }}>
      {children}
    </button>
  );
};

// 사용 예시:
<CustomButton onClick={() => console.log("Clicked!")}>Click Me</CustomButton>
```

---

## 요약 및 과제

### 요약
1. 사용자 입력 관리:
   - `useState`, `useRef`를 활용한 입력 폼 구성.
2. 리스트 렌더링 및 조건부 렌더링:
   - `map()`과 조건부 메시지 표시.
3. CRUD 기능 구현:
   - Create, Read, Update, Delete 기능 통합.
4. 컴포넌트 분리 및 props 전달:
   - 재사용 가능한 컴포넌트 설계와 props.children 활용.

### 과제
1. 완료된 항목만 필터링하여 표시하는 버튼 추가.
2. 로컬 스토리지에 To-do 데이터를 저장하고 불러오는 기능 구현.
3. 스타일링 라이브러리(예: Tailwind CSS 또는 Styled Components)를 사용해 UI 개선.

이 강의를 통해 React의 핵심 개념과 실무에서 필요한 기술을 종합적으로 학습할 수 있습니다! 🚀

