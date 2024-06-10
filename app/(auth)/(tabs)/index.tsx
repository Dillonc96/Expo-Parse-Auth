import { Button, StyleSheet } from "react-native";
import { View, Text } from "@/components/Themed";
import { Secrets } from "@/constants/Secrets";
import { useAuth } from "@/context/AuthProvider";
import customStorage from "@/functions/CustomStorage";
import { useEffect, useState } from "react";


export default function TabOneScreen() {
  // const [horses, setHorses] = useState<string | undefined>(); // horses state
  const [horses, setHorses] = useState<string | undefined>(); // horses state
  const [keys, setKeys] = useState<string | undefined>(); // keys state
  const { user } = useAuth(); // get user from context
  //const [isLoading, setIsLoading] = useState(true); // control activity indicator
  console.log("user", user?.id);

  const fetchData = async () => {
    try {
    console.log("fetching data");
    const horsesAwait = await customStorage.getItem("horses"); // get horses from secure storage
    if (horsesAwait) {

      console.log("horsesAwait", horsesAwait);
      setHorses(horsesAwait ?? undefined); // set horses state with default value of undefined
    }
    const allKeys = await customStorage.getAllKeys();
    if (allKeys) {
      console.log("allKeys", allKeys);
    }
    
    console.log("fetching data done");
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
const horsesArray = horses ? JSON.parse(horses) : undefined;  
  //fetchData();
  
  //setIsLoading(false); // hide activity indicator --- last job in the function
  return (
    <View /*className="flex-1 flex flex-col justify-center px-4 items-center"*/>
      <Text>You are logged in</Text>
      {/* text component if horsesArray is array then return horsesArray[0].name else return "" */}
      <Text>Horse Name: {horsesArray ? horsesArray[0]?.name : "No horses yet"}</Text>
      {/* <Text>Horse Name: {horsesArray[0]?.name || "No horses yet"}</Text> */}
      <Text>{user?.sessionToken}</Text> 
      <Button title="Fetch Data" onPress={fetchData} />
    </View>
  );
}
