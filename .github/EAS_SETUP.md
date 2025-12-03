# EAS Build Automation Setup

This guide explains how to set up automatic builds from GitHub to EAS cloud.

## 📋 Prerequisites

1. **Expo Account**: You need an Expo account (you already have: `logi-dev`)
2. **EAS CLI**: Already configured
3. **GitHub Repository**: Already set up

## 🔐 Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. EXPO_TOKEN (Required)

This is your Expo access token for authentication.

**To get your Expo token:**

```bash
# Option 1: Using EAS CLI
eas whoami
# Then generate a token at: https://expo.dev/accounts/logi-dev/settings/access-tokens

# Option 2: Direct link
# Go to: https://expo.dev/accounts/logi-dev/settings/access-tokens
# Click "Create Token"
# Name it: "GitHub Actions"
# Copy the token
```

**Add to GitHub:**
1. Go to: https://github.com/dev-logi/credit-card-offer/settings/secrets/actions
2. Click "New repository secret"
3. Name: `EXPO_TOKEN`
4. Value: Paste your Expo token
5. Click "Add secret"

### 2. APPLE_ID (Optional - for auto-submit)

Your Apple ID email for TestFlight submission.

**Add to GitHub:**
1. Go to: https://github.com/dev-logi/credit-card-offer/settings/secrets/actions
2. Click "New repository secret"
3. Name: `APPLE_ID`
4. Value: `llogeshr@gmail.com`
5. Click "Add secret"

### 3. APPLE_APP_SPECIFIC_PASSWORD (Optional - for auto-submit)

App-specific password for Apple ID (required for TestFlight submission).

**To create an app-specific password:**
1. Go to: https://appleid.apple.com
2. Sign in with your Apple ID
3. Go to "Security" → "App-Specific Passwords"
4. Click "Generate Password"
5. Label: "GitHub Actions EAS"
6. Copy the password (you'll only see it once!)

**Add to GitHub:**
1. Go to: https://github.com/dev-logi/credit-card-offer/settings/secrets/actions
2. Click "New repository secret"
3. Name: `APPLE_APP_SPECIFIC_PASSWORD`
4. Value: Paste your app-specific password
5. Click "Add secret"

## 🚀 Workflow Files

Two workflows are available:

### 1. `eas-build.yml` (Basic Build)

**Triggers:**
- Automatically on push to `main` branch (when `mobile-app/**` files change)
- Manual trigger via GitHub Actions UI

**What it does:**
- Builds the app on EAS cloud
- Does NOT submit to TestFlight
- Use this for testing builds

### 2. `eas-build-and-submit.yml` (Build + Submit)

**Triggers:**
- Automatically on push to `main` branch (when app config or source files change)
- Manual trigger with option to auto-submit

**What it does:**
- Builds the app on EAS cloud
- Optionally submits to TestFlight automatically
- Use this for production releases

## 📝 How to Use

### Automatic Builds

**For basic builds:**
- Just push to `main` branch
- Any changes in `mobile-app/**` will trigger a build
- Check build status at: https://expo.dev/accounts/logi-dev/projects/tapwisely/builds

**For production builds with TestFlight submission:**
- Push changes to `mobile-app/app.json` or source files
- The workflow will build and optionally submit to TestFlight
- Make sure `APPLE_ID` and `APPLE_APP_SPECIFIC_PASSWORD` secrets are set

### Manual Builds

1. Go to: https://github.com/dev-logi/credit-card-offer/actions
2. Select the workflow you want to run
3. Click "Run workflow"
4. Choose:
   - Branch: `main` (or any branch)
   - Platform: `ios`, `android`, or `all`
   - Profile: `production`, `preview`, or `development`
   - Auto-submit: `true` or `false` (for build-and-submit workflow)
5. Click "Run workflow"

## 🔄 Build Number Management

The build number is managed in `mobile-app/app.json`:
- Increment `buildNumber` before pushing to trigger a new build
- The workflow will use the build number from `app.json`

**Example:**
```json
{
  "ios": {
    "buildNumber": "4"  // Increment this for each new build
  }
}
```

## 📊 Monitoring Builds

**Expo Dashboard:**
- https://expo.dev/accounts/logi-dev/projects/tapwisely/builds

**GitHub Actions:**
- https://github.com/dev-logi/credit-card-offer/actions

**App Store Connect:**
- https://appstoreconnect.apple.com
- Check TestFlight tab for submitted builds

## 🛠 Troubleshooting

### Build Fails

1. **Check GitHub Actions logs:**
   - Go to: https://github.com/dev-logi/credit-card-offer/actions
   - Click on the failed workflow run
   - Check the error messages

2. **Check EAS build logs:**
   - Go to: https://expo.dev/accounts/logi-dev/projects/tapwisely/builds
   - Click on the failed build
   - Review the build logs

3. **Common issues:**
   - Missing `EXPO_TOKEN` secret
   - Invalid Expo token
   - Build configuration errors
   - Missing dependencies

### Auto-Submit Fails

1. **Check secrets:**
   - Verify `APPLE_ID` is set correctly
   - Verify `APPLE_APP_SPECIFIC_PASSWORD` is valid
   - App-specific passwords expire if revoked

2. **Check Apple credentials:**
   - Make sure your Apple Developer account is active
   - Verify the app exists in App Store Connect
   - Check that certificates are valid

## 🎯 Best Practices

1. **Increment build number** before pushing to main
2. **Test locally first** before triggering automatic builds
3. **Use manual triggers** for important releases
4. **Monitor builds** in both GitHub Actions and Expo dashboard
5. **Keep secrets secure** - never commit tokens to the repository

## 📚 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo GitHub Action](https://github.com/expo/expo-github-action)

