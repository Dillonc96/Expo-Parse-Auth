import React, {useState} from 'react';
import { Text, View, TextInput } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Button } from 'react-native';
import Styles from '@/components/UniversalStyles';
import { router } from 'expo-router';
import handleServerError from '@/functions/ServerErrorAlert';

export default function restorePassword() {

    // Your state variable
  const [email, setEmail] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const doUserPasswordReset = async function () {
    // Reset password
    const resetPassword = async ({ email }: { email: string }) => {
      try {
        const result = await Parse.Cloud.run("resetPassword", { email });
        //check email format
        if (!emailRegex.test(email)) {
          Alert.alert("Invalid email", "Please enter a valid email address");
          console.log("not an email");
          return;
        }
        if (!result.success) {
          Alert.alert("Failed to reset password", result.message);
          return;
        }
        Alert.alert(
          "Success!",
          `Please check ${email} to proceed with password reset.`
        );
        // Redirect user to your login screen
        router.push("/index");
        console.log(result);

        return result;
      } catch (error: any) {
        console.error(error);
        handleServerError(
          "Server Error: Can't curently reset password",
          error
        );
      }
    };
    resetPassword({ email });

    // Note that this value come from state variables linked to your text input
  };


  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{justifyContent: "center", flex:1, alignItems:"center"}}>
            <Text>Restore Password</Text>
            <Text style={{paddingVertical:10, textAlign: "center"}} >Email</Text>
            <TextInput
              style={Styles.textInput}
              placeholder="email"
              autoCapitalize = "none"
              autoFocus = {true}     
              returnKeyType = "next"  
              //onSubmitEditing={() => secondTextInputRef.current.focus()}
            />
            <View style={{paddingVertical:20}}>
            <Button title="Submit" onPress={() => console.log("Submit Pressed")}/>
            </View>
        </View>
    </SafeAreaView>
    );
}   
