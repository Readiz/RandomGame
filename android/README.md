# 운빨망겜 Android

다운로드: https://github.com/Readiz/RandomGame/releases/latest/download/random-game.apk

Android 6.0(API 23) 이상 휴대전화·태블릿용 APK입니다. 게임과 캐릭터를 APK에 함께 넣어 오프라인으로 실행합니다. 화면은 전체화면이며, 가로·세로 회전 중에도 게임을 유지합니다. 동시 터치 수는 기기에 따라 다릅니다.

웹과 같은 게임을 Android WebViewAssetLoader의 앱 내부 HTTPS 주소에서 실행합니다. 게임은 오프라인으로 동작하고 WebView의 외부 통신은 계속 차단합니다. 네이티브 업데이트 확인·다운로드에 `INTERNET`, APK 설치 화면 연결에 `REQUEST_INSTALL_PACKAGES` 권한을 사용하며 저장소 권한은 사용하지 않습니다. 진동은 `VIBRATE` 권한으로 연결하고, 앱 내부의 최상위 페이지에서 온 제한된 패턴만 받습니다. 앱을 숨기면 게임과 진동이 멈추며 복귀하면 이어집니다. 모션 줄이기와 기기의 터치 진동 설정을 존중합니다.

당첨 시에는 고정된 `result` 신호로 총 720ms의 3연속 진동을 한 번 재생합니다. Android 8.0 이상에서는 진폭 255를 요청하며 이전 버전에서는 같은 길이의 기본 진동을 사용합니다. 일반 타격 패턴과 임의 진폭 요청은 구분합니다.

## 빌드

TV 프로젝트의 Gradle·별도 서명 키·APK 검증·해시 메타데이터 방식을 참고했습니다. JDK 17, Android SDK 36, build-tools 35.0.0, Node.js 22.12 이상이 필요합니다.

```sh
npm ci
npm run build:apk
```

Gradle 8.13을 검증해 내려받습니다. 기존 Gradle 설치는 `RANDOM_GAME_GRADLE_HOME`으로 지정할 수 있습니다. macOS Homebrew의 JDK/SDK 기본 위치를 인식하며, 다른 환경에서는 `JAVA_HOME`과 `ANDROID_HOME`을 지정합니다.

처음 빌드하면 `~/.config/random-game/android-signing/`에 새 서명 키와 비밀번호를 만듭니다. TV 앱의 키와는 별개이며, 이 디렉터리를 안전하게 보관해야 다음 버전으로 덮어 설치할 수 있습니다. 키와 비밀번호는 저장소·APK·릴리스에 포함하지 않습니다.

결과:

- `outputs/android/random-game.apk`: 배포용 서명 APK
- `outputs/android/random-game-<version>.apk`: 버전별 APK
- `outputs/android/random-game.apk.json`: 실제 패키지·버전·크기·SHA-256
- `android/app/build/outputs/apk/debug/app-debug.apk`: 별도 패키지의 WebView 검사 빌드

버전은 루트 `package.json`과 맞추며 `versionCode`는 `major × 1,000,000 + minor × 1,000 + patch`입니다. 빌드는 웹 테스트, 앱 전용 웹 묶음, Android 테스트, 린트, release/debug APK 생성과 서명 검증을 수행합니다. APK 안의 웹 파일은 로컬 Gradle 산출물이며 Git에는 넣지 않습니다.

## 배포와 검증

GitHub Release에 `random-game.apk`, 버전별 APK, SHA-256 파일과 JSON을 함께 올립니다. 태그는 반드시 `android-v<versionName>` 형식이며, 메타데이터와 APK 업로드를 마친 릴리스를 최신으로 공개합니다. 고정 다운로드 주소는 최신 릴리스의 `random-game.apk`를 가리킵니다.

v2.2.7부터 TV·뮤직 앱처럼 실행·포그라운드 복귀마다 최신 메타데이터를 확인합니다. 더 높은 버전이 있으면 손가락이 없는 대기 화면에서만 업데이트를 안내합니다. 참여·카운트다운·이동·난투·결과 중에는 안내를 미루며, 인터넷 연결이 없어도 게임 시작을 막지 않습니다. ‘나중에’를 누르면 같은 진입 중에는 다시 묻지 않고 다음 앱 진입 때 확인합니다.

‘업데이트’를 누르면 해당 버전 태그에 고정된 APK를 앱 전용 캐시에 받고, 크기·SHA-256·패키지·버전을 검사한 뒤 읽기 전용 FileProvider URI로 Android 설치 화면을 엽니다. 다운로드는 지정 저장소와 GitHub 릴리스 파일 호스트의 HTTPS만 사용합니다. Android 8.0 이상에서 설치 허용이 꺼져 있으면 ‘이 출처 허용’ 설정으로 안내하고 돌아왔을 때 이어서 설치합니다. 최종 설치 확인과 서명 일치 검사는 Android가 담당합니다.

자동 확인 기능이 없는 v2.2.6 이하에서는 **v2.2.7 이상 APK를 한 번 직접 덮어 설치**해야 합니다. 이후부터 앱에서 안내를 받을 수 있습니다. APK 설치는 시스템 확인이 필요한 방식이며 무인 설치는 하지 않습니다.

Android 단위 테스트는 리소스 출처 제한, 진동 패턴과 백그라운드 취소, 업데이트 확인·보류·재진입·설치 권한 복귀, 손상된 다운로드 거부와 FileProvider 범위를 검사합니다. 브라우저 검증과 에뮬레이터 검증은 실제 휴대전화의 동시 터치 수나 진동 강도를 보장하지 않습니다.
