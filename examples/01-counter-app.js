import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.buttonRow}>
        <Button title="Decrease" onPress={decrement} disabled={count === 0} />
        <Button title="Increase" onPress={increment} />
      </View>
      <Button title="Reset" onPress={reset} disabled={count === 0} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  count: { fontSize: 48, marginBottom: 20 },
  buttonRow: { flexDirection: 'row', gap: 16, marginBottom: 10 }
});