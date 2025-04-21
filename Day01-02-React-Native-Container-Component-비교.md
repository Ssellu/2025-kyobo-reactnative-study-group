# 🎨 RN의 Container와 Component
React Native도 React와 마찬가지로 **Container**와 **Component**를 구분짓고 있습니다.
**Container**와 **Component**는 역할에 따라 구분되는 컴포넌트 패턴입니다.     
이들은 관심사의 분리(Separation of Concerns)를 통해 코드의 가독성과 유지보수성을 높이는 데 도움을 줍니다.

## 1. Container와 Component의 차이점
### **핵심 차이점**

| 구분           | Component (프레젠테이션)         | Container (컨테이너)               |
|----------------|----------------------------------|-------------------------------------|
| 주요 역할      | UI 렌더링                        | 데이터 처리, 상태 관리              |
| 데이터 관리    | props로 전달받은 데이터만 사용   | 상태 관리, API 호출 등 데이터 처리  |
| 재사용성      | 높음                             | 상대적으로 낮음                    |
| 의존성        | 독립적                           | 외부 데이터, 비즈니스 로직과 연결  |
| 예시 작업      | 버튼, 입력창, 카드 등             | 이벤트 처리, 리덕스 상태 관리       |

#### 1. **Component (프레젠테이션 컴포넌트)**

- **역할**: UI를 그리는 데 집중하며, **화면에 보여지는 요소**를 정의합니다.
- **특징**:
  - 데이터 로직을 처리하지 않고, 필요한 데이터를 부모 컴포넌트로부터 `props`로 전달받아 사용합니다.
  - 대부분 자식 컴포넌트와 스타일을 포함하며, 애플리케이션의 나머지 부분에 의존하지 않습니다.
  - 재사용 가능한 UI 요소(예: 버튼, 입력창, 카드 등)를 만드는 데 사용됩니다.
- **예제**:
  ```jsx
  // components/MyButton.js
  import React from 'react';
  import { TouchableOpacity, Text, View } from 'react-native';

  const MyButton = ({ label, onPress, count }) => (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
      <Text>버튼을 {count}번 눌렀습니다.</Text>
    </View>
  );

  export default MyButton;

  ```


#### 2. **Container (컨테이너 컴포넌트)**
- **역할**: 데이터 처리 및 상태 관리를 담당하며, **비즈니스 로직**을 구현합니다.
- **특징**:
  - API와 연결되어 데이터를 가져오고, 이를 컴포넌트에 전달합니다.
  - 상태 관리 및 이벤트 처리를 수행하며, 컴포넌트의 동작을 제어합니다.
  - 일반적으로 UI를 직접 렌더링하지 않고, 다른 컴포넌트(프레젠테이션 컴포넌트)를 포함하여 데이터를 전달하는 역할을 합니다.
- **예제**:
  ```jsx
  // containers/MyButtonContainer.js
  import React, { useState } from 'react';
  import MyButton from '../components/MyButton';

  const MyButtonContainer = () => {
    const [count, setCount] = useState(0);

    const handlePress = () => setCount(count + 1);

    return (
      <MyButton
        label={`클릭 (${count})`}
        onPress={handlePress}
        count={count}
      />
    );
  };

  export default MyButtonContainer;

  ```
---

### **Container의 레이아웃 컴포넌트로서의 예시 (React Native)**

웹의 `<div className="container">...</div>`처럼, React Native에서는 `<View>`를 사용합니다.

```jsx
// components/Container.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Container = ({ children, style }) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default Container;
```

#### **사용 예시**

```jsx
// App.js
import React from 'react';
import Container from './components/Container';
import MyButtonContainer from './containers/MyButtonContainer';

export default function App() {
  return (
    <Container>
      <MyButtonContainer />
    </Container>
  );
}
```
- Container는 하위 컴포넌트(children)를 감싸 레이아웃을 잡는 역할을 하며, 스타일을 props로 커스터마이즈할 수 있습니다.

---
### 실전 예시 - 유저 정보를 받고, View로 표현하기
```jsx 
// AS-IS: 아래 내용을 Presentation Component와 Container Component로 분리하여 봅시다.
// containers/UserProfileContainer.js
import React, { useEffect, useState } from 'react';

const UserProfileContainerApp = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 예시: 유저 정보 fetch
    fetch('https://api.example.com/user/1')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return null;

  return (
    <View>
      <Image source={{ uri: user.avatar }} style={{ width: 100, height: 100 }} />
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
    </View>
  );
};

export default UserProfileContainerApp;
```

#### 답안 예시 
```jsx
// containers/UserProfileContainer.js
import React, { useEffect, useState } from 'react';
import UserProfile from '../components/UserProfile';

const UserProfileContainer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 예시: 유저 정보 fetch
    fetch('https://api.example.com/user/1')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return null;

  return <UserProfile user={user} />;
};

export default UserProfileContainer;

```
```jsx
// components/UserProfile.js
import React from 'react';
import { View, Text, Image } from 'react-native';

const UserProfile = ({ user }) => (
  <View>
    <Image source={{ uri: user.avatar }} style={{ width: 100, height: 100 }} />
    <Text>{user.name}</Text>
    <Text>{user.email}</Text>
  </View>
);

export default UserProfile;

```



---
### **정리**
- **Component(프레젠테이션 컴포넌트)**: UI만 담당, 재사용성 높음, 상태 관리 X, 오직 props로 동작.
- **Container(컨테이너 컴포넌트)**: 데이터 처리, 상태 관리, 비즈니스 로직 담당, 프레젠테이션 컴포넌트에 데이터 전달.
- React Native에서는 HTML 대신 **View**, **Text**, **TouchableOpacity** 등 네이티브 컴포넌트를 사용하며, 스타일은 StyleSheet 또는 인라인 스타일로 적용합니다.
- 이러한 패턴을 구분지어 개발하면 코드가 명확해지고, UI와 로직의 분리가 쉬워져 유지보수와 테스트가 용이해집니다.
