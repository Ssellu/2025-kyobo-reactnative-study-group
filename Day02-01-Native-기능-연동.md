# React Native 디바이스 기능 접근 및 퍼미션 처리 강의 자료

## 강의 목표
React Native에서 카메라, 마이크, 위치 정보, NFC 등 디바이스 기능을 접근하고, 퍼미션(permission)을 처리하는 방법을 학습합니다. 이를 통해 사용자 데이터 보호와 앱 기능의 원활한 구현을 실현합니다.

---

## 1. React Native에서 디바이스 기능 접근 방식

### **카메라 접근**
React Native에서 카메라를 사용하려면 `react-native-vision-camera` 또는 `react-native-camera`와 같은 라이브러리를 사용할 수 있습니다.

#### 설치 및 설정:
```bash
npm install react-native-vision-camera
cd ios && pod install
```

#### iOS 설정: (XCode 빌드)
`Info.plist`에 아래 내용을 추가:
```xml
<key>NSCameraUsageDescription</key>
<string>앱이 카메라를 사용해야 합니다.</string>
<key>NSMicrophoneUsageDescription</key>
<string>앱이 마이크를 사용해야 합니다.</string>
```

#### Android 설정: (Android Studio 빌드)
`AndroidManifest.xml`에 아래 내용을 추가:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

#### Expo 설정(app.json)
Expo 프레임워크는 위 독립적인 플랫폼 권한 관리를 한꺼번에 설정할 수 있습니다.
```json
{
  "expo": {
    "name": "YourAppName",
    "slug": "your-app-slug",  // Expo 프로젝트의 고유한 식별자.  앱의 URL 경로나 배포 시 사용되는 "짧은 이름"
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "앱이 카메라를 사용해야 합니다.",
          "microphonePermission": "앱이 마이크를 사용해야 합니다."
        }
      ]
    ],
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO"
      ]
    }
  }
}

```

#### 카메라 퍼미션 요청 및 사용 예제:

### React-Native를 expo 라이브러리 설치 및 프로젝트 생성
```bash
npm install -g expo-cli
npx create-expo-app 02_react_native_basics --template blank 
cd 02_react_native_basics
npx expo install react-dom react-native-web @expo/metro-runtime @expo/config
```
### 프로젝트 실행하기 
```bash
npm start  # react 실행과 동일
w # Press w │ open web (웹 환경으로 열기)
```

### 브라우저 접속
URL: exp://172.168.10.67:8081

### 카메라 및 마이크 사용을 위한 라이브러리 설치 
```bash
npm install react-native-vision-camera
```



### Component 추가
```jsx
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

```

---

### **마이크 접근**
마이크는 카메라와 동일한 방식으로 설정하며, `react-native-vision-camera`에서 마이크 퍼미션도 처리할 수 있습니다.

---

### **위치 정보 접근**

#### 설치:
```bash
npm install react-native-permissions 
npx expo install expo-location
```

#### 위치 정보 확인 기본 예제:
```jsx
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

```
#### 위치 정보 확인하여 카카오맵과 네이버맵 연동 예제:
```jsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, Linking } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [hasLocationPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  // 권한 요청 및 위치 조회 함수
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('위치 접근 권한이 필요합니다');
        setHasPermission(false);
        return;
      }
      setHasPermission(true);
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

  // 카카오맵 웹으로 열기
  const openKakaoMapWeb = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      // 카카오맵 좌표로 바로가기 (마커 표시)
      const kakaoUrl = `https://map.kakao.com/link/map/현재위치,${latitude},${longitude}`;
      Linking.openURL(kakaoUrl);
    }
  };

  // 네이버맵 웹으로 열기
  const openNaverMapWeb = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      // 네이버맵 좌표로 바로가기 (마커 표시)
      const naverUrl = `https://map.naver.com/p/search/${latitude},${longitude}`;
      Linking.openURL(naverUrl);
    }
  };

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
          </View>
          <Button title="카카오맵(웹)에서 보기" onPress={openKakaoMapWeb} />
          <Button title="네이버맵(웹)에서 보기" onPress={openNaverMapWeb} />
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

