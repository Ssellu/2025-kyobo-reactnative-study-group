# 🚀 React Native의 Component 종류
React Native의 모든(주요) 컴포넌트는 공식 문서에서 "Core Components and APIs"로 분류되어 있으며,    
기본적으로 UI를 구성하는 데 필수적인 요소들과, 플랫폼별(iOS/Android) 특화 컴포넌트, 그리고 다양한 커뮤니티 컴포넌트들이 존재합니다.    
React Native의 주요 컴포넌트와 특징, 그리고 웹에서 대체 가능한 React 컴포넌트를 살펴봅시다.

---

## 1. **기본(Core) 컴포넌트**

| React Native 컴포넌트 | 특징 | 웹 대체 컴포넌트 |
|----------------------|------|------------------|
| View                 | 레이아웃 컨테이너, flex 레이아웃 지원 | div |
| Text                 | 텍스트 표시 | span, p |
| Image                | 이미지 표시, source prop 사용 | img |
| TextInput            | 텍스트 입력 필드 | input, textarea |
| ScrollView           | 스크롤 가능한 컨테이너 | div(overflow: auto) |
| StyleSheet           | 스타일 정의(추상화) | CSS, styled-components 등 |
| Button               | 기본 버튼 | button |
| Switch               | 토글 스위치 | input(type="checkbox") |
| FlatList             | 최적화된 리스트 렌더링 | ul/li, map 함수 |
| SectionList          | 섹션 구분 리스트 | ul/li, map 함수 |

---

## 2. **플랫폼 특화 컴포넌트**

- **Android 전용**
  - BackHandler: 하드웨어 백버튼 감지
  - DrawerLayoutAndroid: 드로어 레이아웃
  - PermissionsAndroid: 권한 요청
  - ToastAndroid: 토스트 메시지

- **iOS 전용**
  - ActionSheetIOS: 액션시트/공유시트

---

## 3. **기타 유용한 컴포넌트**

- ActivityIndicator: 로딩 인디케이터
- Alert: 알림창
- Animated: 애니메이션 지원
- Dimensions: 디바이스 크기 정보
- KeyboardAvoidingView: 키보드 자동 회피 뷰
- Linking: 딥링크 등 외부 링크 처리
- Modal: 모달 팝업
- PixelRatio: 픽셀 밀도 정보
- RefreshControl: 당겨서 새로고침
- StatusBar: 상태바 제어

---

## 4. **커뮤니티 컴포넌트 예시**  
(공식이 아닌, 자주 쓰이는 외부 라이브러리)

- react-native-calendars: 달력 컴포넌트
- react-native-bottom-sheet: 바텀시트
- react-native-gifted-chat: 채팅 UI
- react-native-toast-message: 토스트 메시지
- react-native-pager-view: 페이지 뷰
---
### 참고
- 공식 문서에서 더 많은 컴포넌트와 API를 확인할 수 있습니다.
- 커뮤니티 컴포넌트는 [awesome-react-native](https://github.com/jondot/awesome-react-native), [유튜브 추천](https://www.youtube.com/watch?v=wsZ_mjXk6Hg) 등에서 최신 트렌드를 참고하세요.

## 주요 React Native 컴포넌트 비교표
| RN 컴포넌트 | 기능 | 웹 대체 컴포넌트 | 차이점 |
|-------------|------|------------------|--------|
| **View** | 레이아웃 컨테이너 | `<div>` | flex 기본 방향(column ↔ row) |
| **Text** | 텍스트 표시 | `<p>`/`<span>` | RN에선 반드시 Text 내부에 텍스트 노드 존재 필요 |
| **Image** | 이미지 표시 | `<img>` | `source` 프로퍼티 사용 |
| **ScrollView** | 스크롤 컨테이너 | `<div style={{overflow: 'auto'}}>` | RN에선 기본 스크롤 구현 필요 |
| **TouchableOpacity** | 터치 반응 버튼 | `<button>`/`<div onClick>` | 웹에선 CSS 트랜지션으로 구현 |

## 플랫폼 통합 예제 코드
```jsx
import { Platform, StyleSheet } from 'react-native';
import React from 'react';

// 플랫폼별 컴포넌트 분기 처리
const CommonView = Platform.select({
  native: () => require('react-native').View,
  default: () => 'div'
});

const CommonText = Platform.select({
  native: () => require('react-native').Text,
  default: () => 'p'
});

const CommonImage = ({ source, style }) =>
  Platform.OS === 'web' ? (
    <img src={source.uri} style={style} alt="web-image" />
  ) : (
    <Image source={source} style={style} />
  );

// 통합 컴포넌트 사용 예시
export default function CrossPlatformCard() {
  return (
    <CommonView style={styles.container}>
      <CommonText style={styles.title}>크로스플랫폼 카드</CommonText>
      <CommonImage
        source={{ uri: 'https://example.com/image.jpg' }}
        style={styles.image}
      />
      {Platform.OS === 'web' ? (
        <button onClick={() => alert('Web Click!')}>웹 버튼</button>
      ) : (
        <TouchableOpacity onPress={() => alert('Native Click!')}>
          <Text>네이티브 버튼</Text>
        </TouchableOpacity>
      )}
    </CommonView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexDirection: Platform.OS === 'web' ? 'row' : 'column'
  },
  title: {
    fontSize: 20,
    color: '#333'
  },
  image: {
    width: 100,
    height: 100,
    margin: 10
  }
});

```

## 구현 포인트
1. **플랫폼 감지**: `Platform.select`를 사용한 조건부 컴포넌트 로드
2. **스타일 통합**: `StyleSheet.create`로 플랫폼별 스타일 차이 처리
3. **이벤트 핸들링**: 웹(onClick)과 네이티브(onPress) 이벤트 통합
4. **이미지 처리**: URI 포맷 통일 및 웹용 alt 속성 추가

### 주요 Component를 활용한 실습 예제
```jsx
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

```