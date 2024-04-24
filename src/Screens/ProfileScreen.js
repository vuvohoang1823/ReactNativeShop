import { Center, Heading, Image, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import Colors from "../color";
import Tabs from "../Components/Profile/Tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from AsyncStorage when the component mounts
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user data from AsyncStorage:", error);
    }
  };

  // Function to format the timestamp to a readable date and time
  const formatDateTime = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Asia/Ho_Chi_Minh", // Vietnam time zone
    };
    return new Date(timestamp * 1000).toLocaleString("en-US", options);
  };

  const imagePath = require("../../assets/images/user-img.png");

  return (
    <>
      <Center bg={Colors.main} pt={10} pb={6}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            overflow: "hidden",
          }}
        >
          <Image
            source={imagePath}
            alt="profile"
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
        {user && (
          <>
            <Heading bold fontSize={18} isTruncated my={2} color={Colors.white}>
              {user.name}
            </Heading>
            <Text italic fontSize={18} color={Colors.white}>
              Joined: {formatDateTime(user.createdAt)}
            </Text>
          </>
        )}
      </Center>
      {/* TABS */}
      <Tabs user={user} />
    </>
  );
}

export default ProfileScreen;
