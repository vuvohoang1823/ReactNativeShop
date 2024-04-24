import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Pressable,
  Text,
  VStack,
} from "native-base";
import Colors from "../color";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthContext from "../AuthContext/AuthContext";

function LoginScreen() {
  const [email, setEmail] = useState("t3@gmail.com");
  const [password, setPassword] = useState("1");
  const navigation = useNavigation();
  // const { fetchAllData } = React.useContext(AuthContext);

  const handleGuestLogin = async () => {
    AsyncStorage.setItem("user", JSON.stringify({
        "id": "1",
        "name": "t1",
        "gmail": "t1@gmail.com",
        "account": "t1",
        "password": "1",
        "roleName": "Guest",
        "status": 1
      }
    ));
    navigation.navigate("Bottom");
  }

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter email and password");
      return;
    }
  
    try {
      const usersResponse = await axios.get(
        "https://662825f854afcabd0734fe61.mockapi.io/users"
      );
      const users = usersResponse.data;
  
      const foundUser = users.find((user) => user.gmail === email);
  
      if (!foundUser) {
        alert("Account not found. Please register or check your credentials.");
        return;
      }
  
      if (foundUser.status === 0) {
        alert("Your account is locked. Please contact support.");
        return;
      }
  
      if (foundUser.password === password) {
        if (foundUser.roleName === "User") {
          AsyncStorage.setItem("user", JSON.stringify(foundUser));
          navigation.navigate("Bottom");
        } else if (foundUser.roleName === "Admin") {
          AsyncStorage.setItem("admin", JSON.stringify(foundUser));
          navigation.navigate("Admin");
        } else if (foundUser.roleName === "Employee") {
          navigation.navigate("BottomTab");
        } else {
          alert("Invalid role. Please contact support.");
        }
      } else {
        alert("Email and password do not match. Please re-enter.");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An error occurred while trying to log in. Please try again later.");
    }
  };
  

  return (
    <Box flex={1} bg={Colors.black} alignItems="center" justifyContent="center">
      <Box
        w="100%"
        h="100%"
        p={6}
        justifyContent="center"
        bg={Colors.white}
        borderRadius={10}
      >
        <Heading mb={6} textAlign="center">
          LOGIN
        </Heading>
        <VStack space={5}>
          {/* EMAIL */}
          <Input
            InputLeftElement={
              <MaterialIcons name="email" size={20} color={Colors.main} />
            }
            variant="underlined"
            placeholder="user@gmail.com"
            color={Colors.main}
            borderBottomColor={Colors.underline}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {/* PASSWORD */}
          <Input
            InputLeftElement={
              <Ionicons name="eye" size={20} color={Colors.main} />
            }
            variant="underlined"
            placeholder="*********"
            type="password"
            color={Colors.main}
            borderBottomColor={Colors.underline}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </VStack>
        <Button
          _pressed={{
            bg: Colors.lightBlack,
          }}
          mt={6}
          rounded={50}
          bg={Colors.main}
          onPress={handleLogin}
        >
          LOGIN
        </Button>
        <Button
          _pressed={{
            bg: Colors.lightBlack,
          }}
          mt={6}
          rounded={50}
          bg={Colors.lightBlack}
          onPress={handleGuestLogin}
        >
          LOGIN AS GUEST
        </Button>
        <Pressable mt={4} onPress={() => navigation.navigate("Register")}>
          <Text color={Colors.main}>SIGN UP</Text>
        </Pressable>
      </Box>
    </Box>
  );
}

export default LoginScreen;
