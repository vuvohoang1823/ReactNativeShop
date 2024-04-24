import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "../color";
import Products from "./Products";
import Orders from "./Orders";
import Logout from "./Logout";
import { Center, Pressable } from "native-base";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const BottomTab = (user) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    AsyncStorage.removeItem("user");
    navigation.navigate("Login");
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: true, // Hiện tiêu đề của các tab
        activeTintColor: Colors.red, // Màu của biểu tượng khi được chọn
        inactiveTintColor: Colors.black, // Màu của biểu tượng khi không được chọn
        style: styles.tab, // Kiểu cho tab bar
      }}
    >
      <Tab.Screen
        name="Product"
        component={Products}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <MaterialCommunityIcons name="home" size={24} color={"green"} />
              ) : (
                <AntDesign name="home" size={24} color={"green"} />
              )}
            </Center>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <Entypo name="heart" size={24} color={"green"} />
              ) : (
                <FontAwesome5 name="heart" size={24} color={"green"} />
              )}
            </Center>
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: () => {
            // Xử lý đăng xuất khi người dùng bấm vào tab "Logout"
            handleLogout();
          },
        }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <MaterialIcons name="logout" size={24} color={"green"} />
              ) : (
                <MaterialIcons name="logout" size={24} color={"green"} />
              )}
            </Center>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tab: {
    elevation: 0,
    backgroundColor: Colors.white,
    height: 60,
  },
});

export default BottomTab;
