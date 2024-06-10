import { router } from "expo-router";
import { Alert } from "react-native";


const handleServerError = (title: string, error: Error) => {  
  Alert.alert(
    title,
    "Check data connection or try logging in again,\nonly one device can be logged in at a time:\n" +
      error.toString(),
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => router.replace("LogInScreen"), // could be replaced with calling a login modal?
      },
    ]
  );
};

export default handleServerError;