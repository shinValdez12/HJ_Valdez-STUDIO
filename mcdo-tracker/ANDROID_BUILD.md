# Android Build & Configuration Guide

Complete guide for building, testing, and publishing Android apps with Capacitor.

## Prerequisites

### Required Software
- Android Studio 2021.1.1+
- Android SDK API Level 31+
- Java Development Kit (JDK) 11+
- Gradle 7.0+

### Install Android Studio

1. Download from [Android Studio](https://developer.android.com/studio)
2. Run installer
3. Open Android Studio
4. SDK Manager > SDK Platforms > Install API 31+
5. SDK Manager > SDK Tools > Install:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - CMake (optional)
   - NDK (optional)

### Set Environment Variables (Windows)

1. Open Environment Variables:
   - Settings > System > Environment Variables

2. Add new User Variables:
   ```
   ANDROID_SDK_ROOT: C:\Users\YourUsername\AppData\Local\Android\Sdk
   ANDROID_HOME: C:\Users\YourUsername\AppData\Local\Android\Sdk
   JAVA_HOME: C:\Program Files\Android\Android Studio\jre
   ```

3. Add to PATH:
   ```
   C:\Users\YourUsername\AppData\Local\Android\Sdk\tools
   C:\Users\YourUsername\AppData\Local\Android\Sdk\platform-tools
   C:\Users\YourUsername\AppData\Local\Android\Sdk\build-tools\33.0.0
   ```

4. Restart computer

### Verify Installation

```bash
java -version          # Should show Java 11+
adb version            # Should show ADB version
gradle --version       # Should show Gradle 7.0+
```

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── AndroidManifest.xml      # App configuration
│   │   │   ├── kotlin/com/mcdonalds/    # Java/Kotlin code
│   │   │   └── res/                     # Resources (icons, strings)
│   │   │       ├── drawable/            # Icons & images
│   │   │       ├── values/              # Colors, strings
│   │   │       └── mipmap/              # App icons
│   │   ├── test/                        # Unit tests
│   │   └── androidTest/                 # Integration tests
│   └── build.gradle                     # App build configuration
├── gradle.properties                    # Gradle settings
└── settings.gradle                      # Module configuration
```

## Android Configuration

### AndroidManifest.xml

Location: `android/app/src/main/AndroidManifest.xml`

Key configurations:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
    <!-- Required permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Optional permissions (uncomment if needed) -->
    <!-- <uses-permission android:name="android.permission.CAMERA" /> -->
    <!-- <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /> -->
    
    <application>
        <activity
            android:name=".MainActivity"
            android:theme="@style/AppTheme"
            android:screenOrientation="portrait">
        </activity>
        
        <!-- Splash screen (handled by Capacitor) -->
        <activity
            android:name="com.getcapacitor.SplashActivity"
            android:theme="@style/SplashScreenTheme" />
    </application>
</manifest>
```

### Build Configuration

Location: `android/app/build.gradle`

```gradle
android {
    namespace = "com.mcdonalds.timetracker"
    
    compileSdk 33
    
    defaultConfig {
        applicationId = "com.mcdonalds.timetracker"
        minSdk 21
        targetSdk 33
        versionCode = 1
        versionName = "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled = true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig = signingConfigs.release
        }
        debug {
            debuggable = true
        }
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}
```

### Configure Signing

For release builds, create signing configuration:

1. Generate keystore:
```bash
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias mcdo-tracker
```

2. Move keystore to `android/` folder

3. Configure in `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        keyAlias = "mcdo-tracker"
        keyPassword = "YOUR_KEY_PASSWORD"
        storeFile = file("../release.keystore")
        storePassword = "YOUR_STORE_PASSWORD"
    }
}

buildTypes {
    release {
        signingConfig = signingConfigs.release
    }
}
```

## App Icons & Splash Screen

### Generate App Icons

Place icons in `android/app/src/main/res/`:

- `mipmap-xxxhdpi/ic_launcher.png` (192x192)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)

Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/):
1. Upload icon image
2. Download all sizes
3. Extract to `android/app/src/main/res/`

### Configure Splash Screen

Location: `android/app/src/main/res/values/styles.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="SplashScreenTheme" parent="Theme.AppCompat.Light">
        <item name="android:windowBackground">@drawable/splash</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowActionBar">false</item>
    </style>
    
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/accent</item>
    </style>
</resources>
```

Create splash screen image:
- Location: `android/app/src/main/res/drawable/splash.xml` or `splash.png`
- Size: 1080x1920 (portrait)

## Building APK

### Development APK

1. Open Android Studio
2. Select Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Wait for build to complete
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

Or via command line:

