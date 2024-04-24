import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Flex } from "native-base";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const Products = () => {
  const BOTTOM_TAB_HEIGHT = 95;
  const [products, setProducts] = useState([]);
  const [genders, setGenders] = useState(["Nữ", "Nam"]);
  const [categories, setCategories] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const [newProductName, setNewProductName] = useState("");
  const [selectedGender, setSelectedGender] = useState("Nữ");
  const [newProductCategory, setNewProductCategory] = useState("Đồ điện tử");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState("");
  const [CountInStock, setCountInStock] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [photoApi, setPhotoApi] = useState("");
  const [searchProductName, setSearchProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState(null);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProductName.toLowerCase())
  );
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setIsGenderDropdownOpen(false);
  };
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };
  const filteredData = products.filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    if (selectedGenderFilter && item.gender !== selectedGenderFilter) {
      return false;
    }
    if (
      searchProductName &&
      !item.name.toLowerCase().includes(searchProductName.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
  const toggleGenderDropdown = () => {
    setIsGenderDropdownOpen(!isGenderDropdownOpen);
    setIsCategoryDropdownOpen(false);
  };
  const handleGenderSelect = (gender) => {
    setSelectedGenderFilter(gender);
    setIsGenderDropdownOpen(false);
  };

  const uniqueCategories = products.reduce((categories, product) => {
    if (!categories.includes(product.category)) {
      // let r = (Math.random() + 1).toString(36).substring(7);
      // categories.push({ r: product.category });
      categories.push(product.category);
    }
    return categories;
  }, []);
  useEffect(() => {
    axios
      .get("https://6628249454afcabd0734fae0.mockapi.io/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data 1:", error);
      });
  }, []);

  const handleRefreshData = () => {
    // Gọi lại API để lấy danh sách products
    axios
      .get("https://6628249454afcabd0734fae0.mockapi.io/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data 2:", error);
      });
  };
  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditingProduct(productToEdit);
    setIsEditModalVisible(true);
  };

  const deleteProductInAPI = async (productId) => {
    try {
      await axios.delete(
        `https://6628249454afcabd0734fae0.mockapi.io/products/${productId}`
      );
      console.log("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://662825f854afcabd0734fe61.mockapi.io/Category"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const fetchCategoriesData = async () => {
    const categoriesData = await fetchCategories();
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const deleteProduct = async () => {
    await deleteProductInAPI(selectedProduct.id);
    setProducts(
      products.filter((product) => product.id !== selectedProduct.id)
    );
    setIsDeleteModalVisible(false);
    setSelectedProduct(null);
  };

  const handleShowDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalVisible(true);
  };
  const updateProduct = async () => {
    try {
      // Gọi API để cập nhật thông tin sản phẩm dựa vào productId
      await axios.put(
        `https://6628249454afcabd0734fae0.mockapi.io/products/${editingProduct.id}`,
        {
          name: editingProduct.name,
          image: photoApi,
          category: editingProduct.category,
          gender: editingProduct.gender,
          description: editingProduct.description,
          price: editingProduct.price,
          countInStock: editingProduct.countInStock,
          // ... các thông tin khác của sản phẩm cần chỉnh sửa
        }
      );
      console.log("Product updated successfully.");
      handleRefreshData();
      // Đặt lại state editingProduct về null để sẵn sàng cho lần chỉnh sửa tiếp theo
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }

    // Đóng Modal
    setIsEditModalVisible(false);
    // Cập nhật lại danh sách sản phẩm với thông tin sản phẩm đã chỉnh sửa
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      )
    );
    // Đặt lại state editingProduct về null để sẵn sàng cho lần chỉnh sửa tiếp theo
    setEditingProduct(null);
  };
  const addProduct = async () => {
    const gender = selectedGender === "" ? "Nữ" : selectedGender;

    const category =
      newProductCategory === "" ? "Đồ điện tử" : newProductCategory;
    const isProductNameDuplicate = products.some(
      (product) => product.name === newProductName
    );
    // Nếu tên sản phẩm mới trùng, hiển thị thông báo và không thêm sản phẩm
    if (isProductNameDuplicate) {
      alert("Product name is already taken. Please choose a different name.");
      return;
    }

    if (
      !newProductName ||
      !selectedGender ||
      !newProductCategory ||
      !Description ||
      !Price ||
      !CountInStock
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const response = await axios.post(
      "https://6628249454afcabd0734fae0.mockapi.io/products",
      {
        name: newProductName,
        image: photoApi,
        category: newProductCategory,
        gender: selectedGender,
        description: Description,
        price: Price,
        countInStock: CountInStock,
        // ... các thông tin khác của sản phẩm mới
      }
    );

    // Lấy dữ liệu sản phẩm mới từ response
    const newProduct = response.data;

    // Thêm sản phẩm mới vào danh sách products
    setProducts([...products, newProduct]);

    // Đóng Modal
    setIsAddModalVisible(false);

    // Reset các giá trị ô input về trạng thái ban đầu
    setNewProductName("");
    setDescription("");
    setPrice("");
    setCountInStock("");
    setPhotoApi("");
  };

  const handleShowAddForm = () => {
    setIsAddModalVisible(true);
    setNewProductCategory("Nữ");
    setSelectedGender("Đồ điện tử");
  };
  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập ảnh",
        "Vui lòng cấp quyền truy cập ảnh để chọn ảnh từ thư viện."
      );
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập ảnh",
        "Vui lòng cấp quyền truy cập ảnh để chọn ảnh từ thư viện."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // Lưu đường dẫn ảnh vào state hoặc biến khác
      setImageUri(result.uri);
    }
  };

  const handleUploadImage = async () => {
    if (imageUri) {
      const formData = new FormData();

      formData.append("img", {
        uri: imageUri,
        type: "image/jpeg",
        name: "image.jpg",
      });
      try {
        const response = await axios.post(
          "https://f-home-be.vercel.app/postImg",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Gửi ảnh lên server thành công:", response.data);
        setPhotoApi(response.data.data.newImage.img);
        ToastAndroid.show("Up ảnh thành công!", ToastAndroid.SHORT);
      } catch (error) {
        console.error("Lỗi khi gửi ảnh lên server:", error);
      }
    } else {
      Alert.alert("Lỗi", "Vui lòng chọn ảnh trước khi gửi.");
    }
  };
  const renderItem = ({ item }) => (
    <ScrollView key={item.id} contentContainerStyle={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditProduct(item.id)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleShowDeleteModal(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const sortedProducts = products.sort((a, b) => b.id - a.id);
  const sortedAndFilteredProducts = filteredData.sort((a, b) => b.id - a.id);

  return (
    <View style={{ backgroundColor: "#E8FFE9" }}>
      <Modal
        visible={isAddModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        {/* Nội dung của Modal */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Form để thêm sản phẩm mới */}
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={newProductName}
              onChangeText={(text) => setNewProductName(text)}
            />
            <Text style={styles.label}>Gender:</Text>
            <Picker
              selectedValue={selectedGender}
              onValueChange={(itemValue) => setSelectedGender(itemValue)}
            >
              {genders.map((gender) => (
                <Picker.Item key={gender} label={gender} value={gender} />
              ))}
            </Picker>

            <Text style={styles.label}>Category:</Text>
            <Picker
              selectedValue={newProductCategory}
              onValueChange={(itemValue) => setNewProductCategory(itemValue)}
            >
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.name}
                />
              ))}
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={Description}
              onChangeText={(text) => setDescription(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={Price}
              onChangeText={(text) => setPrice(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="countInStock"
              value={CountInStock}
              onChangeText={(text) => setCountInStock(text)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#C2BFFD",
                padding: 10,
                borderRadius: 10,
                width: 200,
                height: 40,
                marginLeft: 40,
                marginTop: 10,
              }}
              onPress={pickImage}
            >
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Chọn từ máy bạn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUploadImage}
              style={{
                backgroundColor: "#837DFF",
                marginLeft: 100,
                marginTop: 10,
                padding: 10,
                borderRadius: 15,
                width: 80,
                height: 40,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Gửi
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonsContainer}>
              <Button
                style={{ backgroundColor: "green" }}
                mode="contained"
                onPress={addProduct}
              >
                Add Product
              </Button>
              <Button
                mode="outlined"
                onPress={() => setIsAddModalVisible(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        {/* Nội dung của Modal */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Form để thêm sản phẩm mới hoặc chỉnh sửa sản phẩm */}
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={editingProduct ? editingProduct.name : newProductName}
              onChangeText={(text) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, name: text })
                  : setNewProductName(text)
              }
            />
            <Text style={styles.label}>Gender:</Text>
            <Picker
              selectedValue={
                editingProduct ? editingProduct.gender : selectedGender
              }
              onValueChange={(itemValue) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, gender: itemValue })
                  : setSelectedGender(itemValue)
              }
            >
              {genders.map((gender) => (
                <Picker.Item key={gender} label={gender} value={gender} />
              ))}
            </Picker>

            <Text style={styles.label}>Category:</Text>
            <Picker
              selectedValue={
                editingProduct ? editingProduct.category : newProductCategory
              }
              onValueChange={(itemValue) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      category: itemValue,
                    })
                  : setNewProductCategory(itemValue)
              }
            >
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.name}
                />
              ))}
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Mô tả"
              value={editingProduct ? editingProduct.description : Description}
              onChangeText={(text) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, description: text })
                  : setDescription(text)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Giá"
              value={editingProduct ? String(editingProduct.price) : Price}
              onChangeText={(text) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      price: Number(text),
                    })
                  : setPrice(text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Còn trong kho"
              value={
                editingProduct
                  ? String(editingProduct.countInStock)
                  : CountInStock
              }
              onChangeText={(text) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      countInStock: Number(text),
                    })
                  : setCountInStock(text)
              }
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#C2BFFD",
                padding: 10,
                borderRadius: 10,
                width: 200,
                height: 40,
                marginLeft: 40,
                marginTop: 10,
              }}
              onPress={pickImage}
            >
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Chọn từ máy bạn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUploadImage}
              style={{
                backgroundColor: "#837DFF",
                marginLeft: 100,
                marginTop: 10,
                padding: 10,
                borderRadius: 15,
                width: 80,
                height: 40,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Gửi
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
              {editingProduct ? (
                <Button mode="contained" onPress={updateProduct}>
                  Save Changes
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: "green" }}
                  mode="contained"
                  onPress={addProduct}
                >
                  Add Product
                </Button>
              )}
              <Button
                style={styles.cancelButton}
                mode="outlined"
                onPress={() => setIsEditModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalText}>
              Are you sure you want to delete the product "
              {selectedProduct?.name}"?
            </Text>
            <View style={styles.deleteModalButtonsContainer}>
              <Button mode="contained" onPress={deleteProduct}>
                Confirm
              </Button>
              <Button
                mode="outlined"
                onPress={() => setIsDeleteModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm theo tên"
        value={searchProductName}
        onChangeText={setSearchProductName}
      />
      <Flex
        flexWrap="wrap"
        direction="row"
        justifyContent="center"
        px={6}
        mt={3}
      >
        <Button
          style={{
            backgroundColor: "#BCBCBC",
            borderRadius: 6,
            marginRight: 3,
            alignSelf: "center",
          }}
          onPress={toggleCategoryDropdown}
          colorScheme="black"
          mb={2}
        >
          {selectedCategory ? selectedCategory : "Chọn loại phụ kiện"}
        </Button>
        <Button
          style={{
            backgroundColor: "#BCBCBC",
            borderRadius: 6,
            marginRight: 3,
            alignSelf: "center",
          }}
          onPress={toggleGenderDropdown}
          ml={2}
          mb={2}
        >
          {selectedGenderFilter ? selectedGenderFilter : "Chọn giới tính"}
        </Button>
        <TouchableOpacity style={styles.addButton} onPress={handleShowAddForm}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </Flex>
      {isCategoryDropdownOpen && (
        <View
          style={{
            position: "absolute",
            top: 95,
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
            top: 95,
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
            onPress={() => setSelectedGenderFilter(null)}
            colorScheme={selectedGenderFilter === null ? "blue" : "gray"}
          >
            Tất cả
          </Button>
          <Button
            key="male"
            size="sm"
            mb={2}
            onPress={() => handleGenderSelect("Nam")}
            colorScheme={selectedGenderFilter === "Nam" ? "blue" : "gray"}
          >
            Nam
          </Button>
          <Button
            key="female"
            size="sm"
            mb={2}
            onPress={() => handleGenderSelect("Nữ")}
            colorScheme={selectedGenderFilter === "Nữ" ? "blue" : "gray"}
          >
            Nữ
          </Button>
        </View>
      )}

      <FlatList
        style={{ marginBottom: 95 }}
        data={sortedAndFilteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center", // Đưa nút vào giữa màn hình theo chiều ngang
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 30,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 8,
    marginBottom: 10,
    textAlign: "center",
    color: "#005500",
  },
  editButton: {
    backgroundColor: "orange",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    width: 60,
    marginLeft: 80,
  },
  editButtonText: {
    color: "white",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    width: 60,
    marginLeft: 80,
  },
  deleteButtonText: {
    textAlign: "center",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "80%", // Chiều rộng của form input là 80% của màn hình
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  deleteModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "80%",
  },
  deleteModalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  deleteModalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
  },
  cancelButton: {
    color: "black",
  },
});

export default Products;
