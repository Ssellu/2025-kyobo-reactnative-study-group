import React, { useRef } from 'react';
import { View, TextInput, Button } from 'react-native';

export default function Ex04TextInputFocus() {
  const nameInput = useRef(null);
  const ageInput = useRef(null);
  console.log('useRef - App component re-rendered');
  return (
    <View>
      <TextInput
        ref={nameInput}
        placeholder="이름"
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <TextInput
        ref={ageInput}
        placeholder="나이"
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <Button title="이름 입력란 포커스" onPress={() => nameInput.current.focus()} />
      <Button title="나이 입력란 포커스" onPress={() => ageInput.current.focus()} />
    </View>
  );
};

