import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "https://662825f854afcabd0734fe61.mockapi.io/users";

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      
      const data = response.data;
      console.log(data)
      // Filter users whose roleName is "Employee" or "User"
      const filteredUsers = data.filter(
        (user) => user.roleName === "Employee" || user.roleName === "User"
      );
      // Sort users based on the id in descending order (most recently registered first)
      const sortedUsers = filteredUsers.sort((a, b) => b.id - a.id);
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Function to perform auto-search as the user types
  const handleAutoSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() !== "") {
      // Filter the users based on the search query
      const filteredUsers = users.filter(
        (user) =>
          user.gmail.toLowerCase().includes(text.toLowerCase())
      );
      // Set the filtered users to the state variable
      setFilteredUsers(filteredUsers);
    } else {
      // If the search query is empty, show all users
      setFilteredUsers(users);
    }
  };

  const handleLockUser = (userId) => {
    Alert.alert(
      "Confirm Lock",
      "Are you sure you want to lock this user's account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Lock",
          onPress: () => lockUser(userId),
        },
      ],
      { cancelable: true }
    );
  };

  const handleUnlockUser = (userId) => {
    Alert.alert(
      "Confirm Unlock",
      "Are you sure you want to unlock this user's account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unlock",
          onPress: () => unlockUser(userId),
        },
      ],
      { cancelable: true }
    );
  };

  const lockUser = async (userId) => {
    try {
      // Make API call to update the user status to 0 (locked)
      await axios.put(`${API_URL}/${userId}`, { status: 0 });
      // Show an alert indicating successful locking
      Alert.alert("User Locked", "The user has been locked successfully.");
      // Refresh the user list
      fetchData();
    } catch (error) {
      console.error("Error locking user: ", error);
    }
  };

  const unlockUser = async (userId) => {
    try {
      // Make API call to update the user status to 1 (unlocked)
      await axios.put(`${API_URL}/${userId}`, { status: 1 });
      // Show an alert indicating successful unlocking
      Alert.alert("User Unlocked", "The user has been unlocked successfully.");
      // Refresh the user list
      fetchData();
    } catch (error) {
      console.error("Error unlocking user: ", error);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <View>
            <Text style={styles.fullName}>{item.name}</Text>
            <Text style={styles.email}>{item.gmail}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.status,
                item.status === 1 ? styles.active : styles.inactive,
              ]}
            >
              {item.status === 1 ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>
        <View style={styles.nameContainer}>
          <View>
            {/* Conditionally render the Lock or Unlock button */}
          </View>
          <View style={{ flexDirection: "row" }}>
            {item.status === 1 ? (
              <TouchableOpacity
                onPress={() => handleLockUser(item.id)}
                style={styles.lockButton}
              >
                <Text style={styles.buttonText}>Lock</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleUnlockUser(item.id)}
                style={styles.unlockButton}
              >
                <Text style={styles.buttonText}>Unlock</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by email"
          value={searchQuery}
          onChangeText={handleAutoSearch} // Use handleAutoSearch instead of handleSearch
        />
        <TouchableOpacity onPress={handleAutoSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F5F5",
  },
  userItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  active: {
    color: "#32CD32",
  },
  inactive: {
    color: "#FF4500",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  lockButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  unlockButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginLeft: 8,
  },
});

export default UserManagementScreen;
