# TODO앱 심화
## To-Do 앱의 기능적 요구사항

**1. 기본 구조 및 네비게이션**
- 탭 네비게이션 제공: "할 일" 탭과 "완료 항목" 탭으로 분리.

**2. 할 일(TO-DO) 관리**
- 할 일 목록 조회: 등록된 할 일들을 리스트 형태로 확인.
- 할 일 추가: 텍스트 입력, 날짜 선택, 우선순위(High/Medium/Low) 선택 후 새로운 할 일 등록.
- 할 일 완료/미완료 처리: 리스트에서 항목을 탭하면 완료 상태로 토글, 완료 시 텍스트에 취소선 표시 및 색상 변화.
- 할 일 삭제: 스와이프 제스처를 통해 할 일 항목 삭제 기능 제공.
- 할 일 우선순위 표시: 각 할 일 항목에 우선순위(High/Medium/Low) 시각적으로 표시.
- 할 일 마감일 표시: 날짜가 지정된 경우 리스트에서 날짜 정보 표시.

**3. 완료 항목 관리**
- 완료된 할 일만 별도 탭에서 조회.
- 완료된 할 일 삭제: 스와이프 제스처를 통해 완료 항목 삭제 기능 제공.

**4. 진행률(Progress) 표시**
- 헤더에 이번 달 할 일 완료율(프로그레스 바) 표시: 이번 달 할 일 또는 ASAP 항목 기준으로 완료율 계산 및 시각화.

**5. 기타 UX/UI**
- 할 일 추가 시 입력 폼 제공: 텍스트 입력, 날짜 선택(DateTimePicker), 우선순위 버튼 등.
- 할 일 목록 및 완료 항목 목록은 FlatList로 스크롤 가능하게 구현.
- 각 항목에 대해 스와이프 제스처 적용(삭제, 완료 등).

**6. 데이터 관리**
- 할 일 항목은 id, text, date, priority, completed 속성으로 관리.
- (예시 코드에는 없지만) 실제 서비스에서는 AsyncStorage 등 영속적 저장소 사용 가능.

---

### 실제 적용 예시

- **할 일 추가 예시**
  - "회의 준비"라는 텍스트, 날짜는 2025-04-25, 우선순위 High로 등록
- **할 일 완료 처리 예시**
  - "회의 준비" 항목을 탭하면 완료 처리, 텍스트에 취소선 표시
- **할 일 삭제 예시**
  - "회의 준비" 항목을 오른쪽으로 스와이프 후 "삭제" 버튼 탭
- **진행률 예시**
  - 이번 달 할 일 10개 중 7개 완료 시, 헤더에 "이번 달 완료율: 7/10" 및 프로그레스 바 표시

---


## 1. 프로젝트 설정 및 필수 라이브러리 설치

```bash
# Expo 프로젝트 생성
npx create-expo-app 03_TodoApp --template tabs
cd 03_TodoApp

# 필수 라이브러리 설치
npx expo install react-native-gesture-handler react-native-reanimated @react-navigation/bottom-tabs @expo/vector-icons react-native-progress @react-native-community/datetimepicker @react-native-async-storage/async-storage
```

## 2. 탭 네비게이션 설정 (app/(tabs)/_layout.tsx)

```jsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1E90FF' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '할 일',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list-ul" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: '완료 항목',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="check-square" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

## 3. 헤더 프로그레스 바 구현 (components/ProgressHeader.jsx)

```jsx
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';

export default function ProgressHeader({ todos }) {
  const currentMonth = new Date().getMonth();
  const relevantTodos = todos.filter(todo => 
    todo.date?.getMonth() === currentMonth || todo.label === 'ASAP'
  );
  const completedCount = relevantTodos.filter(t => t.completed).length;
  const total = relevantTodos.length;

  return (
    <View style={{ padding: 15 }}>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        이번 달 완료율: {completedCount}/{total}
      </Text>
      <Progress.Bar 
        progress={total > 0 ? completedCount / total : 0} 
        width={200} 
        color="#1E90FF"
      />
    </View>
  );
}
```
## 4. To-Do 항목 컴포넌트 (app/components/ToDoItem.jsx)

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TodoItem({ item }) {
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          item.completed && styles.completedText
        ]}
      >
        {item.text}
      </Text>
      <Text style={styles.priority}>{item.priority}</Text>
      {item.date && (
        <Text style={styles.date}>
          {item.date instanceof Date
            ? item.date.toLocaleDateString()
            : new Date(item.date).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  priority: {
    marginHorizontal: 10,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
});

```

## 5. To-Do 항목 관리 기능 (app/(tabs)/index.jsx)

```jsx
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Swipeable } from 'react-native-gesture-handler';
import ProgressHeader from '../../components/ProgressHeader';

export default function TodoScreen() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState('Medium');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: input,
          date,
          priority,
          completed: false,
        },
      ]);
      setInput('');
    }
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const RightActions = ({ onDelete }) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        padding: 20,
      }}
      onPress={onDelete}
    >
      <Text style={{ color: 'white' }}>삭제</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ProgressHeader todos={todos} />

      {/* 입력 폼 */}
      <TextInput
        style={{ padding: 15, borderBottomWidth: 1 }}
        placeholder="새 할 일 추가"
        value={input}
        onChangeText={setInput}
      />

      {/* 날짜 선택 */}
      <DateTimePicker
        value={date || new Date()}
        mode="date"
        onChange={(_, selectedDate) => setDate(selectedDate || null)}
      />

      {/* 우선순위 선택 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {['High', 'Medium', 'Low'].map((p) => (
          <Button
            key={p}
            title={p}
            color={priority === p ? '#1E90FF' : 'gray'}
            onPress={() => setPriority(p)}
          />
        ))}
      </View>

      <Button title="추가" onPress={addTodo} />

      {/* 할 일 목록 */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <RightActions onDelete={() => toggleComplete(item.id)} />
            )}
          >
            <TouchableOpacity
              style={{
                padding: 15,
                borderBottomWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => toggleComplete(item.id)}
            >
              <Text
                style={{
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                  color: item.completed ? 'gray' : 'black',
                }}
              >
                {item.text}
              </Text>
              <Text>{item.priority}</Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
}

```

## 6. 완료 항목 탭 구현 (app/(tabs)/completed.jsx)

```jsx
import { View, FlatList } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import TodoItem from '../../components/TodoItem';

export default function CompletedScreen({ todos, setTodos }) {
  const completedTodos = todos.filter(t => t.completed);

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={completedTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderLeftActions={() => (
              <TouchableOpacity 
                style={{ 
                  backgroundColor: 'red', 
                  justifyContent: 'center', 
                  padding: 20 
                }}
                onPress={() => deleteTodo(item.id)}
              >
                <Text>삭제</Text>
              </TouchableOpacity>
            )}
          >
            <TodoItem item={item} />
          </Swipeable>
        )}
      />
    </View>
  );
}
```

## 7. 배포 준비 및 실행

1. **EAS 빌드 설정**
```bash
npm install -g eas-cli
eas login
eas build:configure
```

2. **app.json 설정**
```json
{
  "expo": {
    "name": "TodoApp",
    "slug": "todo-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.todoapp",
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.yourcompany.todoapp",
      "versionCode": 1
    }
  }
}
```

3. **배포 명령어**
```bash
eas build --platform android  # 안드로이드 빌드
eas submit --platform android  # Play Store 제출

eas build --platform ios      # iOS 빌드
eas submit --platform ios     # App Store 제출
```
