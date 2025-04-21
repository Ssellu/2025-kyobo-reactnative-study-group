import { registerRootComponent } from 'expo';

// import App from './01-counter-app';
// import App from './02-user-input-app';
// import App from './03-likes-app';
// import App from './04-hooks-app';
// import App from './05-stack-navigation-app';
// import App from './05-tab-navigation-app';
// import App from './06-fetch-app';
// import App from './07-axios-app';
// import App from './08-user-realtime-app';
// import App from './09-context-api-app';
import App from './10-camera-app';
// import App from './11-location-app';
// import App from './12-location-naver-kakao-map-app';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

  
  // 명시적 등록
registerRootComponent(() => <App />);