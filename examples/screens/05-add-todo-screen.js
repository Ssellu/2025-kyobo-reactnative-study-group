import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTodoScreen({ route, navigation }) {
  const [text, setText] = useState('');
  const { addTodo } = route.params;

  const handleSubmit = () => {
    if(text.trim()) {
      addTodo(text.trim());
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="할일 입력"
        value={text}
        onChangeText={setText}
        style={{ 
          borderBottomWidth: 1, 
          padding: 10, 
          marginBottom: 20 
        }}
      />
      <Button title="추가" onPress={handleSubmit} />
    </SafeAreaView>
  );
}