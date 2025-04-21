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