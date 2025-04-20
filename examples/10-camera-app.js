import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Platform.OS === 'web' ? 'user' : 'back');
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  // 권한 처리 함수
  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (err) {
        console.error('Web camera error:', err);
        setHasPermission(false);
      }
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data.uri);
    } catch (error) {
      console.error('촬영 오류:', error);
    }
  };

  const toggleCameraType = () => {
    setType(prev => {
      if (Platform.OS === 'web') {
        return prev === 'user' ? 'environment' : 'user';
      }
      return prev === 'back' ? 'front' : 'back';
    });
  };

  // 권한 상태에 따른 UI 처리
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>카메라 접근 권한 확인 중...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          카메라 접근이 거부되었습니다.{'\n'}
          {Platform.OS === 'web' 
            ? '브라우저 설정에서 권한을 허용해주세요.' 
            : '기기 설정에서 권한을 활성화해주세요.'}
        </Text>
        <Button title="권한 다시 요청" onPress={requestPermissions} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          <Button title="다시 찍기" onPress={() => setPhoto(null)} />
        </View>
      ) : (
        <Camera 
          style={styles.camera} 
          type={type}
          ref={cameraRef}
          useCamera2Api={false} // Android에서 더 나은 호환성
        >
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraType}
            >
              <Text style={styles.buttonText}>전환</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.captureButton]}
              onPress={takePicture}
            >
              <Text style={styles.buttonText}>촬영</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  previewContainer: {
    flex: 1,
    width: '100%',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
});