```
웹 환경에서 위치 정보는 여러 가지 기준과 기술을 조합하여 결정됩니다. 대표적으로 아래와 같은 방식이 사용됩니다.

---

#### 1. **브라우저 Geolocation API**

- **가장 정확한 위치 정보**는 사용자가 브라우저의 위치 권한을 허용했을 때,  
  브라우저가 기기의 GPS, Wi-Fi, 블루투스, 셀룰러(기지국) 정보 등을 활용해 제공합니다.
- 사용자가 위치 권한을 허용하면,  
  스마트폰은 GPS와 Wi-Fi, 데스크탑은 Wi-Fi 또는 유선 네트워크 정보를 조합해 위치를 추정합니다.
- 이 방식은 사용자의 동의가 필요하며,  
  동의하지 않으면 더 부정확한 방식(IP 기반 등)으로 대체됩니다.

---

#### 2. **IP 주소 기반 위치 추정**

- 사용자가 위치 권한을 거부하거나,  
  Geolocation API를 사용하지 않는 경우에는  
  **IP 주소**를 기반으로 대략적인 위치(도시, 지역 수준)를 추정합니다.
- 이 방식은 정확도가 낮고,  
  VPN, 프록시, 모바일 데이터 등 네트워크 환경에 따라 실제 위치와 다를 수 있습니다.
---

#### 3. **기타 보조 정보**

- 일부 서비스는 사용자가 직접 입력한 위치 정보(예: 주소, 우편번호)를 활용하기도 합니다.
- 엣지 컴퓨팅(가장 가까운 서버에서 처리)이나  
  Wi-Fi AP 정보, 블루투스 비콘 등 다양한 기술이 보조적으로 사용될 수 있습니다.

---

#### 4. **정리**

- **가장 정확:**  
  사용자가 위치 권한을 허용한 경우,  
  브라우저가 기기의 GPS/Wi-Fi/셀룰러 정보를 조합해 위치를 결정
- **중간 정확:**  
  위치 권한 거부 시, IP 주소 기반으로 대략적인 위치 추정
- **보조:**  
  사용자가 직접 입력한 정보, 네트워크 인프라 정보 등

---

## 2. 퍼미션 처리 흐름 이해

### **퍼미션 상태 확인**
React Native에서 퍼미션 상태는 다음과 같은 값으로 반환됩니다:
- `granted`: 사용자가 권한을 승인함.
- `denied`: 사용자가 권한을 거부함.
- `blocked`: 권한 요청이 차단됨(설정에서 변경 필요).
- `not-determined`: 권한 요청이 아직 이루어지지 않음.

#### 상태 확인 코드:
```jsx
import { check, PERMISSIONS } from 'react-native-permissions';

const checkPermissionStatus = async () => {
  const status = await check(PERMISSIONS.ANDROID.CAMERA);
  console.log(status);
};
```

---

## 3. NFC 및 센서 데이터 연동

### **NFC 설정 및 사용**
NFC는 `react-native-nfc-manager` 라이브러리를 통해 구현할 수 있습니다.

#### 설치:
```bash
npm install react-native-nfc-manager
```

#### NFC 초기화 및 태그 읽기 예제:
```jsx
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const App = () => {
  useEffect(() => {
    NfcManager.start();
  }, []);

  const readNfcTag = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log(tag);
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View>
      <Button title="Read NFC Tag" onPress={readNfcTag} />
    </View>
  );
};
```

---

## 4. Best Practices for Permissions

### **권한 요청 시 유저 경험 개선**
1. **필요할 때만 요청**: 앱 실행 시 모든 권한을 요청하지 말고 기능이 필요한 순간에 요청합니다.
2. **사용자에게 이유 설명**: 권한이 필요한 이유를 명확히 전달합니다.
3. **거부 시 대안 제공**: 권한이 거부되었을 경우 설정 화면으로 이동하거나 대체 기능을 제공합니다.

#### 설정 화면 이동 예제:
```jsx
import { openSettings } from 'react-native-permissions';

const redirectToSettings = () => {
  openSettings().catch(() => console.warn('Cannot open settings'));
};
```