```bash
cd android
./gradlew assembleDebug
```

### Release APK

With signing configured:

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

Size typically: 5-15 MB

## Building App Bundle (Play Store)

Required for Google Play Store distribution.

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Size: 4-12 MB (Play Store compresses based on device)

## Testing

### Virtual Device (Emulator)

1. Open Android Studio
2. Tools > Device Manager
3. Create Virtual Device:
   - Choose device (e.g., Pixel 4)
   - Select OS image (API 31+)
   - Finish
4. Click Play to start emulator
5. Run app: Build > Run

### Physical Device

1. Enable Developer Mode:
   - Settings > About > Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings > Developer Options > USB Debugging
3. Connect via USB
4. Authorize connection on device
5. Run in Android Studio: Build > Run

### Command Line Testing

```bash
# List connected devices
adb devices

# Install APK
adb install -r path/to/app.apk

# Uninstall app
adb uninstall com.mcdonalds.timetracker

# View logs
adb logcat | grep "chromium"

# Clear app data
adb shell pm clear com.mcdonalds.timetracker

# Remote debug in Chrome
# 1. Open chrome://inspect
# 2. Enable USB debugging
# 3. App appears in list
```

## Google Play Store Deployment

### Prerequisites

- Google Play Developer Account ($25 one-time fee)
- Signed release APK/AAB
- App metadata (description, screenshots, etc.)

### Steps

1. Sign up at [Google Play Console](https://play.google.com/console)

2. Create app:
   - Click "Create app"
   - Enter app name, default language, app type, category

3. Fill app information:
   - Descriptions (short, full)
   - Screenshots (5+ different screen types)
   - Feature graphic (1024x500)
   - Icon (512x512)
   - Content rating

4. Set up content rating:
   - Answer questionnaire
   - Get rating

5. Set up pricing & distribution:
   - Free or paid
   - Select countries
   - Consent checkboxes

6. Upload APK/AAB:
   - Go to Release > Production
   - Click "Create new release"
   - Upload APK or AAB file
   - Review summary

7. Submit for review:
   - Click "Review release"
   - Click "Start rollout"
   - Google reviews (usually 24-48 hours)

8. Monitor status:
   - Metrics dashboard
   - Reviews and ratings
   - Crashes & ANRs

### Store Listing Requirements

- App title: 50 character max
- Short description: 80 character max
- Full description: 4000 character max
- Tagline: 30 character max
- Screenshots: 2-8 required, 1280x720 or 1440x810
- Feature graphic: 1024x500 (optional)
- Promotional graphics: 180x120 (optional)
- Icon: 512x512 square
- Cover image: 1024x500 (optional)

## Version Management

Update version in `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode = 1      // Increment for each release (1, 2, 3...)
    versionName = "1.0.0" // User-facing version
}
```

**Rules:**
- versionCode must always increase
- versionCode used for update checking
- versionName shown to users
- Format: MAJOR.MINOR.PATCH

## Proguard & Minification

For release builds, enable code obfuscation:

`android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled = true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

Create `android/app/proguard-rules.pro`:
```
# Keep Capacitor plugins
-keep class com.getcapacitor.** { *; }
-keepclassmembers class * extends com.getcapacitor.CapacitorPlugin { *; }

# Keep Web View
-keepclassmembers class android.webkit.WebView { *; }

# Keep support library
-keep class androidx.** { *; }
```

## Troubleshooting

### Build Fails

```
Error: Program type already present: android.support.design.widget.CoordinatorLayout$Behavior
```

**Solution:** Check for duplicate dependencies, update all support libraries

### APK Won't Install

```
INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES
```

**Solution:** Uninstall old app first: `adb uninstall com.mcdonalds.timetracker`

### App Crashes on Start

**Solution:**
- Check logcat: `adb logcat | grep -i "crash"`
- Verify minSdkVersion matches device
- Check AndroidManifest.xml syntax

### White Blank Screen

**Solution:**
- Verify `dist/` folder built correctly
- Check web console in DevTools
- Clear app cache: `adb shell pm clear com.mcdonalds.timetracker`

## Resources

- [Android Developer Guide](https://developer.android.com/docs)
- [Android Studio Documentation](https://developer.android.com/studio/intro)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)

## Quick Commands Reference

```bash
# Setup
npx cap add android

# Development
npx cap open android    # Open in Android Studio
npm run cap:build:android

# Build
cd android
./gradlew clean
./gradlew assembleDebug     # Development APK
./gradlew assembleRelease   # Production APK
./gradlew bundleRelease     # Play Store AAB

# Testing
adb devices
adb install -r app.apk
adb shell pm clear com.mcdonalds.timetracker
adb logcat
```
