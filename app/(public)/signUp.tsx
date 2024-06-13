//signup page

import { Alert, Button, SafeAreaView, StyleSheet } from "react-native";
import React, { useState, useRef } from "react";
import { View, Text, TextInput } from "@/components/Themed";
// import { TextInput } from "react-native";
import Parse from "parse/react-native";
import handleServerError from "@/functions/ServerErrorAlert";
import {useRouter} from "expo-router";
import { MonoText, WarningText } from "@/components/StyledText";
import Styles from "@/components/UniversalStyles";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email regex pattern 

function validatePassword(password: string) {
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; //alphanumeric, upperand lowercases, 8 characters
  return pwdRegex.test(password);
}

export default function SignUp() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    // Create refs for TextInput
    const secondTextInputRef = useRef(null);
    const thirdTextInputRef = useRef(null);
    const fourthTextInputRef = useRef(null);


    const signUp = async (username: string, password: string, email: string ) => {
    try {
      const result = await Parse.Cloud.run("createUser", {
        username,
        password,
        email,
      });

      console.log("username: ", username);
      console.log("password: ", password);
      console.log("email: ", email);
      console.log("result: ", result);

      if (!result.success) {
        Alert.alert("Failed to sign up user", result.message);
        return;
      }
      Alert.alert(
        "Success!",
        `User ${username} was successfully created!\nPlease check your email to complete verification`
      );
      //navigate back to home
      router.back();
      return result;
    } catch (error) {
        console.error(error);
        handleServerError(
            "Server Error: Failed to connect to server",
            error as Error,
        );
    }
  };

  const doUserRegistration = async function () {
    console.log("Button Pressed");
    // Note that these values come from state variables that we've declared before

    const handleEmailSubmit = () => {
    console.log("Func Call");
    if (!emailRegex.test(email)) {
        Alert.alert("Invalid email", "Please enter a valid email address");
        console.log("not an email");
        return;
    }
    if (validatePassword(password)) {
        console.log("Password is valid!");
    } else {
        Alert.alert("Password not strong enough!");
        console.log("Password is invalid. Please choose a stronger password.");
        return;
    }
    // do something with valid email
    signUp(username, password, email);
    };
    handleEmailSubmit();
  };
    
    return (
        <SafeAreaView style = {{flex:1}}>
            <View style = {{justifyContent: "center", flex:1, alignItems:"center"}}>
                <Text>Sign Up</Text>
                <MonoText>Email</MonoText>
                <TextInput
                style={Styles.textInput}
                value={username}
                placeholder={"Username"}
                onChangeText={(text) => setUsername(text)}
                autoCapitalize={"none"}
                autoFocus = {true} 
                enterKeyHint="next"    
                keyboardType={"default"}
                onSubmitEditing={() => secondTextInputRef.current.focus()}
                />
                <TextInput
                style={Styles.textInput}
                value={email}
                placeholder={"Email"}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize={"none"}
                keyboardType={"email-address"}
                enterKeyHint="next"
                ref={secondTextInputRef}
                onSubmitEditing={() => thirdTextInputRef.current.focus()}
                />
                <Text>
                Password must have 8 charachters, alphanumeric and mixed case
                </Text>

                <TextInput
                style={Styles.textInput}
                value={password}
                placeholder={"Password"}
                secureTextEntry = {true}
                onChangeText={(text) => setPassword(text)}
                keyboardType={"default"}
                enterKeyHint="next"
                ref={thirdTextInputRef}
                onSubmitEditing={() => fourthTextInputRef.current.focus()}
                />
                <TextInput
                style={Styles.textInput}
                value={confirmPassword}
                placeholder={"Confirm Password"}
                secureTextEntry = {true}
                onChangeText={(text) => setConfirmPassword(text)}
                keyboardType={"default"}
                ref={fourthTextInputRef}
                enterKeyHint="done"
                onSubmitEditing={() => {doUserRegistration()}}
                />
                {password !== confirmPassword && (
                    <WarningText>Passwords do not match!</WarningText>
                )}
                
                <Button
                title="Sign Up"
                onPress={() => {
                    doUserRegistration();
                }}
                disabled={password !== confirmPassword || password.length < 8}
                />
            </View>
        </SafeAreaView>
)
};

const styles = StyleSheet.create({
    textInput: {borderWidth:1, borderColor: "yellow"},
  })
  