import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  ScrollView,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as MailComposer from "expo-mail-composer";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EmailScreen() {
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setCustomerEmail(parsedUser.gmail); // Update the customerEmail state with the user's email
      }
    } catch (error) {
      console.error("Error loading user data from AsyncStorage:", error);
    }
  };

  const sendEmail = () => {
    if (customerEmail && emailContent) {
      const toEmail = "shoppingappmma@gmail.com";
      const subject = "Regarding My Order";
      const body = `Customer Email: ${customerEmail}\n\n${emailContent}`;

      MailComposer.composeAsync({
        recipients: [toEmail],
        subject: subject,
        body: body,
      })
        .then((result) => {
          if (result.status === "sent") {
            // Email sent successfully
            console.log("Email sent");
          } else {
            console.log("Email not sent:", result);
          }
        })
        .catch((error) => {
          console.log("Error sending email:", error);
        });

      setEmailContent("");
    } else {
      // Notify the user if either of the input fields is empty
      alert(
        "Please enter both customer email and content before sending the email."
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
      <Center flex={1} px="4">
        {/* Display user email from AsyncStorage */}
        <FormControl mt={4}>
          <FormControl.Label fontSize="lg" fontWeight="bold" mb={2}>
            Email
          </FormControl.Label>
          <Input
            bg="white"
            borderRadius="md"
            value={customerEmail}
            onChangeText={setCustomerEmail} // This is optional since we're only displaying the email
            _focus={{ borderColor: "primary.500" }}
            disabled // Disable the input field to prevent editing
          />
        </FormControl>

        {/* Email Content */}
        <FormControl mt={8}>
          <FormControl.Label fontSize="lg" fontWeight="bold" mb={2}>
            Content
          </FormControl.Label>
          <Input
            multiline
            numberOfLines={8}
            bg="white"
            borderRadius="md"
            placeholder="Enter email content..."
            value={emailContent}
            onChangeText={setEmailContent}
            _focus={{ borderColor: "primary.500" }}
            textAlignVertical="top" // Set the text alignment to start from the top
          />
        </FormControl>

        {/* Send Button */}
        <Button
          onPress={sendEmail}
          mt={6}
          bg="primary.500"
          _pressed={{ opacity: 0.8 }}
        >
          Send Email
        </Button>
      </Center>
    </ScrollView>
  );
}

export default EmailScreen;
