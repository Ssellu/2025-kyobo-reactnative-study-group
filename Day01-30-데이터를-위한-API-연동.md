# 외부 API 호출 및 상태 관리 실습 자료

React에서 `fetch`와 `Axios`를 활용하여 외부 API를 호출하고, 실시간 데이터 로딩 및 에러 핸들링을 구현해봅시다.    
또한, Context API를 사용하여 전역 상태를 관리하는 방법을 학습해봅시다.

---

## 1. 외부 API 호출 실습: `fetch` 사용

### **기본 GET 요청**
`fetch`를 사용해 데이터를 가져오는 방법을 실습합니다.

#### 코드 예제:
```jsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";

export default App = () => {
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

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
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

export default App = () => {
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
```
### **Axios와 Fetch의 차이점**
- **Axios**: JSON 자동 변환, HTTP 에러 자동 처리, 요청 취소 등 편의 기능이 많아 복잡한 프로젝트에 유리함.
- **Fetch**: 브라우저 내장, 가볍고 별도 설치 필요 없음. 네트워크 오류만 catch되며, HTTP 에러는 직접 처리해야 함.
실제 프로젝트에서는 요구사항(예: 요청 취소, 에러 처리, 추가 기능 등)에 따라 선택하면 됩니다.  
React Native에서는 fetch가 기본 내장되어 있어 업데이트 호환성이 좋고, axios는 추가 기능이 필요할 때 주로 사용됩니다.

| 특징                 | Fetch API                                   | Axios                                      |
|----------------------|---------------------------------------------|--------------------------------------------|
| JSON 변환            | 수동으로 `.json()` 호출 필요                | 자동으로 JSON 변환 (`response.data`)        |
| 에러 핸들링          | 네트워크 오류만 catch, HTTP 오류는 직접 처리 | HTTP 상태 코드(400, 500 등)까지 catch 가능  |
| 요청 취소            | `AbortController` 필요                      | 내장된 요청 취소 기능(`CancelToken`) 제공   |
| 설치 필요 여부       | 브라우저 내장, 별도 설치 불필요              | 별도 설치 필요 (`npm install axios`)        |
| 추가 기능            | 기본 기능만 제공                             | 응답 시간 초과, 인터셉터 등 부가 기능 풍부  |
| 데이터 전송 방식     | body에 직접 string 변환 필요                 | 객체로 바로 전달 가능                      |

---

#### **예시 코드 비교**

**Fetch 예시**
```js
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => {
    if (!response.ok) throw new Error('HTTP error');
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

**Axios 예시**
```js
import axios from 'axios';

axios.get('https://jsonplaceholder.typicode.com/posts')
  .then(response => console.log(response.data))
  .catch(error => console.log(error));
```

---

## 3. 실시간 사용자 데이터 로딩 처리

### **실시간 데이터 로딩**
사용자가 입력한 데이터를 서버에 저장하고 로딩 상태를 표시합니다.

#### 코드 예제:
```jsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

const RealTimeData = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Submitting...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loading: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 10,
    color: "#666",
  },
});

export default RealTimeData;
```

```jsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

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
  const handleSubmit = async () => {
    if (!firstName || !lastName || !age) return;
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
    <View style={styles.container}>
      {/* 유저 추가 폼 */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Submitting...</Text>
          </View>
        )}
      </View>
      {/* 유저 리스트 */}
      <Text style={styles.title}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>
              {item.firstName} {item.lastName} ({item.age})
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  form: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
});

export default App;

```
---

## 4. Context API를 이용한 전역 상태 관리

### **Context API 설정**
`useContext`를 사용해 전역 상태를 관리합니다.

#### 코드 예제:
```jsx
import React, { createContext, useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// 1. Context 생성
const UserContext = createContext();

// 2. Provider 컴포넌트
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. UserProfile 컴포넌트
const UserProfile = () => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.profileBox}>
      {user ? (
        <Text style={styles.welcome}>Welcome, {user.name}!</Text>
      ) : (
        <Text style={styles.noUser}>No user logged in.</Text>
      )}
    </View>
  );
};

// 4. LoginForm 컴포넌트
const LoginForm = () => {
  const { setUser } = useContext(UserContext);

  const handleLogin = () => {
    setUser({ name: "John Doe" });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  );
};

// 5. App 컴포넌트
const App = () => (
  <UserProvider>
    <View style={styles.container}>
      <UserProfile />
      <LoginForm />
    </View>
  </UserProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  profileBox: {
    marginBottom: 24,
  },
  welcome: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  noUser: {
    fontSize: 16,
    color: "#999",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;

```

