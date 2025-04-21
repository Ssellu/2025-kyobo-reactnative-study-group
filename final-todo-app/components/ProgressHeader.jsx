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