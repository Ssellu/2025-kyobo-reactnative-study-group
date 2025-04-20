import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet } from 'react-native';

const profiles = [
  {
    id: 1,
    name: 'Alice',
    bio: 'React Native Developer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    name: 'Bob',
    bio: 'UI/UX Designer',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 3,
    name: 'Charlie',
    bio: 'Mobile App Enthusiast',
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
];

export default function App() {
  // 각 프로필마다 좋아요 수를 관리합니다.
  const [likes, setLikes] = useState(Array(profiles.length).fill(0));

  const handleLike = (index) => {
    const newLikes = [...likes];
    newLikes[index] += 1;
    setLikes(newLikes);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🌟 Awesome Profile Cards 🌟</Text>
      {profiles.map((profile, idx) => (
        <View key={profile.id} style={styles.card}>
          <Image source={{ uri: profile.image }} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
          <View style={styles.buttonRow}>
            <Button
              title={`👍 Like (${likes[idx]})`}
              onPress={() => handleLike(idx)}
              color="#007AFF"
            />
          </View>
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  bio: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
