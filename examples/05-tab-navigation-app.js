import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoListScreen from './screens/05-todo-list-screen';
import AddTodoScreen from './screens/05-add-todo-screen';

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
