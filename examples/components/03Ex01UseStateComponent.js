import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function Ex01Counter() {
  console.log('useState - App component re-rendered');
  const [count, setCount] = useState(0);

  return (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      <Text style={{ fontSize: 24 }}>Count: {count}</Text>
      <Button title="Add" onPress={() => setCount(count + 1)} />
    </View>
  );
}