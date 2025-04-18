# 외부 API 호출 및 상태 관리 실습 자료

## 강의 목표
React에서 `fetch`와 `Axios`를 활용하여 외부 API를 호출하고, 실시간 데이터 로딩 및 에러 핸들링을 구현합니다. 또한, Context API를 사용하여 전역 상태를 관리하는 방법을 학습합니다.

---

## 1. 외부 API 호출 실습: `fetch` 사용

### **기본 GET 요청**
`fetch`를 사용해 데이터를 가져오는 방법을 실습합니다.

#### 코드 예제:
```jsx
import React, { useState, useEffect } from "react";

const FetchExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export default FetchExample;
```

### **주요 학습 포인트**
- `fetch()`로 API 호출.
- `.json()`을 사용하여 응답을 JavaScript 객체로 변환.
- 에러 핸들링: 네트워크 오류와 HTTP 상태 코드 처리.

---

## 2. Axios 도구 소개 및 차이점

### **Axios 설치**
```bash
npm install axios
```

### **Axios 기본 GET 요청**
Axios는 데이터를 자동으로 JSON 형식으로 변환하며, 에러 핸들링이 간단합니다.

#### 코드 예제:
```jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AxiosExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export default AxiosExample;
```

### **Axios와 Fetch의 차이점**
| 특징                 | Fetch API                              | Axios                                |
|----------------------|----------------------------------------|--------------------------------------|
| JSON 변환           | 수동으로 `.json()` 호출 필요       | 자동으로 JSON 변환          |
| 에러 핸들링         | 네트워크 오류만 처리 가능          | HTTP 상태 코드까지 처리 가능    |
| 요청 취소           | `AbortController` 필요               | 내장된 요청 취소 기능 제공       |

---

## 3. 실시간 사용자 데이터 로딩 처리

### **실시간 데이터 로딩**
사용자가 입력한 데이터를 서버에 저장하고 로딩 상태를 표시합니다.

#### 코드 예제:
```jsx
import React, { useState } from "react";
import axios from "axios";

const RealTimeData = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        { name }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Submitting...</p>}
    </div>
  );
};

export default RealTimeData;
```

```jsx
const App = () => {
  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  // 유저 리스트 불러오기
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 유저 추가
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://dummyjson.com/users/add", {
        firstName,
        lastName,
        age: Number(age)
      });
      await fetchUsers(); // 추가 후 리스트 다시 불러오기
      setFirstName("");
      setLastName("");
      setAge("");
    } catch (error) {
      console.error("Error adding user:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="Age"
          type="number"
        />
        <button type="submit">Add User</button>
      </form>
      {loading && <p>Submitting...</p>}
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.firstName} {user.lastName} ({user.age})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

```

---

## 4. Context API를 이용한 전역 상태 관리

### **Context API 설정**
`useContext`를 사용해 전역 상태를 관리합니다.

#### 코드 예제:
```jsx
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const UserProfile = () => {
  const { user } = useContext(UserContext);

  return user ? <p>Welcome, {user.name}!</p> : <p>No user logged in.</p>;
};

const LoginForm = () => {
  const { setUser } = useContext(UserContext);

  const handleLogin = () => {
    setUser({ name: "John Doe" });
  };

  return <button onClick={handleLogin}>Login</button>;
};

const App = () => (
  <UserProvider>
    <UserProfile />
    <LoginForm />
  </UserProvider>
);

export default App;
```

### **주요 학습 포인트**
- `createContext`로 Context 생성.
- `useContext`로 전역 상태 접근.
- Context Provider를 통해 상태 공유.

---

## 요약 및 과제

### **요약**
1. `fetch`와 Axios를 활용한 API 호출.
2. 로딩 상태 및 에러 핸들링 구현.
3. Context API로 전역 상태 관리.

### **과제**
1. Axios의 요청 취소 기능을 사용해 불필요한 API 호출을 막아보세요.
2. Context API를 확장하여 사용자 인증 상태를 관리해보세요.
