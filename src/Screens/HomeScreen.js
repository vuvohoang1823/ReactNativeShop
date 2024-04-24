import { Box, Text, View } from "native-base";
import React from "react";
import Colors from "../color";
import HomeProducts from "../Components/HomeProducts";
import HomeSearch from "../Components/HomeSearch";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function HomeScreen() {
  return (
    <Box flex={1} bg={Colors.subGreen}>
      <HomeProducts />
    </Box>
  );
}

export default HomeScreen;
