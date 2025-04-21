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