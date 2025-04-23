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
위 명령어로 새 Expo 프로젝트를 생성합니다. 이때 TypeScript 템플릿을 사용하려면 `-t` 혹은 `--template` 옵션을 추가할 수 있습니다.

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
#### Expo Go의 제한된 기능들
**1. 네이티브 모듈 관련**
- **블루투스** 통신
- **NFC** 기능
- **백그라운드 위치** 추적
- **딥링크** (URL Scheme)

**2. 하드웨어 관련**
- **지문 인식** (Fingerprint/Face ID)
- **백그라운드 서비스**
- **푸시 알림** (특정 구현)

**3. 기타 제한사항**
- **커스텀 네이티브 코드** 실행 불가
- **특정 써드파티 SDK** 통합 제한
- **앱 크기** 제한
- **특정 코드푸시** 구현 제한


# Expo Standalone 파일 빌드
## EAS CLI 설치 
```bash
npm install -g eas-cli
```

## EAS CLI 명령

### 1. `eas login`
- **목적**: Expo 계정으로 EAS CLI 인증
- **사용 시점**: 
  - EAS CLI를 처음 사용할 때
  - 다른 Expo 계정으로 전환할 때

```bash
# 기본 로그인
eas login

# 특정 계정으로 로그인
eas login -u username@example.com

# 현재 로그인 상태 확인
eas whoami
```

### 2. `eas build:configure`
- **목적**: 프로젝트의 EAS Build 설정 초기화
- **사용 시점**:
  - 프로젝트에서 처음 EAS Build를 사용할 때
  - 빌드 설정을 처음부터 다시 구성할 때

```bash
# 기본 설정
eas build:configure

# 특정 플랫폼만 설정
eas build:configure --platform ios
eas build:configure --platform android
```

#### 생성되는 파일
`eas build:configure` 실행 시 생성되는 `eas.json`:

````json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
````

#### 주의사항
- Expo 계정이 필요합니다
- `eas login` 후에 `eas build:configure` 실행
- 프로젝트 루트 디렉토리에서 실행해야 함
- Android/iOS 빌드 설정이 자동으로 구성됨

### 1. `eas device:create`
- **목적**: iOS 기기를 개발자 계정에 등록하고 프로비저닝 프로파일을 생성
- **사용 시점**: 
  - 새로운 iOS 기기에서 개발용 앱을 테스트하려 할 때
  - 내부 테스터에게 개발 빌드를 배포하려 할 때

```bash
# 기본 사용법
eas device:create

# 특정 플랫폼 지정
eas device:create --platform ios
```

### 2. `eas build:resign`
- **목적**: 기존 iOS/Android 앱 바이너리에 새로운 인증서로 서명
- **사용 시점**:
  - 인증서가 만료되었을 때
  - 다른 개발자 계정으로 앱을 배포해야 할 때
  - 기존 앱을 다른 번들 ID로 재배포해야 할 때

```bash
# 기본 사용법
eas build:resign --path /path/to/app.ipa --profile production

# Android APK 재서명
eas build:resign --platform android --path /path/to/app.apk
```

#### 주의사항
- `device:create`는 Apple Developer Program 계정이 필요
- `build:resign`은 원본 앱 파일(.ipa/.apk)이 필요
- iOS의 경우 유효한 프로비저닝 프로파일과 인증서가 필요
- 
**빌드 종류**
```bash
# eas device:create  # iOS 기기를 개발자 계정에 등록하고 프로비저닝 프로파일을 생성
# eas build:resign  # 기존 iOS/Android 앱 바이너리에 새로운 인증서로 서명

#내부 빌드 프로필로
# preview 구성으로 android,ios 플랫폼에 대한 빌드 생성
eas build --profile preview --platform all

# preview 구성으로 ios 플랫폼에 대한 빌드 생성
eas build --profile preview --platform ios

# preview 구성으로 android 플랫폼에 대한 빌드 생성
eas build --profile preview --platform android

#Store용 빌드
eas build --platform android

eas build --platform ios

eas build --platform all 

#development 모드
eas build --profile development --platform ios

eas build --profile development --platform android

#시뮬레이터용 develpment 모드
eas build --profile development-simulator --platform ios

eas build --profile development-simulator --platform android

#xcode로 시뮬레이터 빌드
npx react-native run-ios
```


