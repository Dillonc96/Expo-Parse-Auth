import React from 'react';
import { Text, View, TextInput } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native';
import Styles from '@/components/UniversalStyles';


export default function restorePassword() {
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