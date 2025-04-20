import React from 'react';
import { View, ScrollView } from 'react-native';
import Ex01Counter from './components/03Ex01UseStateComponent';
import Ex02Timer from './components/03Ex02UseEffectComponent';
import Ex03Counter from './components/03Ex03UseCallbackComponent';
import Ex04TextInputFocus from './components/03Ex04UseRefComponent';
import Ex05Counter from './components/03Ex05UseCounterComponent';
import Ex06Dashboard from './components/03Ex06UseCounterAndUseUserStatusComponent';

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