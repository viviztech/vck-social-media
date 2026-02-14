# Phase 12: Play Store Preparation

## Goal
Prepare the VCK Social Media application for deployment to the Google Play Store.

## Proposed Changes

### 1. App Assets
- Install `@capacitor/assets` for generating icons and splash screens.
- Create a `resources` directory (if not exists) for source assets.
- **User Action Required:** User needs to place `logo.png` and `splash.png` in `resources/` folder.

### 2. Android Build Configuration
- Modify `android/app/build.gradle` to read signing configuration from environment variables (Keystore, Alias, Passwords).
- This allows secure signing in CI/CD without committing the keystore or passwords.

### 3. CI/CD Pipeline (GitHub Actions)
- Create `.github/workflows/android_build.yml`.
- Triggers on tag push (e.g., `v1.0.0`) or manual dispatch.
- Steps:
    1. Checkout code
    2. Setup Java & Node.js
    3. Install dependencies
    4. Build Next.js app (`npm run build:mobile`)
    5. Sync Capacitor (`npx cap sync`)
    6. Decode Keystore from secrets
    7. Build Android Bundle (AAB) & APK
    8. Upload artifacts to GitHub Release

### 4. Store Listing
- Create `store_listing.md` with:
    - App Title
    - Short Description
    - Full Description
    - Keywords/Tags
    - Feature Graphic/Screenshot requirements

## Verification Plan
- Verify `npx capacitor-assets generate` works (once images are provided).
- Verify `gradlew assembleRelease` works locally (if keystore env vars are set).
- Verify GitHub Action syntax (via online validator or dry run if possible).
