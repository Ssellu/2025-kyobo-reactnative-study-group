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