import React, { createContext, useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// 1. Context 생성
const UserContext = createContext();

// 2. Provider 컴포넌트
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}> 
      {children}
    </UserContext.Provider>
  );
};

// 3. UserProfile 컴포넌트
const UserProfile = () => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.profileBox}>
      {user ? (
        <Text style={styles.welcome}>Welcome, {user.name}!</Text>
      ) : (
        <Text style={styles.noUser}>No user logged in.</Text>
      )}
    </View>
  );
};

// 4. LoginForm 컴포넌트
const LoginForm = () => {
  const { setUser } = useContext(UserContext);

  const handleLogin = () => {
    setUser({ name: "John Doe" });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  );
};

// 5. App 컴포넌트
const App = () => (
  <UserProvider>
    <View style={styles.container}>
      <UserProfile />
      <LoginForm />
    </View>
  </UserProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  profileBox: {
    marginBottom: 24,
  },
  welcome: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  noUser: {
    fontSize: 16,
    color: "#999",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;
