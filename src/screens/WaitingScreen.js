import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import COLORS from "../utils/Colors";

const WaitingScreen = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../../assets/wait.gif")}
        style={{ height: 500, resizeMode: "stretch" }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity onPress={() => setWaiting(false)}>
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "900",
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: COLORS.main,
            padding: 20,
            margin: 10,
          }}
        >
          OK, WAITING
        </Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default WaitingScreen;

const styles = StyleSheet.create({});
