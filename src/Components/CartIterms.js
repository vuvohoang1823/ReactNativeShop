import React from "react";
import { Box, Button, Center, HStack, Image, Pressable, Text, VStack } from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import Colors from "../color";
import { FontAwesome } from "@expo/vector-icons";

const CartIterms = ({ cartItems, onDeleteItem }) => {
  return (
    <Box mr={6}>
      <SwipeListView
        rightOpenValue={-50}
        previewRowKey="0"
        previewOpenValue={-40}
        previewOpenDelay={3000}
        data={cartItems}
        renderItem={({ item }) => <CartItem item={item} onDelete={() => onDeleteItem(item)} />}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

const CartItem = ({ item, onDelete }) => (
  <Pressable>
    <Box ml={6} mb={3}>
      <HStack alignItems="center" bg={Colors.white} shadow={1} rounded={10} overflow="hidden">
        <Center w="25%" bg={Colors.deepGray}>
          <Image source={{ uri: item.product.image }} alt={item.product.name} w="full" h={24} resizeMode="contain" />
        </Center>
        <VStack w="50%" px={2} space={2}>
          <Text isTruncated color={Colors.black} bold fontSize={10}>
            {item.product.name}
          </Text>
          <Text bold color={Colors.lightBlack}>
            {item.product.price.toLocaleString()} VND
          </Text>
        </VStack>
        <HStack alignItems="center">
          <Button
            bg={Colors.main}
            _pressed={{ bg: Colors.main }}
            _text={{
              color: Colors.white,
            }}
          >
            {item.quantity}
          </Button>
          <Pressable onPress={onDelete}>
            <FontAwesome name="trash" size={24} color={Colors.black} style={{ marginLeft: 10 }} />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  </Pressable>
);


export default CartIterms;
