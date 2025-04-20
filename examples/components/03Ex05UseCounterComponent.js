import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import useCounter from "../hooks/03Ex05UseCounterCustomHook";

export default function Ex05Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>현재 카운트: {count}</Text>
      <View style={styles.buttonRow}>
        <Button title="증가" onPress={increment} />
        <Button title="감소" onPress={decrement} />
        <Button title="초기화" onPress={reset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },
  text: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10, // RN 0.71 이상에서 지원, 하위 버전이면 marginRight 등으로 처리
  },
});
