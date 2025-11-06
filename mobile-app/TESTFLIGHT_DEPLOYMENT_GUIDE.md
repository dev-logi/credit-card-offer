# TapWisely - TestFlight Deployment Guide

## ✅ Completed Steps

1. **App Configuration** ✓
   - Updated `app.json` with TapWisely branding
   - Bundle ID: `com.tapwisely.app`
   - Version: 1.0.0
   - Configured iOS permissions and encryption settings

2. **Production API Connection** ✓
   - Updated API service to use production Railway URL
   - API Endpoint: `https://web-production-f63eb.up.railway.app`

3. **Expo EAS Project Setup** ✓
   - Created Expo project: TapWisely
   - Project ID: `5e10710e-2de7-4324-a4ba-e27f4739a710`
   - Account: logi-dev
   - Linked local project to Expo

4. **Build Configuration** ✓
   - Created `eas.json` with production profile
   - Configured remote version management
   - Set encryption compliance settings

## 🚀 Next Steps - Build & Deploy to TestFlight

### Prerequisites Check

Before proceeding, ensure:
- ✅ You have an active **Apple Developer Program** membership ($99/year)
- ✅ You've **accepted the Apple Developer Program License Agreement**
  - Go to: [Apple Developer Member Center](https://developer.apple.com/membercenter)
  - Sign in and accept any pending agreements

### Step 1: Build iOS App for TestFlight

Open Terminal and navigate to the mobile-app directory:

```bash
cd /Users/logesh/projects/credit-card-offer/mobile-app
```

Start the build:

```bash
eas build --platform ios --profile production
```

**What will happen:**

1. EAS will prompt you to **sign in to your Apple Developer account**
   - It will open a browser window for authentication
   - Sign in with your Apple ID (llogeshr@gmail.com)
   - Follow the two-factor authentication prompts

2. EAS will ask to create **Distribution Certificate** and **Provisioning Profile**
   - Answer "Yes" to let EAS manage these automatically
   - EAS will handle all the iOS credential management

3. The build will be queued on Expo's cloud servers
   - Build time: ~10-15 minutes
   - You'll get a URL to track build progress

4. When complete, you'll receive a `.ipa` file ready for TestFlight

### Step 2: Submit to TestFlight

Once the build completes, submit it to App Store Connect:

```bash
eas submit --platform ios --latest
```

**What will happen:**

1. EAS will prompt for your **Apple ID credentials**:
   - Apple ID: `llogeshr@gmail.com`
   - App-specific password (you'll need to create one)

2. **Create App-Specific Password** (if needed):
   - Go to: [Apple ID Account Page](https://appleid.apple.com)
   - Sign in → Security → App-Specific Passwords
   - Click "Generate Password"
   - Label it: "EAS Submit"
   - Copy the password (you'll only see it once)

3. EAS will ask if you want to create a new app in App Store Connect
   - Answer "Yes"
   - App Name: `TapWisely`
   - Bundle ID: Will auto-select `com.tapwisely.app`
   - SKU: You can use `tapwisely-001`

4. The app will be uploaded to TestFlight
   - Upload time: ~5-10 minutes
   - Processing time on Apple's servers: ~10-30 minutes

### Step 3: Configure TestFlight

After submission, go to [App Store Connect](https://appstoreconnect.apple.com):

1. Navigate to **My Apps** → **TapWisely**

2. Click the **TestFlight** tab

3. Wait for Apple's automated review (usually < 24 hours)

4. **Add External Testers**:
   - Click "External Testing" in the sidebar
   - Create a new test group (e.g., "Friends & Family")
   - Add testers by email
   - Enable automatic distribution for new builds

5. **Test Information**:
   - App Description: "TapWisely helps you choose the best credit card for every purchase"
   - Feedback Email: Your email
   - Check the export compliance box

### Step 4: Invite Testers

1. In TestFlight settings, click "Add Testers"

2. Enter email addresses of your friends/family

3. They'll receive an email invite with:
   - Link to install TestFlight app
   - Link to install TapWisely

4. Testers can install within minutes!

## 📱 Alternative: Local Build & Test

If you want to test locally on your Mac first:

```bash
# Build for iOS Simulator
eas build --platform ios --profile development --local
```

This requires:
- Xcode installed
- About 30-60 minutes for local build
- Will create a simulator-compatible build

## 🔧 Troubleshooting

### "Agreement Update Required"
- Go to [Apple Developer](https://developer.apple.com)
- Accept the license agreement
- Wait 5-10 minutes for it to sync

### "Invalid Credentials"
- Make sure you're using an app-specific password
- Don't use your main Apple ID password for EAS

### "Bundle ID Already Exists"
- Check App Store Connect to see if the app was already created
- Or change the bundle ID in `app.json`

### "Build Failed"
- Check the build logs in the Expo dashboard
- Common issues: Missing dependencies, TypeScript errors
- Fix locally and rebuild

## 📊 Build Status Tracking

Monitor your builds at:
- **Expo Dashboard**: https://expo.dev/accounts/logi-dev/projects/tapwisely/builds
- **App Store Connect**: https://appstoreconnect.apple.com

## 🎉 Success!

Once your app is in TestFlight:
- ✅ Friends and family can install it
- ✅ You can gather feedback
- ✅ You can test the full production experience
- ✅ Push updates as often as you want

To update the app later:

```bash
# Update version in app.json, then:
eas build --platform ios --profile production --auto-submit
```

---

## 📝 Important Files

- `mobile-app/app.json` - App configuration
- `mobile-app/eas.json` - Build configuration
- `mobile-app/src/services/api.service.ts` - Production API endpoint

## 🆘 Need Help?

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Expo Discord](https://chat.expo.dev/)

---

**Ready to deploy!** Run the commands above and your app will be live on TestFlight! 🚀

