import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>입력하세요:</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="여기에 입력"
      />
      <Text style={styles.result}>입력값: {input}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  label: { fontSize: 18, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, fontSize: 18, marginBottom: 12 },
  result: { fontSize: 18 }
});