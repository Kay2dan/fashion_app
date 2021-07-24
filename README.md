# NOTES

## How to setup android-studio dev environment

- Download and install Android Studio
- Edit the `.zshrc / .bashrc` file to add the following links to where android
  is installed. On linux mint, Android is installed at `~/Android/*`.

  ```
    export PATH=$PATH:~/Documents/apps/android-studio/bin
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools

  ```

- Login again to load the sys-links in `.zshrc`
- In Studio, follow the setup guide. Follow the guide as per expo documentation
  on installing the android sdk and tools.
- This is another good quide to follow.
  https://blog.waldo.io/run-a-react-native-app/
- If we get error `adb not found`, then we have to uninstall the build-tools
  within studio sdk section and let gradle sync, then go back and reinstall them
  and let them sync again.
- Now open the project folder (this app) in Studio.
- Go to: File > Project Structure > Project > Project SDK
- If there is no sdk selected, then from the dropdown, `add android sdk`,
  navigate to the `~/Android/sdk` folder or whereever the android sdk is
  installed.
- Now start expo app and android emulator should open when selected from metro
  menu.
