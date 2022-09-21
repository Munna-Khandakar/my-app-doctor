import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import React, { useEffect, useState, useContext, useRef } from "react";
import COLORS from "../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CallingScreen = ({ charge, setSound, location }) => {
  const {
    userInfo,
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

  const acceptEmergencyCallHandler = async () => {
    await AsyncStorage.setItem("operationId", operationId);
    setSound(null);
    const response = acceptEmergencyCall({ operationId, location });
    if (response) {
      setOperationStatusHandler("waiting");
    }
  };

  const rejectEmergencyCall = () => {
    setOperationStatusHandler(null);
    setSound(null);
    updateEmergencyCallStatus({ reason: "call reject", operationId });
  };

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
        source={require("../../assets/ring.gif")}
        style={{ height: 350, width: 300, resizeMode: "stretch" }}
      />
      <Text>Charge of this request is {`${charge} taka `}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={rejectEmergencyCall}>
          <Text
            style={{
              textAlign: "center",
              color: COLORS.main,
              fontWeight: "900",
              borderWidth: 1,
              borderColor: COLORS.main,
              borderRadius: 8,
              padding: 20,
              margin: 10,
            }}
          >
            CANCEL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={acceptEmergencyCallHandler}>
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
            ACCEPT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallingScreen;

const styles = StyleSheet.create({});
