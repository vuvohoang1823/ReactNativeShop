import React, { useState, useEffect } from "react";
import {
  Box,
  CheckIcon,
  FormControl,
  Heading,
  Select,
  Text,
  TextArea,
  VStack,
  HStack,
  Pressable,
} from "native-base";
import Colors from "../color";
import Rating from "./Rating";
import Message from "./Notfications/Message";
import Buttone from "./Buttone";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Review({ productId, onReviewPosted }  ) {
  const [ratings, setRatings] = useState("");
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [comment, setComment] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
    loadUserData();
  }, []);

  useEffect(() => {
    // Khi reviews hoặc productId thay đổi, lọc danh sách review theo productId
    const filtered = reviews.filter((review) => review.idProduct === productId);
    setFilteredReviews(filtered);
  }, [reviews, productId]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUsers(parsedUser);
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user data from AsyncStorage:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const postReview = async () => {
    try {
      // Lấy ngày giờ hiện tại
      const createdAt = new Date().toISOString();

      // Lấy thông tin người dùng
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        console.error("User data not found in AsyncStorage.");
        return;
      }
      const parsedUser = JSON.parse(userData);
      const { id: userId } = parsedUser; // Lấy id của người dùng

      // Tạo đối tượng review
      const newReview = {
        createdAt,
        description: comment,
        idProduct: productId,
        idUser: userId,
        rating: parseInt(ratings),
        id: String(reviews.length + 1), // Cần cung cấp một id duy nhất cho review, có thể lấy từ reviews.length + 1
      };

      // Gửi request POST đến API
      const response = await axios.post(
        "https://6628249454afcabd0734fae0.mockapi.io/preview",
        newReview
      );
      // Sau khi post thành công, cập nhật danh sách reviews và clear form
      setReviews([...reviews, newReview]);
      setRatings("");
      setComment("");
      setStarRating(0);

      const newNumReviews = filteredReviews.length + 1; // Số người review mới sẽ là tổng số reviews sau khi thêm mới
      const newRating = calculateAverageRating([...filteredReviews, newReview]);

      const updatedProductInfo = {
        numReviews: newNumReviews,
        rating: newRating,
      };
      await updateProductInfo(productId, updatedProductInfo);
      onReviewPosted();
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  const updateProductInfo = async (productId, data) => {
    try {
      // Gọi API để cập nhật thông tin sản phẩm
      const response = await axios.put(
        `https://6628249454afcabd0734fae0.mockapi.io/products/${productId}`,
        data
      );
    } catch (error) {
      console.error("Error updating product info:", error);
    }
  };

  const handleStarRating = (rating) => {
    setStarRating(rating);
    setRatings(String(rating)); // Chuyển số sao thành chuỗi và lưu vào state "ratings"
  };

  const fetchData = async () => {
    try {
      // Gọi API để lấy danh sách review
      const reviewResponse = await axios.get(
        "https://6628249454afcabd0734fae0.mockapi.io/preview"
      );
      setReviews(reviewResponse.data);

      // Gọi API để lấy danh sách người dùng
      const userResponse = await axios.get(
        "https://662825f854afcabd0734fe61.mockapi.io/users"
      );
      const usersData = userResponse.data.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      // Lưu thông tin người dùng vào state users
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderReviewWithAuthor = (review) => {
    const author = users[review.idUser] || {}; // Lấy thông tin người dùng từ state users
    const authorName = author.name || "Unknown"; // Lấy tên tác giả từ thông tin người dùng
    const isCurrentUserReview = currentUser && review.idUser === currentUser.id;
    return (
      <Box key={review.id} p={3} bg={Colors.black} mt={5} rounded={5}>
        <Heading fontSize={15} color={isCurrentUserReview ? Colors.blue : Colors.black}>
          {authorName} {/* Hiển thị tên tác giả */}
        </Heading>
        <Rating value={parseInt(review.rating)} />{" "}
        {/* Hiển thị rating của review */}
        <Text my={2} fontSize={11}>
          {new Date(review.createdAt).toLocaleDateString()}{" "}
          {/* Hiển thị ngày tạo review */}
        </Text>
        <Message
          color={Colors.black}
          bg={Colors.white}
          size={10}
          children={review.description}
        />
      </Box>
    );
  };

  return (
    <Box my={9}>
      <Box
        mt={6}
        bg={"#BCBCBC"}
        p={4}
        rounded={5}
        shadow={4}
        shadowColor={"gray"}
      >
        <Heading fontSize={15} bold mb={4}>
          REVIEW THIS PRODUCT
        </Heading>
        <VStack space={6}>
          <FormControl>
            <FormControl.Label
              _text={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Rating
            </FormControl.Label>
            <HStack space={1}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Icon
                  key={rating}
                  name={rating <= starRating ? "star" : "star-o"} // Hiển thị icon sao đầy hoặc rỗng tùy vào số sao được chọn
                  size={25}
                  color="yellow" // Màu sao đầy
                  onPress={() => handleStarRating(rating)} // Xử lý khi người dùng chọn số sao
                />
              ))}
            </HStack>
          </FormControl>
          <FormControl>
            <FormControl.Label
              _text={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Comment
            </FormControl.Label>
            <TextArea
              h={24}
              w="full"
              placeholder="Hãy đánh giá công tâm ....."
              borderWidth={1} // Thêm border cho form
              borderColor={Colors.black} // Màu sắc của border
              bg={"#FFFFFF"}
              py={4}
              value={comment} // Giá trị của text area là state comment
              onChangeText={setComment} // Hàm để cập nhật state comment khi người dùng thay đổi nội dung
              _focus={{
                bg: Colors.subGreen,
              }}
            />
          </FormControl>
          <Buttone bg={Colors.main} color={Colors.white} onPress={postReview}>
            SUBMIT
          </Buttone>
        </VStack>
      </Box>
      <Heading bold fontSize={15} mt={5} mb={2}>
        REVIEW
      </Heading>
      {/* IF THERE IS NO REVIEW */}
      {filteredReviews.length === 0 ? (
        <Message
          color={Colors.main}
          bg={Colors.lightBlack}
          bold
          children={"NO REVIEW"}
        />
      ) : (
        /* REVIEW */
        filteredReviews.map((review) => renderReviewWithAuthor(review))
      )}
    </Box>
  );
}
