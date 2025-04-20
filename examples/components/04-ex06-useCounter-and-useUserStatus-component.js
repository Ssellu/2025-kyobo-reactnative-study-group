import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import useCounter from "../hooks/04-ex05-useCounter-custom-hook";
import useUserStatus from "../hooks/04-ex06-useUserStatus-custom-hook";

export default function Ex06Dashboard({ user }) {
  const { count, increment } = useCounter(0);
  const isOnline = useUserStatus(user.id);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>사용자 대시보드</Text>
      <Text style={styles.status}>
        {user.name}님은 현재{" "}
        <Text style={[styles.bold, { color: isOnline ? "green" : "gray" }]}>
          {isOnline === null ? "확인 중..." : isOnline ? "온라인" : "오프라인"}
        </Text>
        {" "}상태입니다.
      </Text>
      <Text style={styles.count}>방문 횟수: {count}</Text>
      <Button title="방문 횟수 증가" onPress={increment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    elevation: 2,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  status: {
    fontSize: 18,
    marginBottom: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  count: {
    fontSize: 20,
    marginBottom: 16,
  },
});
