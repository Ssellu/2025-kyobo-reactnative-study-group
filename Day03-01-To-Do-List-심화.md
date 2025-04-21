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
- 실제 서비스에서는 AsyncStorage 등 영속적 저장소 사용 가능.

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

## 2. TodoItem Presentation 컴포넌트 생성 (components\ToDoItem.jsx)
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TodoItem({ item }) {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.text,
                        item.completed && styles.completedText
                    ]}
                >
                    {item.text}
                </Text>
                {item.date && (
                    <Text style={styles.date}>
                        {item.date instanceof Date
                            ? item.date.toLocaleDateString()
                            : new Date(item.date).toLocaleDateString()}ㄴㄴ
                    </Text>
                )}
            </View>
            <Text style={styles.priority}>{item.priority}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
    priority: {
        color: '#FF6347',
        fontWeight: 'bold',
        fontSize: 14,
    },
    date: {
        color: '#888',
        fontSize: 12,
        marginTop: 5,
    },
});

```
## 3. 진행률을 위한 ProgressBar 컴포넌트 생성 (components\ProgressHeader.jsx)
```jsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import CongratulationsModal from './CongratulationsModal';

export default function ProgressHeader({ todos }) {
  const [showModal, setShowModal] = useState(false);
  const currentMonth = new Date().getMonth();
  
  const relevantTodos = todos.filter(todo => {
    if (!todo.date) return true;
    const todoDate = new Date(todo.date);
    return todoDate.getMonth() === currentMonth;
  });

  const completedCount = relevantTodos.filter(t => t.completed).length;
  const total = relevantTodos.length;
  const progress = total > 0 ? completedCount / total : 0;

  useEffect(() => {
    if (total > 0 && completedCount === total) {
      setShowModal(true);
    }
  }, [completedCount, total]);

  return (
    <View style={{ padding: 15 }}>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        이번 달 완료율: {completedCount}/{total}
      </Text>
      <Progress.Bar 
        progress={progress}
        width={200} 
        color="#1E90FF"
      />
      <CongratulationsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}
```
## 4. 이번 달 할일 모두 달성 시 축하 알림 Modal 컴포넌트 생성 (components\CongratulationsModal.jsx)
```jsx
import React from 'react';
import { Modal, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CongratulationsModal({ visible, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Ionicons name="trophy" size={60} color="#FFD700" />
          <Text style={styles.modalTitle}>축하합니다! 🎉</Text>
          <Text style={styles.modalText}>이번 달 목표를 모두 달성했어요!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginVertical: 15,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
```
## 5. Context 생성 (contexts\TodoContext.js)
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context with initial value
const TodoContext = createContext({
  todos: [],
  saveTodos: () => {}
});

// Custom hook to use the todo context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

// Provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem('todos');
        if (savedTodos) {
          setTodos(JSON.parse(savedTodos));
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };
    loadTodos();
  }, []);

  const saveTodos = async (newTodos) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, saveTodos }}>
      {children}
    </TodoContext.Provider>
  );
};
```
## 6. 탭 네비게이션 설정 (app/(tabs)/_layout.tsx)
```jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { TodoProvider } from '../../contexts/TodoContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TodoProvider>
        <Tabs screenOptions={{ tabBarActiveTintColor: '#1E90FF' }}>
          <Tabs.Screen
            name="index"
            options={{ title: '할 일' }}
          />
          <Tabs.Screen
            name="completed"
            options={{ title: '완료 항목' }}
          />
        </Tabs>
      </TodoProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
```
## 7. 메인: To-Do 항목 추가 및 관리 탭 (app/(tabs)/index.jsx)
```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Swipeable } from 'react-native-gesture-handler';
import ProgressHeader from '../../components/ProgressHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTodos } from '../../contexts/TodoContext';

// Storage 유틸리티 함수
const storage = {
  setItem(key, value) {
    try {
      AsyncStorage.setItem(key, JSON.stringify(value));
      console.log('Saved to storage:', value); // 디버깅용
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }
};

export default function TodoScreen() {
  const [input, setInput] = useState('');
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState('Medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { todos, saveTodos } = useTodos();
  
  // Load todos from storage when component mounts
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await storage.getItem('todos');
        if (storedTodos) {
          saveTodos(storedTodos);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };
    loadTodos();
  }, []);

  // Save todos to storage when they change
  useEffect(() => {
    if (todos && todos.length >= 0) {
      storage.setItem('todos', todos);
    }
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      saveTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: input,
          date: date ? date.toISOString() : null,  // Date 객체를 ISO 문자열로 저장
          priority,
          completed: false,
        },
      ]);
      setInput('');
      setDate(null);
    }
  };
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS는 picker가 계속 떠있음
    if (selectedDate) setDate(selectedDate);
  };

  const toggleComplete = (id) => {
    saveTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    saveTodos(todos.filter(todo => todo.id !== id));
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

  // 날짜순 정렬 함수
  const sortedTodos = useMemo(() => { 
      return [...(todos || [])].sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : null;
        const dateB = b.date ? new Date(b.date) : null;

        // 날짜가 모두 없는 경우: 우선순위로 정렬
        if (!dateA && !dateB) {
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // 날짜가 하나만 있는 경우
        if (!dateA) return 1;
        if (!dateB) return -1;

        // 날짜 기준 정렬
        return dateA - dateB;
    })
  }, [todos]);

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

      {/* 날짜 선택 버튼 (웹/앱 분기 처리*/}
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={date ? date.toISOString().substring(0, 10) : ''}
          onChange={e => setDate(new Date(e.target.value))}
          style={{ padding: 10, margin: 10, borderRadius: 5 }}
        />
      ) : (
        <>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text>{date ? date.toLocaleDateString() : '날짜 선택'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </>
      )}

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
        data={sortedTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <RightActions onDelete={() => deleteTodo(item.id)} />
            )}
          >
            <TouchableOpacity
              style={{
                padding: 15,
                borderBottomWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => toggleComplete(item.id)}
            >
              <View style={{ flex: 2 }}>
                <Text
                  style={{
                    textDecorationLine: item.completed ? 'line-through' : 'none',
                    color: item.completed ? 'gray' : 'black',
                    fontSize: 16,
                  }}
                >
                  {item.text}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ 
                  color: item.priority === 'High' ? 'red' : 
                        item.priority === 'Medium' ? 'orange' : 'green' 
                }}>
                  {item.priority}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: 'gray' }}>
                  {item.date ? new Date(item.date).toLocaleDateString() : 'ASAP'}
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  sortButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeSortButton: {
    backgroundColor: '#1E90FF',
  },
  sortButtonText: {
    color: '#333',
  },
  activeSortButtonText: {
    color: 'white',
  },
  dateButton: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
});
```
## 8. 추가 탭: To-Do 완료 항목 보기 및 관리 탭 구현 (app/(tabs)/completed.jsx)
```jsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';  // 아이콘 추가
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTodos } from '../../contexts/TodoContext';

// Storage 유틸리티 함수
const storage = {
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }
};

export default function CompletedScreen() {
  const { todos, saveTodos } = useTodos();
  const [showDelete, setShowDelete] = useState(null);

  // 완료된 항목만 필터링
  const completedTodos = todos?.filter(todo => todo.completed) || [];
  
  console.log('Completed todos:', completedTodos); // 디버깅용

  const deleteTodo = (id) => {
    saveTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {completedTodos.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>완료된 항목이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={completedTodos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity 
                  style={{ 
                    backgroundColor: 'red', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80
                  }}
                  onPress={() => deleteTodo(item.id)}
                >
                  <Text style={{ color: 'white' }}>삭제</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'white'
                }}
                onPress={() => setShowDelete(showDelete === item.id ? null : item.id)}
              >
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 16 }}>
                    {item.text}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: getPriorityColor(item.priority) }}>
                    {item.priority}
                  </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: 'gray' }}>
                    {item.date ? new Date(item.date).toLocaleDateString() : 'ASAP'}
                  </Text>
                  {showDelete === item.id && (
                    <TouchableOpacity
                      onPress={() => deleteTodo(item.id)}
                      style={{ marginLeft: 10 }}
                    >
                      <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

```