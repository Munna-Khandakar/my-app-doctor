import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useContext, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../utils/Colors";
import { AuthContext } from "../context/AuthContext";

const ReviewScreen = () => {
  const [ratings, setRatings] = useState(0);
  const { userReviewHandler, skipUserReviewHandlernfo, clientInfo } =
    useContext(AuthContext);

  const UserRatings = () => {
    const rows = [];
    for (let i = 1; i < ratings + 1; i++) {
      rows.push(
        <MaterialIcons
          name="star-rate"
          size={45}
          key={i}
          onPress={() => setRatings(i)}
        />
      );
    }
    for (let i = ratings + 1; i < 6; i++) {
      rows.push(
        <MaterialIcons
          name="star-outline"
          size={45}
          key={i}
          onPress={() => setRatings(i)}
        />
      );
    }

    return rows;
  };
  return (
    <View>
      <Image
        source={require("../../assets/review.png")}
        style={{
          height: 200,
          width: 200,
          alignSelf: "center",
          resizeMode: "stretch",
          margin: 10,
        }}
      />
      <Text style={{ textAlign: "center", fontSize: 18 }}>
        “Hey, thank you for doing business with us. Please take a minute to
        leave a review about your client with us.
      </Text>
      <View style={{ flexDirection: "row", alignSelf: "center", margin: 15 }}>
        <UserRatings />
      </View>
      <TextInput
        placeholder={"REVIEW"}
        style={{
          flex: 1,
          padding: 15,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: COLORS.light,
          borderRadius: 8,
        }}
        keyboardType={"default"}
        // value={value}
        // onChangeText={(number) => setValue(number)}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={skipUserReviewHandlernfo}
          style={{
            flex: 1,

            borderWidth: 1,
            borderColor: COLORS.main,
            padding: 20,
            borderRadius: 10,
            marginBottom: 30,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
              color: COLORS.main,
            }}
          >
            SKIP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={userReviewHandler}
          style={{
            flex: 1,
            backgroundColor: COLORS.main,
            padding: 20,
            borderRadius: 10,
            marginBottom: 30,
            marginLeft: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
              color: "white",
            }}
          >
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({});
