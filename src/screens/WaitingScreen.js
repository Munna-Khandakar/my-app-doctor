import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import React, { useEffect, useState, useContext, useRef } from "react";
import COLORS from "../utils/Colors";
import axios from "axios";
import { PROXY_URL } from "@env";

const WaitingScreen = () => {
  const {
    userToken,
    updateEmergencyCallStatus,
    image,
    acceptEmergencyCall,
    updateExpoPushToken,
    updateLocation,
    setOperationId,
    operationId,
    operationStatus,
    setOperationStatusHandler,
    checkPayment,
  } = useContext(AuthContext);

  // check for the payment in one minute interval
  const MINUTE_MS = 10000;
  useEffect(() => {
    console.log("checking payment from Waiting Screen");
    const interval = setInterval(() => {
      checkPayment();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

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
