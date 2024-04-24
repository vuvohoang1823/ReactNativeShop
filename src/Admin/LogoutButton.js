import React from "react";
import { View, Text, Button } from "native-base";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutButton = (props) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("admin");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error while logging out: ", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.logoutContainer}>
        <Button style={styles.logoutButton} onPress={handleLogout} block>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Button>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = {
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  logoutButton: {
    backgroundColor: "#4169E1", // Adjust the background color to your preference
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default LogoutButton;
