import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const API_URL = "https://6628397a54afcabd07352a0c.mockapi.io/orders";

const RevenueScreen = () => {
  const [revenueByToday, setRevenueByToday] = useState(0);
  const [revenueByMonth, setRevenueByMonth] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedOption, setSelectedOption] = useState("day");
  const [adminInfo, setAdminInfo] = useState({});
  const [mostPopularToday, setMostPopularToday] = useState([]);
  const [mostPopularThisMonth, setMostPopularThisMonth] = useState([]);

  useEffect(() => {
    fetchData();
    getAdminInfo();
  }, []);

  const getAdminInfo = async () => {
    try {
      const adminJSON = await AsyncStorage.getItem("admin");
      if (adminJSON) {
        const admin = JSON.parse(adminJSON);
        setAdminInfo(admin);
      }
    } catch (error) {
      console.error("Error retrieving admin information: ", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
      setOrders(data);
      calculateRevenues(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const calculateRevenues = (data) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(0, 0, 0, 0);
    let revenueToday = 0;
    let revenueMonth = 0;

    data.forEach((order) => {
      if (order.status === "Done") {
        const paymentDate = new Date(order.paymentDateTime * 1000); // Convert UNIX timestamp to milliseconds
        if (paymentDate >= today) {
          revenueToday += order.totalPrice;
        }

        if (paymentDate >= thisMonth) {
          revenueMonth += order.totalPrice;
        }
      }
    });

    setRevenueByToday(revenueToday);
    setRevenueByMonth(revenueMonth);

    const todayOrders = data.filter((order) => {
      const paymentDate = new Date(order.paymentDateTime * 1000);
      return paymentDate >= today;
    });
    const thisMonthOrders = data.filter((order) => {
      const paymentDate = new Date(order.paymentDateTime * 1000);
      return paymentDate >= thisMonth;
    });

    const mostPopularToday = getMostPopularProducts(todayOrders);
    const mostPopularThisMonth = getMostPopularProducts(thisMonthOrders);

    setMostPopularToday(mostPopularToday);
    setMostPopularThisMonth(mostPopularThisMonth);
  };

  const getMostPopularProducts = (orders) => {
    const productCounts = {};
  
    orders.forEach((order) => {
      if (order.status !== "Done") {
        return; // Skip orders that are not marked as "Done"
      }
  
      const orderDetails = order.orderDetail;
  
      if (!Array.isArray(orderDetails)) {
        console.error(`Error: Invalid order details for order ID ${order.id}`);
        return;
      }
  
      orderDetails.forEach((detail) => {
        const { productId, productName, productImage, quantity } = detail;
        if (productCounts[productId]) {
          productCounts[productId].quantity += quantity;
        } else {
          productCounts[productId] = { productId, productName, productImage, quantity };
        }
      });
    });
  
    const sortedProducts = Object.values(productCounts).sort((a, b) => b.quantity - a.quantity);
  
    return sortedProducts.slice(0, 5); // Show the top 5 most popular products
  };
  

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    calculateRevenues(orders, option); // Recalculate revenue based on the selected option
  };

  const getFormattedAmount = (amount) => {
    // Assuming the amount is in VND format, format it accordingly
    return `${amount.toLocaleString()} VND`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View>
          <Text style={styles.welcomeText}>Welcome Admin,</Text>
          <Text style={styles.userName}>{adminInfo.fullName}</Text>
        </View>
        <Image
          source={require("../../assets/favicon.png")}
          style={styles.userImage}
        />
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <View style={styles.revenueRow}>
          <Text style={styles.revenueLabel}>Balance</Text>
        </View>
        <Text style={styles.balanceText}>{getFormattedAmount(revenueByToday)}</Text>
        <View style={styles.revenueRow}>
          <Text style={styles.revenueLabel}>Monthly Profit</Text>
        </View>
        <Text style={styles.balanceText}>{getFormattedAmount(revenueByMonth)}</Text>
      </View>

      <View style={styles.popularProductsSection}>
        {mostPopularToday.length === 0 ? (
          <Text style={styles.noDealsText}>No deals available for Today's Most Popular Products</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Today's Most Popular Products:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mostPopularToday.map((product) => (
                <View key={product.productId} style={styles.productItem}>
                  <Image source={{ uri: product.productImage }} style={styles.productImage} />
                  <Text style={styles.productName}>{product.productName}</Text>
                  <Text style={styles.productQuantity}>{`${product.quantity} sold`}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.sectionTitle}>This Month's Most Popular Products:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mostPopularThisMonth.map((product) => (
            <View key={product.productId} style={styles.productItem}>
              <Image source={{ uri: product.productImage }} style={styles.productImage} />
              <Text style={styles.productName}>{product.productName}</Text>
              <Text style={styles.productQuantity}>{`${product.quantity} sold`}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#F5F5F5",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "bold",
    color: 'gray'
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  balanceSection: {
    width: "100%",
    padding: 20,
    backgroundColor: "#4169E1",
    borderRadius: 10,
    marginTop: 20,
  },
  balanceText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  revenueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  revenueLabel: {
    color: "white",
    fontSize: 18,
  },
  popularProductsSection: {
    padding: 10,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productItem: {
    width: 150,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 10,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  productQuantity: {
    fontSize: 12,
    color: "gray",
  },
  noDealsText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "gray",
  },
});

export default RevenueScreen;
