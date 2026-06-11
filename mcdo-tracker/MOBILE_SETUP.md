# Mobile App Setup Guide

This guide covers converting the web application into native mobile apps using Capacitor.

## Prerequisites

### Required Software
- Node.js 16+ and npm
- Git
- Android Studio (for Android builds)
- Xcode (for iOS builds on macOS)
- Java Development Kit (JDK) 11+
- Android SDK API 31+

### System Requirements

**Android Development:**
- Windows, macOS, or Linux
- Android SDK Platform Tools
- Android Emulator or physical device

**iOS Development:**
- macOS 12.0+
- Xcode 13.0+
- iOS 13.0+ target device
- Apple Developer Account (for publishing)

## Project Structure

```
mcdo-tracker/
├── src/                          # React source code
├── dist/                         # Built web app (Capacitor uses this)
├── android/                      # Android native project (added by Capacitor)
├── ios/                          # iOS native project (added by Capacitor)
├── capacitor.config.ts           # Capacitor configuration
├── package.json                  # Dependencies and scripts
└── MOBILE_SETUP.md              # This file
```

## Initial Setup

### 1. Build the Web App

Before adding platforms, build the Vite project:

```bash
npm run build
```

This creates the `dist/` folder that Capacitor uses.

### 2. Add Android Platform

```bash
npx cap add android
```

This creates the `android/` directory with a native Android project.

### 3. Add iOS Platform (macOS only)

```bash
npx cap add ios
```

This creates the `ios/` directory with a native iOS project.

### 4. Sync Changes

After making code changes, sync to native projects:

```bash
npm run build
npx cap sync
```

Or use the convenience script:

```bash
npm run build:mobile
```

## Android Development

### Configure Android Project

1. Open Android project:
```bash
npx cap open android
```

This opens Android Studio with the native project.

2. Configure in `android/app/build.gradle`:
   - Set `targetSdk = 33` (or higher)
   - Set `minSdk = 21`
   - Configure signing for release builds

### Build APK (Development)

```bash
# In Android Studio:
# 1. Build > Build Bundle(s) / APK(s) > Build APK(s)
# Or via command line:
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Generate Signed APK (Production)

1. Create a keystore file:
```bash
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias mcdo-tracker
```

2. Configure signing in `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        keyAlias 'mcdo-tracker'
        keyPassword 'YOUR_KEY_PASSWORD'
        storeFile file('release.keystore')
        storePassword 'YOUR_STORE_PASSWORD'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

3. Build signed APK:
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Generate App Bundle (Play Store)

1. Build Bundle:
```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

2. Upload to Google Play Console:
   - Sign in to [Google Play Console](https://play.google.com/console)
   - Create app or select existing
   - Go to Release > Production
   - Upload AAB file
   - Fill app details and submit for review

### Android Installation

**Via APK (Development):**
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

**Via Android Studio Emulator:**
- Run APK directly from Android Studio

**Via USB Device:**
- Connect Android device
- Enable USB Debugging
- Use ADB to install or drag APK to device

## iOS Development

### Configure iOS Project

1. Open iOS project (macOS only):
```bash
npx cap open ios
```

This opens Xcode with the native project.

2. Configure in Xcode:
   - Set deployment target to iOS 13.0+
   - Configure Team ID for signing
   - Set bundle identifier (com.mcdonalds.timetracker)

### Build IPA (Production)

1. In Xcode:
   - Select Product > Archive
   - Select Distribute App
   - Choose App Store Connect
   - Follow the wizard

2. Or via command line:
```bash
cd ios
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath App.xcarchive archive
xcodebuild -exportArchive -archivePath App.xcarchive -exportOptionsPlist exportOptions.plist -exportPath output
```

### Deploy to App Store

1. Sign up for [Apple Developer Program](https://developer.apple.com)

2. Create app in [App Store Connect](https://appstoreconnect.apple.com)

3. Archive and upload via Xcode or Transporter

4. Fill app information:
   - Description
   - Keywords
   - Screenshots
   - Privacy policy URL
   - Category

5. Submit for review

6. Apple reviews (typically 24-48 hours)

### iOS Installation

**Via Xcode Simulator:**
- Open ios/App.xcworkspace in Xcode
- Select simulator
- Product > Run (Cmd+R)

**Via USB Device:**
- Connect iPhone via USB
- Select device in Xcode
- Product > Run (Cmd+R)
- Trust developer on device

## PWA Deployment

### Current PWA Configuration

The app is already PWA-enabled:
- Offline support via Service Worker
- Installable on all modern browsers
- Dark mode support
- Responsive design

### Install as PWA

**Android Chrome:**
1. Open app in Chrome
2. Tap menu icon (⋮)
3. Tap "Install app"

**iOS Safari:**
1. Open in Safari
2. Tap share button (↑)
3. Scroll and tap "Add to Home Screen"

**Desktop:**
- Chrome: Click install icon in address bar
- Edge: Click install icon in address bar
- Firefox: May not support PWA install

### Web Deployment

Deploy the `dist/` folder to any static host:

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase deploy
```

