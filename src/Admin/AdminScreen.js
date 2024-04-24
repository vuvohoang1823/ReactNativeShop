import React from "react";
import 'react-native-gesture-handler';
import { createDrawerNavigator } from "@react-navigation/drawer";
import RevenueScreen from "./RevenueScreen";
import UserManagementScreen from "./UserManagementScreen";
import LogoutButton from "./LogoutButton";

const Drawer = createDrawerNavigator();

const AdminScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="User Management"
      drawerContent={(props) => <LogoutButton {...props} />}
    >
      {/* <Drawer.Screen name="Revenue" component={RevenueScreen} /> */}
      <Drawer.Screen name="User Management" component={UserManagementScreen} />
    </Drawer.Navigator>
  );
};

export default AdminScreen;
