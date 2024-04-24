import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  HStack,
  Input,
} from "native-base";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Colors from "../color";
import Rating from "./Rating";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

function HomeProducts() {
  const [favData, setFavData] = useState([]);
  const [scaleValue, setScaleValue] = useState(new Animated.Value(1));
  const navigation = useNavigation();
  
  const isFocused = useIsFocused();

  const [shouldReloadData, setShouldReloadData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetchProducts();
  }, []);

  const focus = useIsFocused()

  useEffect(() => {
    if(focus) {
      fetchProducts();
    }
  }, [focus]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://6628249454afcabd0734fae0.mockapi.io/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };
  
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

  useEffect(() => {
    getFromStorage();
  }, [isFocused]);

  const getFromStorage = async () => {
    const data = await AsyncStorage.getItem("favorite");
    setFavData(data != null || data != undefined ? JSON.parse(data) : []);
  };

  const setDataToStorage = async (id) => {
    let list;
    if (favData.length === 0) {
      list = [id];
      await AsyncStorage.setItem("favorite", JSON.stringify(list));
    } else {
      list = [...favData, id];
      await AsyncStorage.setItem("favorite", JSON.stringify(list));
    }
    setFavData(list);
  };

  const removeDataFromStorage = async (id) => {
    const list = favData.filter((productId) => productId !== id);
    await AsyncStorage.setItem("favorite", JSON.stringify(list));
    setFavData(list);
  };

  function favoriteButton(id) {
    const checkGuest = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.roleName === "Guest") navigation.navigate("Login");
      }
    }
    checkGuest();
    if (favData.includes(id)) {
      removeDataFromStorage(id);
    } else {
      setDataToStorage(id);
    }
  }

  const uniqueCategories = products.reduce((categories, product) => {
    if (!categories.includes(product.category)) {
      // let r = (Math.random() + 1).toString(36).substring(7);
      // categories.push({ r: product.category });
      categories.push(product.category);
    }
    return categories;
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isPriceRangeVisible, setIsPriceRangeVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000]);

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setIsGenderDropdownOpen(false);
    setIsPriceRangeVisible(false);
  };

  const toggleGenderDropdown = () => {
    setIsGenderDropdownOpen(!isGenderDropdownOpen);
    setIsCategoryDropdownOpen(false);
    setIsPriceRangeVisible(false);
  };

  const togglePriceRange = () => {
    setIsPriceRangeVisible(!isPriceRangeVisible);
    setIsCategoryDropdownOpen(false);
    setIsGenderDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setIsGenderDropdownOpen(false);
  };

  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    if (selectedGender && product.gender !== selectedGender) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  function onPressFunction(id) {
    navigation.navigate("Single", { productId: id });
  }

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          InputRightElement={
            <Pressable
              onPress={() => setSearchQuery("")}
              alignItems="center"
              justifyContent="center"
              pr={2}
              rounded="full"
              bg={Colors.gray}
              w={8}
              h={8}
            >
              <MaterialIcons
                name="search"
                size={18}
                color={Colors.black}
                style={{ marginLeft: 2 }}
              />
            </Pressable>
          }
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
      <View style={{ position: "relative" }}>
        <Flex
          flexWrap="wrap"
          direction="row"
          justifyContent="center"
          px={6}
          mt={3}
        >
          <Button
            style={{ backgroundColor: "#B03060" }}
            onPress={toggleCategoryDropdown}
            mb={2}
          >
            {selectedCategory ? selectedCategory : "Chọn loại phụ kiện"}
          </Button>
          <Button
            style={{ backgroundColor: "#B03060" }}
            onPress={toggleGenderDropdown}
            ml={2}
            mb={2}
          >
            {selectedGender ? selectedGender : "Chọn giới tính"}
          </Button>
          <Button
            style={{ backgroundColor: "#B03060" }}
            onPress={togglePriceRange}
            ml={2}
            mb={2}
          >
            Mức giá
          </Button>
        </Flex>
        {isCategoryDropdownOpen && (
          <View
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderRadius: 6,
              padding: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              zIndex: 1,
            }}
          >
            <Button
              key="all"
              size="sm"
              mr={2}
              mb={2}
              onPress={() => setSelectedCategory(null)}
              colorScheme={selectedCategory === null ? "blue" : "gray"}
            >
              Tất cả
            </Button>
            {uniqueCategories.map((category) => (
              <Button
                key={category}
                size="sm"
                mb={2}
                onPress={() => handleCategorySelect(category)}
                colorScheme={selectedCategory === category ? "blue" : "gray"}
              >
                {category}
              </Button>
            ))}
          </View>
        )}
        {isGenderDropdownOpen && (
          <View
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderRadius: 6,
              padding: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              zIndex: 1,
            }}
          >
            <Button
              key="all"
              size="sm"
              mr={2}
              mb={2}
              onPress={() => setSelectedGender(null)}
              colorScheme={selectedGender === null ? "blue" : "gray"}
            >
              Tất cả
            </Button>
            <Button
              key="male"
              size="sm"
              mb={2}
              onPress={() => handleGenderSelect("Nam")}
              colorScheme={selectedGender === "Nam" ? "blue" : "gray"}
            >
              Nam
            </Button>
            <Button
              key="female"
              size="sm"
              mb={2}
              onPress={() => handleGenderSelect("Nữ")}
              colorScheme={selectedGender === "Nữ" ? "blue" : "gray"}
            >
              Nữ
            </Button>
          </View>
        )}
        {isPriceRangeVisible && (
          <View
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderRadius: 6,
              padding: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              zIndex: 1,
            }}
          >
            <Flex justifyContent="center" style={{ marginLeft: 55 }}>
              <MultiSlider
                values={priceRange}
                min={0}
                max={2000000}
                step={10000}
                sliderLength={280}
                onValuesChange={handlePriceRangeChange}
                allowOverlap={false}
                snapped
                markerStyle={{ height: 20, width: 20, borderRadius: 10 }}
                pressedMarkerStyle={{ height: 28, width: 28, borderRadius: 14 }}
                selectedStyle={{ backgroundColor: "#000" }}
                trackStyle={{ height: 4, backgroundColor: "#ccc" }}
                touchDimensions={{ height: 40, width: 40, borderRadius: 20 }}
              />
            </Flex>
            <Flex justifyContent="space-between">
              <Text style={{ marginLeft: 60, fontWeight: "bold" }}>
                Min: {priceRange[0].toLocaleString()} VND
              </Text>
              <Text style={{ marginLeft: 60, fontWeight: "bold" }}>
                Max: {priceRange[1].toLocaleString()} VND
              </Text>
            </Flex>
          </View>
        )}
        <Flex
          flexWrap="wrap"
          direction="row"
          justifyContent="space-between"
          px={6}
          paddingBottom={5}
        >
          {filteredProducts.map((product) => (
            <Pressable
              onPress={() => onPressFunction(product.id)}
              key={product.id}
              w="47%"
              bg={Colors.white}
              rounded="md"
              shadow={2}
              pt={0.3}
              my={3}
              pb={2}
              overflow="hidden"
            >
              <Image
                source={{ uri: product.image }}
                alt={product.name}
                w="full"
                h={24}
                resizeMode="contain"
                style={{ marginTop: 10 }}
              />
              <Box px={4} pt={1}>
                <Text
                  fontSize={12}
                  mt={1}
                  w="full"
                  h={50}
                  fontWeight={500}
                  style={{ marginTop: 10 }}
                >
                  {product.name}
                </Text>
                <Heading size="xxl" color={Colors.blue}>
                  {product.price.toLocaleString()} VND
                </Heading>
                <Rating value={product.rating} />
              </Box>
              <Pressable
                onPress={() => favoriteButton(product.id)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: "4%",
                  backgroundColor: "rgba(0,0,0,0.05)",
                  padding: 5,
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {favData.includes(product.id) ? (
                  <Ionicons name="heart" size={20} color="red" />
                ) : (
                  <Ionicons name="heart-outline" size={20} color="grey" />
                )}
              </Pressable>
            </Pressable>
          ))}
        </Flex>
      </View>
    </ScrollView>
  );
}

export default HomeProducts;
