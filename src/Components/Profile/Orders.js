import { Box, Button, HStack, VStack, ScrollView, Text, Badge, Image } from "native-base";
import React, { useEffect, useState } from "react";
import { Pressable, Alert, Modal } from "react-native";
import Colors from "../../color";
import axios from "axios";

const Orders = ({ userID }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [userID]);

  const fetchOrders = async () => {
    try {
      if (userID) {
        const response = await axios.get(
          `https://6628397a54afcabd07352a0c.mockapi.io/orders?userID=${userID}`
        );
        const data = response.data;
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorScheme = (status) => {
    switch (status) {
      case "Waiting":
        return "warning"; // Yellow color for Waiting status
      case "Confirm":
        return "danger"; // Red color for Confirm status
      case "Done":
        return "primary"; // Blue color for Done status
      default:
        return "info"; // Default color for unknown status
    }
  };

  const handleConfirmButtonPress = async (order) => {
    if (order.status === "Confirm") {
      Alert.alert("Confirm", "Are you sure you want to change the status to Done?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => updateOrderStatus(order),
        },
      ]);
    }
  };

  const updateOrderStatus = async (order) => {
    try {
      const updatedOrder = { ...order, status: "Done" };
      const response = await axios.put(
        `https://6628397a54afcabd07352a0c.mockapi.io/orders/${order.id}`,
        updatedOrder
      );

      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalVisible(false);
  };

  return (
    <Box h="full" bg={Colors.white} pt={5}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text textAlign="center" fontSize={15} color={Colors.black} mt={5}>
            Loading...
          </Text>
        ) : orders.length === 0 ? (
          <Text textAlign="center" fontSize={15} color={Colors.black} mt={5}>
            No transaction yet
          </Text>
        ) : (
          orders
            .slice()
            .sort((a, b) => b.id - a.id)
            .map((order, index) => (
              <React.Fragment key={order.id}>
                {order.status === "Confirm" ? (
                  <Pressable onPress={() => handleOrderPress(order)}>
                    <HStack
                      space={4}
                      justifyContent="space-between"
                      alignItems="center"
                      bg={Colors.deepGray}
                      py={5}
                      px={2}
                    >
                      <Text fontSize={15} color={Colors.blue} isTruncated>
                        {order.vnp_TxnRef}
                      </Text>
                      <Pressable onPress={() => handleConfirmButtonPress(order)}>
                        <Badge
                          variant="subtle"
                          colorScheme={getColorScheme(order.status)}
                          p={3}
                          rounded="md"
                        >
                          <Text>Confirm</Text>
                        </Badge>
                      </Pressable>
                      <Text fontSize={15} italic color={Colors.black} isTruncated>
                        {order.id}
                      </Text>
                      <Button
                        px={7}
                        py={1.5}
                        rounded={50}
                        bg={order.totalPrice > 0 ? Colors.white : Colors.red}
                        _text={{
                          color: Colors.white,
                        }}
                        _pressed={{
                          bg: order.totalPrice > 0 ? Colors.red : Colors.red,
                        }}
                      >
                        <Text>{order.totalPrice.toLocaleString("en-US")} VND</Text>
                      </Button>
                    </HStack>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => handleOrderPress(order)}>
                    <HStack
                      key={order.id}
                      space={4}
                      justifyContent="space-between"
                      alignItems="center"
                      bg={Colors.deepGray}
                      py={5}
                      px={2}
                    >
                      <Text fontSize={15} color={Colors.blue} isTruncated>
                        {order.vnp_TxnRef}
                      </Text>
                      <Badge variant="subtle" colorScheme={getColorScheme(order.status)} p={3} rounded="md">
                        {order.status}
                      </Badge>
                      <Text fontSize={15} italic color={Colors.black} isTruncated>
                        {order.id}
                      </Text>
                      <Button
                        px={7}
                        py={1.5}
                        rounded={50}
                        bg={order.totalPrice > 0 ? Colors.white : Colors.red}
                        _text={{
                          color: Colors.white,
                        }}
                        _pressed={{
                          bg: order.totalPrice > 0 ? Colors.red : Colors.red,
                        }}
                      >
                        <Text>{order.totalPrice.toLocaleString("en-US")} VND</Text>
                      </Button>
                    </HStack>
                  </Pressable>
                )}
                {index !== orders.length - 1 && (
                  <Box height={0.2} bg={Colors.gray} mx={2} my={1} />
                )}
              </React.Fragment>
            ))
        )}
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <Box flex={1} justifyContent="center" alignItems="center" bg="rgba(0, 0, 0, 0.5)">
          <Box bg={Colors.white} p={4} width="80%" borderRadius={8}>
            {selectedOrder && (
              <>
                {selectedOrder.orderDetail.map((detail) => (
                  <HStack key={detail.productId} justifyContent="space-between" py={2}>
                    <Image
                      source={{ uri: detail.productImage }}
                      alt={detail.productName}
                      w={50}
                      h={50}
                      resizeMode="contain"
                      borderRadius={8}
                    />
                    <VStack w="50%" px={2} space={2}>
                      <Text color={Colors.black} bold fontSize={12}>
                        {detail.productName}
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
                        {detail.quantity}
                      </Button>
                    </HStack>
                  </HStack>
                ))}
                <Button onPress={closeModal} mt={4}>
                  Close
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Orders;
