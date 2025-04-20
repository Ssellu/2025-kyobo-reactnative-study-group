import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoListScreen from './screens/05TodoListScreen';
import AddTodoScreen from './screens/05AddTodoScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="TodoList" component={TodoListScreen} options={{ title: '할일 목록' }} />
        <Tab.Screen name="AddTodo" component={AddTodoScreen} options={{ title: '할일 추가' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