**앱 스토어 배포용 빌드 (EAS Build)**

```bash
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
---  
# .ipa/.apk/.aab 디바이스 설치하기 (Standalone 방식)

### 1. iOS에 `.ipa` 설치하기

#### **1.1 EAS로 .ipa 빌드**
- EAS(Build)를 사용하여 iOS용 `.ipa` 파일을 생성합니다.
- 빌드 명령:
  ```bash
  eas build --preview --platform ios
  ```
- 빌드 완료 후, Expo에서 제공하는 링크를 통해 `.ipa` 파일을 다운로드합니다.

#### **1.2 .ipa 파일 업로드**
- `.ipa` 파일을 디바이스에 설치하려면 HTTPS를 지원하는 파일 공유 서비스를 사용해야 합니다. 예를 들어:
  - [Diawi](https://www.diawi.com/): 간단한 업로드 및 설치 링크 제공.
  - [InstallOnAir](https://www.installonair.com/): QR 코드 생성 및 설치 지원.

#### **1.3 디바이스에 설치**
1. 업로드된 `.ipa` 파일의 링크를 iOS 디바이스에서 엽니다.
2. 설치를 진행하면 "신뢰할 수 없는 개발자" 경고가 표시될 수 있습니다.
3. **설정 → 일반 → 기기 관리**로 이동하여 해당 프로파일을 신뢰하도록 설정합니다.
4. 앱을 실행하여 테스트합니다.

#### **주의사항**
- **Apple Developer Program 가입 필요**: iOS 디바이스에 앱을 설치하려면 Apple Developer 계정이 필요합니다.
- **UDID 등록**: 테스트할 디바이스의 UDID를 Apple Developer 계정에 등록해야 합니다.
- **프로비저닝 프로파일**: 올바른 프로비저닝 프로파일이 설정되어 있어야 합니다.
- **HTTPS 필수**: iOS는 HTTPS를 통해서만 `.ipa` 파일을 다운로드 및 설치할 수 있습니다.

---

### 2. Android에 `.apk` 혹은 `.aab` 설치하기

#### **2.1 Android Studio 활용**
1. **APK 빌드**:
   - Android Studio에서 프로젝트를 열고, **Build → Build Bundle(s)/APK(s) → Build APK(s)**를 선택합니다.
   - 빌드가 완료되면 `app/build/outputs/apk/release/` 디렉토리에서 `.apk` 파일을 찾을 수 있습니다.

2. **디바이스 연결**:
   - Android 디바이스를 USB로 연결하고, **개발자 옵션**에서 **USB 디버깅**을 활성화합니다.

3. **APK 설치**:
   - Android Studio의 **Device File Explorer**를 사용하거나, 명령어를 통해 설치:
     ```bash
     adb install /path/to/app-release.apk
     ```
4. **AAB 설치**:
   - `.aab` 파일은 Google Play Store를 통해 배포되거나, `bundletool`을 사용하여 APK로 변환 후 설치해야 합니다.
   - APK 변환 명령:
     ```bash
     bundletool build-apks --bundle=/path/to/app-release.aab --output=/path/to/output.apks --mode=universal
     ```
   - 변환된 APK 설치:
     ```bash
     adb install /path/to/output.apks
     ```



#### **주의사항**
- **디바이스 설정**: Android 디바이스에서 **알 수 없는 소스에서 앱 설치 허용** 옵션을 활성화해야 합니다.
- **ADB 설치**: ADB(Android Debug Bridge)가 설치되어 있어야 합니다. [ADB 설치 가이드](https://developer.android.com/studio/command-line/adb)를 참고하세요.
- **AAB 파일**: `.aab` 파일은 APK로 변환하지 않으면 직접 설치할 수 없습니다.
- **디버그 vs 릴리스 빌드**: 디버그 빌드는 개발용으로만 사용하며, 릴리스 빌드는 서명된 상태여야 배포 가능합니다.