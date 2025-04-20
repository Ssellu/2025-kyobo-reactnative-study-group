import React from 'react';
import { View, ScrollView } from 'react-native';
import Ex01Counter from './components/04-ex01-useState-component';
import Ex02Timer from './components/04-ex02-useEffect-component';
import Ex03Counter from './components/04-ex03-useCallback-component';
import Ex04TextInputFocus from './components/04-ex04-useRef-component';
import Ex05Counter from './components/04-ex05-useCounter-component';
import Ex06Dashboard from './components/04-ex06-useCounter-and-useUserStatus-component';

export default function App() {
  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ex01Counter/> 
          <Ex02Timer />
          <Ex03Counter />
          <Ex04TextInputFocus />
          <Ex05Counter />
          <Ex06Dashboard user={"hong1234"}/>
      </View>
    </ScrollView>
  );
} 