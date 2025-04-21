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