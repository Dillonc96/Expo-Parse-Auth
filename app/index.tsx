import React from "react";
import { Text, View } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useColorScheme } from "react-native";

const goToLogin = () => {
  router.push("/login")
};
const goToSignUp = () => {
  router.push("/signUp")
};
const consoleLogPreview = () => {
  console.log("Preview Pressed")
};
const forgotPassword = () => {
  router.push("/restorePassword")
};

export default function Page() {
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
      <Text>Landing Page Text</Text>
      <Text>{useColorScheme()}</Text>
      <View style={{flex: 0.4, paddingVertical: 20, justifyContent: "space-between", width: "50%"}}>
      <Button title="Login" onPress={goToLogin} />
      <Button title="Sign Up" onPress={goToSignUp}/>
      <Button title="Preview Clinics and Coaches" onPress={consoleLogPreview}/>
      <Button title="Forgot Password" onPress={forgotPassword}/>
      </View>
      </View>
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  button: {paddingVertical: 10},
})