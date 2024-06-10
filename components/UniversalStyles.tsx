import { StyleSheet } from "react-native";
// import { useColorScheme } from "react-native";

// export const useUniversalStyles = () => {
//   const scheme = useColorScheme();
//   const color = scheme === "dark" ? "white" : "black";

  const Styles = StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: "yellow",
      width: "80%",
      paddingLeft: 10,
    },
  });

  export default Styles;