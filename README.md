# Team 10 - Morgan Stanley code_to_give Hackathon

## Get started

0. Get Firebase module from Saul Almanzar on Slack. For security reasons, the Firebase configuration was not included in GitHub upload.

1. Install dependencies

   ```bash
   npm install
   ```

2. Due to Firebase implementation a prebuild must occur before starting app.

   ```bash
   npx expo prebuild
   ```

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## How to help

1. Clone the project

   ```bash
   git clone https://github.com/almanzarsaul/ms-crp.git
   ```

2. Follow [Get started](#get-started) instructions
3. Create a new branch for any changes you'll make
   ```bash
   git checkout -b <branch-name>
   ```
4. After you've made changes, push the new branch to the repository
   ```bash
   git push -u origin <branch-name>
   ```

## Some notes

- Please try and use the COLOR_PRIMARY found in @assets/colors.ts
- Any Screen that requires a user to be authenticated should go into (protected).
- There are styled buttons in @app/(auth)/LoginScreen.tsx, try and reuse those to ensure consistency across app.

## Learn more about Expo and React Native

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
