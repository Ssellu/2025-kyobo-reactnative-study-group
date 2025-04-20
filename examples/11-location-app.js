import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [hasLocationPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  // 권한 요청 및 위치 조회 함수
  const getLocation = async () => {
    try {
      // 권한 요청
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('위치 접근 권한이 필요합니다');
        setHasPermission(false);
        return;
      }

      setHasPermission(true);
      
      // 위치 정보 가져오기
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation(locationData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // 권한 상태에 따른 UI 처리
  if (hasLocationPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>위치 권한 확인 중...</Text>
      </View>
    );
  }

  if (hasLocationPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="권한 다시 요청" onPress={getLocation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <Text style={styles.title}>현재 위치 정보</Text>
          <View style={styles.infoBox}>
            <Text>위도: {location.coords.latitude}</Text>
            <Text>경도: {location.coords.longitude}</Text>
            <Text>정확도: {location.coords.accuracy}m</Text>
            <Text>고도: {location.coords.altitude || 'N/A'}</Text>
          </View>
          <Button title="위치 새로고침" onPress={getLocation} />
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});
