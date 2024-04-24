import React from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ListItem({ data, removeDataFromStorage }) {
    const navigation = useNavigation();

    function onPressFunction(id) {
        navigation.navigate("Single", { productId: id });
    }

    function renderSingleItem(product) {
        return (
            <View style={styles.rootContainer} key={product.id}>
                <Pressable
                    style={styles.innerContainer}
                    onPress={onPressFunction.bind(this, product.id)}
                >
                    <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={{ uri: product.image }}
                        defaultSource={require("../../assets/LoadingImage.png")}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{product.name}</Text>
                    </View>
                    <Ionicons onPress={removeDataFromStorage.bind(this, product.id)}
                        style={styles.icon}
                        name="ios-heart-sharp"
                        size={25}
                        color="red"
                    />
                </Pressable>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => renderSingleItem(item)}
            scrollEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        shadowColor: "rgba(0, 0, 0, 0.7)",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.75,
        shadowRadius: 5,
        paddingHorizontal: 50,
        paddingVertical: 10,
    },
    innerContainer: {
        backgroundColor: "white",
        height: 250,
        marginBottom: 25,
        borderRadius: 20,
        overflow: "hidden",
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    textContainer: {
        height: 100,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    icon: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    iconContainer: {
        position: "absolute",
        top: 10,
        right: 10,
    },
});
