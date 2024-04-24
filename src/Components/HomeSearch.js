import { Box, HStack, Input } from "native-base";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import Colors from "../color";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

function HomeSearch() {
  const navigation = useNavigation();
  const [cartItemCount, setCartItemCount] = useState(0);

  const check = useIsFocused();

  const getCartItemCount = async () => {
    try {
      const cartItems = await AsyncStorage.getItem("cartItems");
      if (cartItems) {
        const parsedCartItems = JSON.parse(cartItems);
        const uniqueProductIds = new Set(
          parsedCartItems.map((item) => item.product.id)
        );
        setCartItemCount(uniqueProductIds.size);
      }
    } catch (error) {
      console.log("Error getting cart items:", error);
    }
  };

  useEffect(() => {
    getCartItemCount();
  }, [check]);

  return (
    <HStack
      space={3}
      w="full"
      px={6}
      bg={Colors.main}
      py={4}
      alignItems="center"
      safeAreaTop
    >
      <Input
        placeholder="Loa, Sticker, Balo ...."
        w="85%"
        bg={Colors.white}
        type="search"
        variant="filled"
        h={12}
        borderWidth={0}
        _focus={{
          bg: Colors.white,
        }}
      />
      <Pressable ml={3} onPress={() => navigation.navigate("Cart")}>
        <AntDesign
          name="shoppingcart"
          size={24}
          color={Colors.white}
          style={{ marginLeft: 10 }}
        />
        <Box
          px={1}
          rounded="full"
          position="absolute"
          top={-13}
          left={2}
          bg={Colors.red}
          _text={{
            color: Colors.white,
            fontSize: "11px",
          }}
        >
          {cartItemCount}
        </Box>
      </Pressable>
    </HStack>
  );
}

export default HomeSearch;
