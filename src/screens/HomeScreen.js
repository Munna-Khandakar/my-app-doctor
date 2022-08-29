import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import React, { useEffect, useState, useContext } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { PROXY_URL } from "@env";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
const HomeScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat.ttf"),
  });
  const { userInfo, userToken } = useContext(AuthContext);

  // location variabls
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // call handler
  const callingEventHandler = () => {
    //console.log("first");
    alert("You have a call");
  };
  const socket = io(`${PROXY_URL}`, { transports: ["websocket"] });
  // socket setup
  useEffect(() => {
    socket.on("connect", () => console.log("socketId: " + socket.id));
    socket.on("emergencyDoctorCall", () => {
      callingEventHandler();
    });
  }, []);

  // location api
  useEffect(() => {
    async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setErrorMsg("Permission to access location was denied");
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      //console.log("latitude of Doctor: " + location.coords.latitude);
      //console.log("longitude Doctor: " + location.coords.longitude);
      setLocation(location);
      //console.log("_id: " + userInfo._id);
      // if doctor is available for emergency...
      // add conditions here
      socket.emit("EmergencyDoctorAvaliable", {
        socketId: socket.id,
        userId: userInfo._id,
        location: location.coords,
      });
    };
  }, []);

  if (!loaded) {
    return null;
  }
  console.log(userInfo);
  if (userInfo === null) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ padding: 20, marginTop: 20 }}>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Roboto-Medium",
              fontWeight: "bold",
            }}
          >
            DOCTOR - MYAPP
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <ImageBackground
              source={require("../../assets/images/user-profile.jpg")}
              style={{ width: 35, height: 35 }}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            borderColor: "#C6C6C6",
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <Entypo
            name="location"
            size={20}
            color="#C6C6C6"
            style={{ marginEnd: 5 }}
          />

          <TextInput placeholder="Mirpur DOHS, Mirpur 12, Dhaka" />
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            borderColor: "#F37878",
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons
            name="medical-services"
            size={20}
            color="#F37878"
            style={{ marginEnd: 5 }}
          />

          <Text style={{ textAlign: "center", color: "#F37878" }}>ACCEPT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
