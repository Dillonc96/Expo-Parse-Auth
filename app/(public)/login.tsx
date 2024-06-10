import React, { useRef, useState } from "react";
import { Text, View, TextInput } from "@/components/Themed";
import { Alert, Button, SafeAreaView, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthProvider";
// import { TextInput } from "react-native";
import Styles from "@/components/UniversalStyles";

export default function login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [isLoading, setIsLoading] = useState(false); // control activity indicator
  
  // Create refs for TextInput
  const secondTextInputRef = useRef(null);

  const { login } = useAuth();

  const _login = (username: string, password: string) => {
    if (username === "" || password === "")
      Alert.alert("Error", "Please enter a username and password");
    else {
      //setIsLoading(true); // show activity indicator
      console.log("logging in");
      login(username, password);
    }
  };

  return (
    <SafeAreaView style = {{flex:1}}>
      <View style = {{justifyContent: "center", flex:1, alignItems:"center"}}>
        <Text>Log in</Text>
        <Text style = {{paddingVertical:10, textAlign: "center"}} >Username</Text>
        <TextInput
          style={Styles.textInput}
          placeholder="Username"
          autoCapitalize = "none"
          value={username}
          onChangeText={setUsername}
          autoFocus = {true}     
          returnKeyType = "next"  
          onSubmitEditing={() => secondTextInputRef.current.focus()}          
        />
        <Text style = {{paddingVertical:10, textAlign: "center"}} >Password</Text>
        <TextInput
          style={Styles.textInput}
          placeholder="Password"
          autoCapitalize = "none"
          value={password}
          onChangeText={setPassword}
          secureTextEntry = {true}
          ref={secondTextInputRef}
          enterKeyHint="done"
          onSubmitEditing={() => _login(username, password)}
        />
        <View style = {{paddingVertical:20}}>
        <Button 
          title="Login" 
          onPress={() => _login(username, password)}
          disabled={password.length < 1}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {borderWidth:1, borderColor: "yellow"},
})


