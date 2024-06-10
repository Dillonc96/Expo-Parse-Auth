import 'react-native-get-random-values';
import { ReactNode, createContext, useEffect, useContext, useState } from "react";
import React from "react";
import { router, useSegments } from "expo-router";
import Parse from "parse/react-native";
import {Keys} from "../constants/Keys";
import { Secrets } from '@/constants/Secrets';
import customStorage from '@/functions/CustomStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';



// Your Parse initialization configuration goes here

// Parse.setAsyncStorage(customStorage); // secure storage method for Parse
Parse.setAsyncStorage(AsyncStorage); // insecure storage method for Parse
console.log("parse initialized");
const PARSE_APPLICATION_ID = Keys.applicationId;
const PARSE_HOST_URL = Keys.serverURL;
const PARSE_JAVASCRIPT_ID = Keys.javascriptKey;
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_ID);
Parse.serverURL = PARSE_HOST_URL;

type User = {
  id: string;
  username: string;
  sessionToken: string;
};


type AuthProvider = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  console.log("segments: ", segments);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    console.log("User logged in: ", inAuthGroup);

    if (!user && inAuthGroup) {
      // router.replace("/login");
      router.replace("/"); //means app returns to laning page
    } else if (user && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/");
    }
  }, [user, segments]);
}

export const AuthContext = createContext<AuthProvider>({
  user: null,
  login: async () => false,
  logout: () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider />");
  }
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("username: ", username);
      const appVersion = "0.1.0";
      // Run the Parse Cloud function
      const response = await Parse.Cloud.run("login", { username, password, appVersion });
      // console.log("response: ", response);
      // Extract user object from the response
      const userParse = response.user; // this is a parse object, so has to be stringified, then parse back into JSON
      const userString = JSON.stringify(userParse);
      const user = JSON.parse(userString);
      const msg = response.msg;
      const riders = response.riders; 
      const horses = response.horses;
      console.log("userString: ", userString);

      // Extract required user details
      const loggedInUsername = user["username"] || 'defaultUsername';

      setUser({
        id: user.objectId,
        username: loggedInUsername,
        sessionToken: user.sessionToken,
        //pass user details here
        //pass msg, horses, riders to customStorage
        
      });
      // console log memory size of user, msg, horses and riders
      console.log("user memory size: ", JSON.stringify(user).length);
      console.log("msg memory size: ", JSON.stringify(msg).length);
      console.log("horses memory size: ", JSON.stringify(horses).length);
      console.log("riders memory size: ", JSON.stringify(riders).length);

      
      customStorage.setItem('user', JSON.stringify(user));
      customStorage.setItem('msg', JSON.stringify(msg));
      customStorage.setItem('horses', JSON.stringify(horses));
      customStorage.setItem('riders', JSON.stringify(riders));
      console.log("user, msg, horses, riders saved to storage");
       
      return true;
    } catch (error) {
      console.error('Login failed', error);
      if (error instanceof Parse.Error) {
        console.error('Parse Error:', error.message);
        Alert.alert("Login failed", error.message);
      }
      return false;
    }
  };
  

  const logout = async () => {
    try {
      console.log("logging out");
      await Parse.User.logOut();
      console.log("logged out");
      setUser(null);
      // delete all keys
      customStorage.clear();
      console.log("keys cleared");
    } catch (error: any) {
      console.error('Logout failed', error);
      Alert.alert("Logout failed", error.message);
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
