## 4. Todo List 실습 프로젝트  
### 상태 관리 흐름도
```
AddTodoScreen → (navigate with params) → TodoListScreen
       ↑                                  ↓ 
       └───── (state update callback) ────┘
```
🔥 **업그레이드된 Todo List 실습 프로젝트** (JavaScript 버전)

---

### 🚀 개선된 기능 목록
- **플로팅 액션 버튼** 추가
- **스와이프 삭제** 기능 구현
- **풀다운 리프레시** 기능
- AsyncStorage 자동 동기화
- 아이콘 기반 완료 상태 표시

---

### 1. 주요 구현 코드

#### **전체 구조**
```javascript
// App.js
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoProvider from './context/TodoContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TodoProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={TodoListScreen} />
          <Stack.Screen name="AddTodo" component={AddTodoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}
```

---

## 2. 컨텍스트 기반 상태 관리
```jsx
// context/TodoContext.js
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TodoContext = createContext();

export default function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);

  // AsyncStorage 동기화
  const loadTodos = async () => {
    const saved = await AsyncStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  };

  const saveTodos = async (newTodos) => {
    await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  useEffect(() => { loadTodos(); }, []);

  return (
    <TodoContext.Provider value={{ todos, saveTodos }}>
      {children}
    </TodoContext.Provider>
  );
}
```

---

## 3. 화면 컴포넌트 구현
```jsx
// TodoListScreen.jsx
import { useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { TodoContext } from '../context/TodoContext';

export default function TodoListScreen() {
  const { todos, saveTodos } = useContext(TodoContext);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // 풀다운 리프레시
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTodos().then(() => setRefreshing(false));
  }, []);

  // 스와이프 삭제 UI
  const RightActions = ({ id }) => (
    <TouchableOpacity 
      style={{ backgroundColor: 'red', justifyContent: 'center', width: 70 }}
      onPress={() => saveTodos(todos.filter(item => item.id !== id))}
    >
      <Icon name="delete" size={30} color="white" style={{ alignSelf: 'center' }} />
    </TouchableOpacity>
  );

  // Todo 항목 렌더링
  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => <RightActions id={item.id} />}>
      <View style={{ 
        flexDirection: 'row', 
        padding: 15, 
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee'
      }}>
        <TouchableOpacity
          onPress={() => {
            const updated = todos.map(todo => 
              todo.id === item.id ? {...todo, completed: !todo.completed} : todo
            );
            saveTodos(updated);
          }}
        >
          <Icon 
            name={item.completed ? 'check-circle' : 'radio-button-unchecked'} 
            size={24} 
            color={item.completed ? '#4CAF50' : '#666'} 
          />
        </TouchableOpacity>
        <Text style={{ 
          marginLeft: 10, 
          fontSize: 18,
          textDecorationLine: item.completed ? 'line-through' : 'none',
          color: item.completed ? '#888' : '#000'
        }}>
          {item.text}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          backgroundColor: '#2196F3',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5
        }}
        onPress={() => navigation.navigate('AddTodo')}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
```

---

#### 4. 할일 추가 화면
```jsx
// AddTodoScreen.jsx
import { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { TodoContext } from '../context/TodoContext';

export default function AddTodoScreen({ navigation }) {
  const [text, setText] = useState('');
  const { todos, saveTodos } = useContext(TodoContext);

  const handleAdd = () => {
    if (text.trim()) {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false
      };
      saveTodos([...todos, newTodo]);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="새 할일을 입력하세요"
        value={text}
        onChangeText={setText}
        autoFocus
      />
      <Button 
        title="추가" 
        onPress={handleAdd} 
        color="#2196F3" 
        disabled={!text.trim()} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5
  }
});
```

---

## 🛠 추가 설치 패키지
```bash
npx expo install @react-native-async-storage/async-storage react-native-gesture-handler react-native-vector-icons
```

---

## ✨ 주요 기능 설명
1. **제스처 컨트롤**: react-native-gesture-handler로 자연스러운 스와이프 삭제 구현
2. **자동 동기화**: AsyncStorage와 연동해 앱 재시작 시 데이터 유지
3. **시각적 피드백**: 
   - 완료 항목 회색 처리 및 취소선
   - 플로팅 버튼에 Material 아이콘 적용
   - 삭제 시 즉각적인 애니메이션
4. **UX 개선**:
   - 풀다운 새로고침
   - 입력 필드 자동 포커스
   - 빈 입력 방지 처리

---