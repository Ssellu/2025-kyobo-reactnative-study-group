import { useState } from 'react';
import { View, FlatList, Button, Text } from 'react-native';

export default function TodoListScreen({ navigation }) {
  const [todos, setTodos] = useState([]);

  const addTodo = (newTodo) => {
    setTodos([...todos, { id: Date.now(), text: newTodo }]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button 
        title="할일 추가" 
        onPress={() => navigation.navigate('AddTodo', { addTodo })} 
      />
      
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 18, padding: 10 }}>
            {item.text}
          </Text>
        )}
      />
    </View>
  );
}