# React Native 앱 배포 가이드

React Native 앱의 빌드 및 배포 절차를 이해하고, 로컬 테스트와 배포용 빌드의 차이를 학습합니다.   
또한 프로젝트 구조를 분석하여 주요 파일과 디렉토리의 역할을 설명합니다.

---

## 1. 빌드 및 배포 개요

### **1.1 로컬 테스트용 빌드 vs 배포용 빌드**
React Native 앱은 두 가지 주요 빌드 타입을 지원합니다:
- **로컬 테스트용 빌드 (Debug Build)**:
  - 개발 중 디버깅 및 테스트를 위해 사용됩니다.
  - 개발 도구(DevTools)와 상세한 로그가 포함되어 있습니다.
  - `__DEV__` 변수가 `true`로 설정되어 있습니다.
  - 성능 최적화가 이루어지지 않은 상태입니다.

- **배포용 빌드 (Release Build)**:
  - 최종 사용자에게 제공되는 버전입니다.
  - 개발 도구 및 디버깅 기능이 제거됩니다.
  - `__DEV__` 변수가 `false`로 설정되어 있습니다.
  - 코드가 압축되고 성능 최적화가 이루어집니다.

#### **빌드 타입 확인 코드**:
```javascript
// `__DEV__` 변수는 React Native(및 Expo)에서 자동으로 제공되는 전역 변수입니다.
if (__DEV__) {
  console.log("Debug Build");
} else {
  console.log("Release Build");
}
```

---

### **1.2 빌드 과정**
#### **Android 빌드**:
1. 프로젝트 루트에서 Android 디렉토리로 이동:
   ```bash
   cd android
   ```
2. Release APK 생성:
   ```bash
   ./gradlew assembleRelease
   ```
3. 생성된 APK 위치:
   `android/app/build/outputs/apk/release/app-release.apk`

#### **iOS 빌드**:
1. Xcode에서 프로젝트 열기:
   ```bash
   npx pod-install && open ios/MyApp.xcworkspace
   ```
2. Archive 생성:
   - Xcode 메뉴에서 **Product → Archive** 선택.
3. `.ipa` 파일 내보내기:
   - Archive 완료 후 **Distribute App**을 통해 파일 생성.

---

## 2. 프로젝트 구조 분석

### **2.1 주요 디렉토리 및 파일**
React Native 프로젝트는 다음과 같은 구조를 가집니다:

| 디렉토리/파일       | 설명                                                                 |
|---------------------|---------------------------------------------------------------------|
| `android/`          | Android 네이티브 코드 및 설정 파일 포함.                            |
| `ios/`              | iOS 네이티브 코드 및 설정 파일 포함.                               |
| `src/` 또는 `app/` | 앱의 주요 JavaScript/TypeScript 코드가 포함된 디렉토리.             |
| `components/`       | 재사용 가능한 UI 컴포넌트 저장소.                                  |
| `screens/`          | 앱의 각 화면이나 뷰를 관리하는 디렉토리.                           |
| `assets/`           | 이미지, 폰트 등 정적 리소스 저장소.                                |
| `.gitignore`        | Git에 포함되지 않을 파일과 디렉토리 지정.                          |
| `metro.config.js`   | Metro 번들러 설정 파일.                                           |

---

### **2.2 주요 파일 역할**
#### **`public/index.html`**
- 웹 앱에서 HTML 템플릿으로 사용되며, React Native에서는 사용되지 않음.

#### **`src/App.js`**
- 앱의 진입점이며, 주요 컴포넌트와 화면을 연결합니다.

#### 예시 코드 (`App.js`):
```javascript
import React from "react";
import { View, Text } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to React Native!</Text>
    </View>
  );
}
```

---

## 3. 배포 절차

### **3.1 로컬 테스트**
#### 로컬 환경에서 Release 빌드를 실행하려면 다음을 수행합니다:
1. Android에서 실행:
   ```bash
   react-native run-android --variant=release
   ```
2. iOS에서 실행:
   ```bash
   react-native run-ios --configuration Release
   ```

---

### **3.2 서버에 배포**
React Native 앱은 네이티브 플랫폼(Android/iOS)에 따라 배포됩니다.

#### Android APK 배포:
- Google Play Console에 로그인하여 APK 업로드.
- 앱 이름, 설명, 스크린샷 등 메타데이터 추가.

#### iOS IPA 배포:
- Apple Developer 계정으로 로그인 후 TestFlight 또는 App Store에 업로드.
- 앱 아이콘, 설명 등을 추가하여 제출.

### **3.3 Expo 프로젝트 빌드하기**
---

**1. Expo 프로젝트 생성**

```bash
npx create-expo-app@latest MyAwesomeApp
cd MyAwesomeApp
```
위 명령어로 새 Expo 프로젝트를 생성합니다. 이때 TypeScript 템플릿을 사용하려면 `-t` 옵션을 추가할 수 있습니다.

---

**2. Expo Go 앱 설치 (실제 기기에서 테스트용)**

- Android: Google Play Store에서 "Expo Go" 검색 후 설치
- iOS: App Store에서 "Expo Go" 검색 후 설치

---

**3. 개발 서버 실행 및 앱 실행**

```bash
npx expo start
```
명령어를 실행하면 터미널에 QR 코드가 표시됩니다.  
- Android: Expo Go 앱 실행 → "Scan QR Code" 선택 → 터미널의 QR 코드 스캔  
- iOS: 카메라 앱으로 QR 코드 스캔 → Expo Go에서 앱 자동 실행  
이렇게 하면 코드 수정 시 실시간으로 앱이 기기에서 반영됩니다.

---

**4. 로컬 기기에 네이티브 앱 빌드 & 실행 (선택사항, 고급)**

Expo Go가 아닌, 직접 빌드한 네이티브 앱을 설치하고 싶다면 다음 명령어를 사용합니다.

- Android:
  ```bash
  npx expo run:android
  ```
  (Android Studio 및 Java 설치 필요)

- iOS:
  ```bash
  npx expo run:ios
  ```
  (Mac + Xcode 필요)

이 방식은 네이티브 모듈을 직접 추가하거나, Expo Go에서 지원하지 않는 기능을 사용할 때 필요합니다.

---

**5. 앱 스토어 배포용 빌드 (EAS Build)**

앱을 실제로 배포하고 싶다면 Expo의 EAS(Build) 서비스를 사용합니다.

```bash
npx expo install eas-cli
npx eas build -p android
npx eas build -p ios
```

- iOS의 경우 Apple Developer Program 가입 필요 ($99/년) 
- 빌드는 Expo의 클라우드 서버에서 진행
- 빌드 완료 후 .ipa 파일을 다운로드 받아 App Store Connect에 업로드 가능

---
### 1. Expo Android 빌드
### 2. Expo iOS 빌드 
- Apple Developer 계정 필요 
#### 1. `App.json` 에서 `bundleIdentifier` 항목 확인
  ```json
  {
    "build": {
      "production": {
        "ios": {
          "bundleIdentifier": "com.ssellu.MyProject"
        }
      }
    }
  }
  ```
#### 2. Apple Developer Console에서 Bundle ID 등록

- [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list) 접속
- `Identifiers` > `+` 버튼 클릭
- `App IDs` 선택
- Bundle ID: "com.ssellu.MyProject" 입력


#### 4. 빌드 재시도
```bash
eas build --platform ios
```
#### 주의 사항 
- Apple Developer Program 가입이 필요합니다.
- Bundle ID는 고유해야 합니다.
- Apple Developer Console의 인증서와 프로비저닝 프로파일이 유효해야 합니다.
  