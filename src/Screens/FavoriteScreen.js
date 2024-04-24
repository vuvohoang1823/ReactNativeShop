import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../Components/ListItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";

function FavoriteScreen() {
  const [favData, setFavData] = useState([]);
  const [dataFav, setDataFav] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    const checkGuest = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.roleName === "Guest") navigation.navigate("Login");
      }
    }
    checkGuest();
    getFromStorage();
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const getFromStorage = async () => {
    try {
      const storageData = await AsyncStorage.getItem("favorite");
      setFavData(storageData != null ? JSON.parse(storageData) : []);

      if (storageData != null) {
        const response = await axios.get(
          "https://6628249454afcabd0734fae0.mockapi.io/products"
        );
        const products = response.data;
        const filteredProducts = products.filter((product) =>
          JSON.parse(storageData).includes(product.id)
        );
        setDataFav(filteredProducts);
      } else {
        setDataFav([]);
      }
    } catch (error) {
      console.log("Error getting favorites:", error);
    }
  };

  const removeAllStorage = async () => {
    if (favData.length === 1) {
      // Handle case when there is only one favorite item
    } else if (favData.length >= 2) {
      Alert.alert(
        "Bạn có chắc không?",
        "Bạn muốn xóa tất cả các mục yêu thích của mình?",
        [
          {
            text: "Không",
            onPress: () => { },
            style: "destructive",
          },
          {
            text: "Có",
            onPress: async () => {
              await AsyncStorage.removeItem("favorite");
              setFavData([]);
              setDataFav([]);
            },
          },
        ]
      );
    }
  };

  const removeDataFromStorage = async (id) => {
    const list = favData.filter((product) => product !== id);
    await AsyncStorage.setItem("favorite", JSON.stringify(list));
    setFavData(list);
    setDataFav((prevData) => prevData.filter((product) => product.id !== id));
  };

  return (
    <ScrollView style={styles.rootContainer}>
      <Text style={{ marginVertical: 30, fontSize: 40, textAlign: "center" }}>
        Danh sách yêu thích
      </Text>
      {dataFav.length !== 0 ? (
        <>
          {favData.length >= 2 && (
            <TouchableOpacity style={{ marginLeft: 30 }} onPress={removeAllStorage}>
              <Text
                style={{
                  fontSize: 18,
                  color: "rgba(0, 0, 0, 0.5)",
                  marginBottom: 10,
                }}
              >
                Xóa tất cả
              </Text>
            </TouchableOpacity>
          )}
          <ListItem data={dataFav} removeDataFromStorage={removeDataFromStorage} />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Image style={styles.emptyImage} source={require("../../assets/EmptyBox.png")} />
          <Text>Bạn chưa yêu thích hoa lan nào cả</Text>
        </View>
      )}
    </ScrollView>
  );
}
export default FavoriteScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  emptyContainer: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: "70%",
  },
});
