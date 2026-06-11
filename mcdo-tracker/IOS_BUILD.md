# iOS Build & Configuration Guide

Complete guide for building, testing, and publishing iOS apps with Capacitor on macOS.

## Prerequisites

### Required Software
- macOS 12.0+
- Xcode 13.0+
- iOS SDK 13.0+
- CocoaPods
- Node.js 16+

### Install Xcode

1. Download from [App Store](https://apps.apple.com/us/app/xcode/id497799835)
2. Or download from [Apple Developer](https://developer.apple.com/download/)
3. Install Command Line Tools:
```bash
xcode-select --install
```

### Install CocoaPods

```bash
sudo gem install cocoapods
pod repo update
```

### Verify Installation

```bash
xcode-select -p          # Should show Xcode path
xcodebuild -version      # Should show Xcode version
pod --version            # Should show CocoaPods version
```

## Project Structure

```
ios/
├── App/
│   ├── App.xcworkspace          # Xcode workspace (open this!)
│   ├── App.xcodeproj            # Xcode project
│   ├── App/
│   │   ├── AppDelegate.swift    # App entry point
│   │   ├── ViewController.swift  # Main view controller
│   │   ├── Info.plist           # App configuration
│   │   └── Assets.xcassets/     # Icons, images
│   ├── Podfile                  # CocoaPods dependencies
│   └── Podfile.lock             # Locked dependency versions
└── Pods/                        # CocoaPods dependencies
```

## iOS Configuration

### Info.plist Configuration

Location: `ios/App/App/Info.plist`

Key settings:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    
    <key>CFBundleDisplayName</key>
    <string>CrewTime</string>
    
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    
    <key>CFBundleIdentifier</key>
    <string>com.mcdonalds.timetracker</string>
    
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    
    <key>CFBundleName</key>
    <string>CrewTime</string>
    
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    
    <key>CFBundleVersion</key>
    <string>1</string>
    
    <key>LSRequiresIPhoneOS</key>
    <true/>
    
    <!-- Minimum iOS version -->
    <key>MinimumOSVersion</key>
    <string>13.0</string>
    
    <!-- Supported orientations -->
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
    
    <!-- Status bar appearance -->
    <key>UIStatusBarStyle</key>
    <string>UIStatusBarStyleDefault</string>
    
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <false/>
    
    <!-- Camera permission (if needed) -->
    <!-- <key>NSCameraUsageDescription</key> -->
    <!-- <string>This app needs camera access</string> -->
    
    <!-- Location permission (if needed) -->
    <!-- <key>NSLocationWhenInUseUsageDescription</key> -->
    <!-- <string>This app needs location access</string> -->
    
</dict>
</plist>
```

### Podfile Configuration

Location: `ios/App/Podfile`

```ruby
platform :ios, '13.0'

target 'App' do
  pod 'Capacitor'
  pod 'CapacitorCordova'
  # Add other pods as needed
  
  post_install do |installer|
    # Modify build settings
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # iOS 13+ requirements
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
    end
  end
end
```

Update pods:
```bash
cd ios/App
pod install
pod update
```

### Build Settings

In Xcode:
1. Select "App" project
2. Select "App" target
3. Build Settings:
   - iOS Deployment Target: 13.0
   - Code Signing Identity: Apple Development
   - Team ID: Your team ID
   - Bundle Identifier: com.mcdonalds.timetracker

## App Icons & Launch Screen

### App Icons

Generate icons at these sizes and place in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`:

- 20x20 (notification)
- 29x29 (settings)
- 40x40 (spotlight)
- 58x58 (settings, spotlight)
- 60x60 (app)
- 76x76 (iPad)
- 80x80 (spotlight, iPad)
- 87x87 (settings)
- 120x120 (app)
- 152x152 (iPad)
- 167x167 (iPad Pro)
- 180x180 (app, iPhone 6+)
- 1024x1024 (App Store)

Use [App Icon Generator](https://www.appicon.co/) or Xcode's built-in tool:

1. Open Assets.xcassets
2. Select AppIcon
3. Drag and drop icons

### Launch Screen

Location: `ios/App/App/Base.lproj/LaunchScreen.storyboard`

Configure in Xcode Interface Builder or use Default LaunchScreen (white).

### Dark Mode Support

For dark mode support:

1. Create dark variant of icons
2. In Assets.xcassets, for each image:
   - Show Attributes Inspector
   - Appearance dropdown: Any, Light, Dark
   - Set images for each variant

## Building & Testing

### On Simulator

1. Open Xcode workspace:
```bash
cd ios/App
open App.xcworkspace
```

2. Select simulator:
   - Product > Destination > Select simulator
   - Or click device dropdown in top bar

3. Build and run:
   - Product > Run (Cmd+R)
   - Or click Play button

### On Physical Device

1. Connect iPhone via USB
2. Trust computer on device
3. In Xcode:
   - Select iPhone in Destination
   - Product > Run

4. On first run, enable developer mode:
   - Settings > Privacy & Security > Developer Mode > Toggle On
   - Restart device
   - Unplug and replug USB

### Testing with Safari DevTools

1. Connect iPhone to Mac
2. Open Safari on Mac
3. Safari > Develop > [iPhone] > App
4. Debug like in Chrome

### Logging

View app logs in Xcode:
1. Window > Devices and Simulators
2. Select device
3. View logs in bottom panel

Or via command line:
```bash
# View logs
log stream --predicate 'process == "App"'

# Filter for errors
log stream --predicate 'process == "App" AND level == error'
```

## Building for Release

### Create Archive

1. In Xcode:
   - Select Generic iOS Device (not simulator)
   - Product > Archive
   - Organizer window opens

2. Select archive and click "Distribute App"

3. Select "App Store Connect"

4. Select "Upload"

5. Configure signing:
   - Team ID: Select your team
   - Signing: Automatic
   - Click Next

6. Review and upload

### Via Command Line

Create exportOptions.plist:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
```

Build and archive:
```bash
cd ios/App

xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath App.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath App.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath output
```

## App Store Deployment

### Requirements

- Apple Developer Account ($99/year)
- App bundle identifier: com.mcdonalds.timetracker
- Signed IPA or upload via Xcode
- App metadata and screenshots

### Steps

1. Sign up at [App Store Connect](https://appstoreconnect.apple.com)

2. Create app:
   - Click "My Apps"
   - Click "+"
   - Select "New App"
   - Fill bundle identifier: com.mcdonalds.timetracker
   - Other required fields

3. Prepare submission:
   - Screenshots (at least 2 for each device type)
     - iPhone: 5.5" display (1242x2208)
     - iPad: 12.9" display (2048x2732)
   - App preview (optional video)
   - Description (4000 characters)
   - Keywords
   - Support URL
   - Privacy policy URL
   - Category
   - Rating

4. Upload IPA:
   - Product (TestFlight) > Builds
   - Upload via Xcode or Transporter
   - Wait for processing (10-30 mins)
   - Internal testing
   - Submit to TestFlight for external testing

5. Submit for review:
   - Version > Submission
   - Answer questions
   - Click "Submit for Review"
   - Apple reviews (typically 24-48 hours)

6. Monitor status:
   - App Store > Submissions
   - Check review status
   - Read rejection reasons if needed

### Screenshots Requirements

**iPhone:**
- 1242x2208 (or 1170x2532 for newer models)
- 2-10 screenshots
- Show key features

**iPad:**
- 2048x2732 (or 2732x2048 for landscape)
- 2-10 screenshots
- Show key features

**Tips:**
- Use realistic app screenshots
- No mock-ups or marketing images
- Include captions explaining features
- Highlight most important features

### App Metadata

**App Name:** CrewTime (max 30 chars)

**Subtitle:** Employee Time Tracker (max 30 chars)

**Description:** 
"Track time, calculate payroll, and manage shifts effortlessly. Built for McDonald's crew members."

**Keywords:** 
time, tracking, payroll, crew, schedule, mcd

**Support URL:** 
https://yourcompany.com/support

**Privacy Policy URL:** 
https://yourcompany.com/privacy

**Category:** Business or Productivity

## TestFlight

Test before App Store submission:

1. In App Store Connect:
   - TestFlight > Builds
   - Select build
   - Add testers (up to 10,000)

2. Testers receive email
3. Install via TestFlight app
4. Get feedback before submission

## Code Signing

### Automatic Signing (Recommended)

1. In Xcode:
   - Select project
   - Build Settings > Signing
   - Automatic: On
   - Team: Select your team

Xcode handles certificates automatically.

### Manual Signing

1. Create certificates at [Apple Developer](https://developer.apple.com)
2. Create provisioning profiles
3. Download and install
4. In Xcode:
   - Automatic: Off
   - Signing Certificate: Select certificate
   - Provisioning Profile: Select profile

## Version Management

Update version in two places:

1. `ios/App/App/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>  <!-- User-facing version -->

<key>CFBundleVersion</key>
<string>1</string>      <!-- Build number -->
```

2. In Xcode:
   - Select App target
   - General tab
   - Version: 1.0.0
   - Build: 1

**Rules:**
- Version: MAJOR.MINOR.PATCH (1.0.0)
- Build number: increment with each release
- Build number must be unique per release
- Version shown to users, build for tracking

## Troubleshooting

### Pod Installation Fails

```bash
# Clear cache
rm -rf ios/App/Pods ios/App/Podfile.lock

# Reinstall
cd ios/App
pod install
```

### Code Signing Errors

```
Code Signing Error: Certificate is revoked
```

**Solution:**
- Revoke and create new certificate at Apple Developer
- Update in Xcode

### Build Fails

```
Undefined symbol: _objc_msgSend
```

**Solution:**
- Clean build: Cmd+Shift+K
- Delete Derived Data: ~/Library/Developer/Xcode/DerivedData
- Rebuild

### App Crashes on Startup

Check logs:
1. Xcode > Console
2. Search for "Exception"
3. Check error message
4. Verify Info.plist syntax

### White Blank Screen

**Solution:**
- Check main.tsx for errors
- Verify React root element exists
- Clear app cache: Cmd+Shift+K in Xcode

## Resources

- [Xcode Documentation](https://developer.apple.com/xcode/)
- [App Store Connect Help](https://help.apple.com/app-store-connect)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Swift & Objective-C](https://developer.apple.com/swift/)

## Quick Commands Reference

```bash
# Setup
npx cap add ios

# Development
npx cap open ios        # Open in Xcode
npm run cap:build:ios

# Build
cd ios/App
pod install
open App.xcworkspace

# Via Xcode
# Product > Build (Cmd+B)
# Product > Run (Cmd+R)
# Product > Archive

# Testing
# Connected device + Product > Run
# Or select simulator + Product > Run

# Release
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath App.xcarchive \
  archive
```

## Next Steps

1. ✅ Capacitor iOS added
2. Open in Xcode: `npx cap open ios`
3. Test on simulator
4. Test on physical device
5. Configure signing and certificates
6. Create production archive
7. Upload to TestFlight
8. Submit to App Store