## Build Scripts Reference

```bash
# Development
npm run dev              # Start dev server

# Production Web Build
npm run build           # Build for web
npm run preview         # Preview production build

# Mobile Integration
npm run build:mobile    # Build web + sync to mobile
npm run cap:sync        # Sync code without building

# Android
npm run cap:add:android    # Add Android platform
npm run cap:open:android   # Open Android Studio
npm run cap:build:android  # Sync and open Android Studio

# iOS (macOS only)
npm run cap:add:ios     # Add iOS platform
npm run cap:open:ios    # Open Xcode
npm run cap:build:ios   # Sync and open Xcode
```

## Troubleshooting

### Capacitor Issues

**"gradle: command not found"**
- Set GRADLE_HOME in environment variables
- Or use Android Studio's built-in gradle

**Android build fails**
- Run `cd android && ./gradlew clean` first
- Update Android SDK in Android Studio
- Check Java version: `java -version`

**iOS build fails on macOS**
- Run `pod install` in `ios/App` directory
- Update Xcode: `xcode-select --install`
- Check iOS deployment target

### App Issues

**White blank screen**
- Check browser console for errors
- Verify `dist/` folder exists and is built
- Clear app cache: Settings > App Info > Storage > Clear Cache

**LocalStorage not persisting**
- Check browser/app permissions
- Verify offline storage is enabled
- Check app data folder permissions

**Service Worker not working**
- Verify HTTPS on production
- Clear service worker cache
- Check manifest.json is valid

## Testing on Devices

### Android Testing

```bash
# List connected devices
adb devices

# Install app
adb install path/to/app.apk

# View logs
adb logcat | grep "chromium"

# Remote debug in Chrome
# Open chrome://inspect and enable USB debugging
```

### iOS Testing

- Use iOS Simulator in Xcode for quick testing
- Use USB device for testing features like camera, sensors
- Use Safari Remote Inspector for debugging

## Publishing Checklist

### Before Publishing to App Stores

- [ ] App runs on minimum OS version
- [ ] All buttons and text are clickable
- [ ] No console errors
- [ ] Offline mode works
- [ ] LocalStorage persists data
- [ ] Dark mode works
- [ ] Safe area respected (notch handling)
- [ ] Splash screen displays
- [ ] App icons appear correctly
- [ ] Performance is acceptable
- [ ] Privacy policy created
- [ ] Support email configured
- [ ] App description written
- [ ] Screenshots captured
- [ ] Version number incremented
- [ ] Build tested on real devices

### App Store Requirements

**Google Play:**
- Privacy policy URL
- Content rating questionnaire
- App icon (512x512)
- Screenshots (at least 2)
- Feature graphic (1024x500)
- APK/AAB file

**Apple App Store:**
- Privacy policy URL
- Screenshots (at least 5 per device type)
- App preview video (optional)
- IPA file via TestFlight
- App category
- Keywords
- Support URL

## Version Management

Update version in:
1. `package.json` - `"version": "1.0.0"`
2. `android/app/build.gradle` - `versionCode` and `versionName`
3. `ios/App/App/Info.plist` - `CFBundleShortVersionString`

## Environment Configuration

For different environments, create:

- `.env.development` - Dev config
- `.env.staging` - Staging config  
- `.env.production` - Production config

Load in `src/main.tsx`:
```typescript
const env = import.meta.env.MODE;
```

## Security Considerations

1. **HTTPS Only** - Always use HTTPS in production
2. **Content Security Policy** - Configure CSP headers
3. **Permissions** - Only request necessary permissions
4. **Data Security** - Encrypt sensitive data in localStorage
5. **Code Signing** - Always sign APK/IPA files
6. **Dependency Updates** - Keep dependencies updated

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/docs)
- [iOS Developer Guide](https://developer.apple.com/documentation/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect)

## Support

For issues:
1. Check [Capacitor Community Forum](https://github.com/ionic-team/capacitor/discussions)
2. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
3. Check platform-specific documentation
4. Open issue on project repository
