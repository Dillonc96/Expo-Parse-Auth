import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import parse from "parse/react-native";

import { useColorScheme } from "@/components/useColorScheme";
import AuthProvider from "@/context/AuthProvider";

async function getUserObject() {
  const user = await customStorage.getItem("user");
  const userObject = JSON.parse(user as string);
  return userObject;
}
const user = getUserObject();
console.log("user: ", user);
console.log("user session token: ", user?.sessionToken);
//set up expo-notifications
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import customStorage from "@/functions/CustomStorage";

async function registerForPushNotificationsAsync() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = status;

  if (status !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  } else {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("expo token: ",token);
    // Save the token to your backend server or database
    //create parse cloud code to update the user with the token
    const recordToken = parse.Cloud.run('recordToken', { token: token, sessionToken: user?.sessionToken });
  }

}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}


function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)/(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(public)/login" options={{ headerShown: true, title: "Login" }} />
          <Stack.Screen name="(public)/signUp" options={{ headerShown: true, title: "SignUp" }} />
          <Stack.Screen name="modal" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: true, title: "Landing Page Title" }} />
          <Stack.Screen name="(public)/restorePassword" options={{ headerShown: true, title: "Restore Password" }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
