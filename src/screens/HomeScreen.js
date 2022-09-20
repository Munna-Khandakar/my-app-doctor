import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import { useFonts } from "expo-font";
import React, { useEffect, useState, useContext, useRef } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { PROXY_URL } from "@env";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import COLORS from "../utils/Colors";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const HomeScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat.ttf"),
  });
  const {
    userInfo,
    updateEmergencyCallStatus,
    image,
    acceptEmergencyCall,
    updateExpoPushToken,
  } = useContext(AuthContext);

  // location variabls
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [doctorCall, setDoctorCall] = useState(false);
  const [operationId, setOperationId] = useState("");
  const [charge, setCharge] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [sound, setSound] = useState();

  // notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      updateExpoPushToken({ expoPushToken: token, _id: userInfo._id });
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // audio
  async function playSound() {
    try {
      console.log("Setting up Sound");
      // await Audio.setAudioModeAsync({
      //   staysActiveInBackground: true,
      //   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      //   shouldDuckAndroid: true,
      //   playThroughEarpieceAndroid: true,
      //   allowsRecordingIOS: true,
      //   // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      //   playsInSilentModeIOS: true,
      // });
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/ringtone.mp3"),
        { shouldPlay: true, staysActiveInBackground: true }
      );
      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const socket = io(`${PROXY_URL}`, { transports: ["websocket"] });

  const handleEmergencyCall = (opId) => {
    setDoctorCall(true);
    setTimeout(() => {
      setSound(null);
      if (doctorCall) {
        setDoctorCall(false);
        console.log(doctorCall);
        console.log("time out");
        updateEmergencyCallStatus({ reason: "time out", operationId: opId });
      }
    }, 1000 * 15);
  };

  const rejectEmergencyCall = () => {
    setDoctorCall(false);
    setSound(null);
    updateEmergencyCallStatus({ reason: "call reject", operationId });
  };

  const acceptEmergencyCallHandler = () => {
    setDoctorCall(false);
    setSound(null);
    const response = acceptEmergencyCall({ operationId, location });
    if (response) {
      setWaiting(true);
    }
  };

  // socket setup
  useEffect(() => {
    // socket.on("connect", () => console.log("socketId: " + socket.id));
    socket.emit("MapUserId", userInfo?._id);
    socket.on("emergencyDoctorCall", (data) => {
      setCharge(data.charge);
      setOperationId(data.operationId);
      playSound();
      handleEmergencyCall(data.operationId);
    });
    socket.on("emergencyCallDisconnect", () => {
      console.log("emergencyCallDisconnect trigger");
      setDoctorCall(false);
    });
  }, []);
  // location api
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setErrorMsg("Permission to access location was denied");
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      try {
        setLocation(location);
        const place = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setAddress(place);
      } catch (error) {
        console.log(error);
        setAddress(null);
      }
      console.log("Doctor is Ready for Emergency...");

      socket.emit("EmergencyDoctorAvaliable", {
        userId: userInfo._id,
        socketId: socket.id,
        charge: userInfo.charge,
        location: location.coords,
      });
    })();
  }, []);

  if (!loaded) {
    return null;
  }
  if (userInfo === undefined) {
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
          <Image
            source={require("../../assets/header.png")}
            style={{ height: 65, width: 150, resizeMode: "stretch" }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <ImageBackground
              source={
                userInfo.photo
                  ? { uri: userInfo.photo }
                  : require("../../assets/images/user-profile.jpg")
              }
              style={{ width: 45, height: 45 }}
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
          <TextInput
            placeholder={
              !address
                ? "Waiting"
                : `${address[0]["street"]}, ${address[0]["district"]}, ${address[0]["city"]}, ${address[0]["postalCode"]}`
            }
          />
        </View>

        {doctorCall && (
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
        )}
        {waiting && (
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
              <TouchableOpacity onPress={() => setWaiting(false)}>
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
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
