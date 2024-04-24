import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import axios from "axios";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const Orders = () => {
  const [waitingProducts, setWaitingProducts] = useState([]);
  const [confirmProducts, setConfirmProducts] = useState([]);
  const [doneProducts, setDoneProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("https://6628397a54afcabd07352a0c.mockapi.io/orders")
      .then((response) => {
        const data = response.data;

        // Lấy thông tin người dùng từ API
        const uniqueUserIDs = Array.from(
          new Set(data.map((product) => product.userID))
        );

        const userPromises = uniqueUserIDs.map((userID) =>
          axios.get(
            `https://662825f854afcabd0734fe61.mockapi.io/users/${userID}`
          )
        );

        Promise.all(userPromises)
          .then((userResponses) => {
            const users = userResponses.map((response) => response.data);

            // Tạo mảng mới với thông tin đơn hàng và người dùng kết hợp
            const ordersWithUsers = data.map((order) => ({
              ...order,
              user: users.find((user) => user.id === order.userID),
            }));

            // Lọc đơn hàng theo trạng thái và lưu vào các trạng thái tương ứng
            const waitingProducts = ordersWithUsers.filter(
              (product) => product.status === "Waiting"
            );
            setWaitingProducts(waitingProducts);

            const confirmProducts = ordersWithUsers.filter(
              (product) => product.status === "Confirm"
            );
            setConfirmProducts(confirmProducts);

            const doneProducts = ordersWithUsers.filter(
              (product) => product.status === "Done"
            );
            setDoneProducts(doneProducts);
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const handleConfirmProduct = (id) => {
    axios
      .put(`https://6628397a54afcabd07352a0c.mockapi.io/orders/${id}`, {
        status: "Confirm",
      })
      .then((response) => {
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error confirming product:", error);
      });
  };

  const capitalizeName = (name) => {
    console.log(name)
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const renderItem = ({ item }) => {
    const user = users.find((user) => user.id === item.userID);

    return (
      <TouchableOpacity
        onPress={() => setSelectedOrder(item)}
        style={styles.productContainer}
      >
        <Text style={styles.productTextt}>Đơn hàng: {item.id}</Text>
        {/* <Text style={styles.productText}>
          Email: {user ? user.gmail : "N/A"}
        </Text> */}
        {/* <Text style={styles.productText}>
          Đơn hàng của khách: {user ? capitalizeName(user.name) : "N/A"}
        </Text> */}
        <Text style={styles.productText}>
          Giá trị đơn hàng: {item.totalPrice.toLocaleString()} VND
        </Text>
        {item.status === "Waiting" && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirmProduct(item.id)}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderUserInfo = () => {
    if (selectedOrder && selectedOrder.user) {
      return (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>
            Email: {selectedOrder.user.gmail}
          </Text>
          <Text style={styles.userInfoText}>
            Fullname: {capitalizeName(selectedOrder.user.name)}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Email: N/A</Text>
          <Text style={styles.userInfoText}>Fullname: N/A</Text>
        </View>
      );
    }
  };

  const renderOrderDetailsModal = () => {
    return (
      <Modal visible={selectedOrder !== null} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedOrder && (
            <View>
              <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "green",
                  marginBottom: 5,
                  marginTop: 25,
                  marginLeft: 40,
                }}
              >
                Đơn hàng số: {selectedOrder.id}
              </Text>
              {renderUserInfo()}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "blue",
                  marginLeft: 40,
                }}
              >
                Giá trị đơn hàng: {selectedOrder.totalPrice.toLocaleString()}{" "}
                VND
              </Text>
              <FlatList
                data={selectedOrder.orderDetail}
                renderItem={({ item }) => (
                  <View style={styles.orderItemContainer}>
                    <Image
                      source={{ uri: item.productImage }}
                      style={styles.productImage}
                    />
                    <Text style={{ marginLeft: 60, fontWeight: "bold" }}>
                      Tên sản phẩm: {item.productName}
                    </Text>
                    <Text style={{ marginLeft: 60, fontWeight: "bold" }}>
                      Số lượng mua: {item.quantity}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.productId}
              />
              <TouchableOpacity
                onPress={() => setSelectedOrder(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderOrderDetailsModal()}
      <Tab.Navigator>
        <Tab.Screen name="Waiting" options={{ title: "Waiting" }}>
          {() => (
            <FlatList
              data={waitingProducts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <Text style={styles.title}>Đơn hàng đang chờ duyệt</Text>
              }
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Confirm" options={{ title: "Confirm" }}>
          {() => (
            <FlatList
              data={confirmProducts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <Text style={styles.title}>Đơn hàng đã xác nhận</Text>
              }
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Done" options={{ title: "Done" }}>
          {() => (
            <FlatList
              data={doneProducts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <Text style={styles.title}>Đơn hàng đã hoàn thành</Text>
              }
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EBFFE3",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 10,
    textAlign: "center",
    color: "green",
  },
  productContainer: {
    backgroundColor: "#EBE4FF",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  productText: {
    fontSize: 16,
    fontWeight: "regular",
  },
  productTextt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006400",
  },
  confirmButton: {
    backgroundColor: "#008000",
    padding: 8,
    borderRadius: 4,
    width: 100,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 130,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  orderItemContainer: {
    marginVertical: 10,
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 8,
    borderRadius: 10,
    marginLeft: 90,
  },
  closeButton: {
    backgroundColor: "#008000",
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfoContainer: {
    backgroundColor: "#E7FFE4",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    marginLeft: 30,
    marginRight: 30,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "regular",
  },
});

export default Orders;
