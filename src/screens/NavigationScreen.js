import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_MAP_API_KEY } from "@env";
import MapViewDirections from "react-native-maps-directions";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../utils/Colors";
import { AuthContext } from "../context/AuthContext";
import React, { useEffect, useState, useContext, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NavigationScreen = () => {
  const { clientInfo, completeOperationHandler } = useContext(AuthContext);
  const [myLocation, setMyLocation] = useState();
  const [clientLocation, setClientLocation] = useState({
    latitude: clientInfo?.clientLocation.latitude || 23.84128037608889,
    longitude: clientInfo?.clientLocation.longitude || 90.3681009238087,
  });

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
      setMyLocation(location.coords);
    })();
  }, []);

  // // check for the payment in one minute interval
  // const MINUTE_MS = 1000;
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     (async () => {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         console.log("Permission to access location was denied");
  //         setErrorMsg("Permission to access location was denied");
  //         alert("Permission to access location was denied");
  //         return;
  //       }
  //       let location = await Location.getCurrentPositionAsync({});
  //       setMyLocation(location.coords);
  //       console.log("updating location");
  //     })();
  //   }, MINUTE_MS);

  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, []);

  const dialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const ClientLavel = () => {
    return (
      <View style={{ paddingRight: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="md-people"
            size={24}
            color={COLORS.iconColor}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: COLORS.iconColor }}>
            {clientInfo?.clientId.fullName}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
          onPress={() => {
            dialCall(clientInfo?.clientId.mobile);
          }}
        >
          <Ionicons
            name="md-call"
            size={24}
            color={COLORS.iconColor}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: COLORS.iconColor }}>
            {clientInfo?.clientId.mobile}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="md-home"
            size={24}
            color={COLORS.iconColor}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: COLORS.iconColor }}>
            {clientInfo?.clientId.presentAddressDetails}
          </Text>
        </View>
      </View>
    );
  };

  if (myLocation == null) {
    return <Text>Loading map</Text>;
  }
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 6 }}>
          <ClientLavel />
        </View>
        <Image
          source={
            clientInfo?.clientId.photo
              ? { uri: clientInfo?.clientId.photo }
              : require("../../assets/images/user-profile.jpg")
          }
          style={{
            flex: 2,
            width: 100,
            height: 100,
            borderRadius: 8,
          }}
        />
      </View>
      <TouchableOpacity
        // disabled={isLoading}
        onPress={completeOperationHandler}
        style={{
          flex: 1,
          backgroundColor: COLORS.main,
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "700",
            color: "white",
          }}
        >
          FINISH THE OPERATION
        </Text>
      </TouchableOpacity>
      <View style={styles.mainbox}>
        {myLocation !== null && (
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
              latitudeDelta: 0.0322,
              longitudeDelta: 0.0321,
            }}
            showsUserLocation={true}
          >
            <Marker coordinate={myLocation}></Marker>
            <Marker
              coordinate={clientLocation}
              image={require("../../assets/destination.png")}
            >
              <Callout tooltip>
                <View>
                  <View style={styles.bubble}>
                    <Text style={styles.name}>Favourite Restaurant</Text>
                    {/* <Text>A short description</Text> */}
                    <Image
                      style={styles.image}
                      source={require("../../assets/destination.png")}
                    />
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>
            {/* <MapViewDirections
            origin={myLocation}
            destination={clientLocation}
            apikey={GOOGLE_MAP_API_KEY}
          /> */}
            <Polyline
              coordinates={[myLocation, clientLocation]}
              strokeColor="#000"
              strokeColors={["#7F0000"]}
              strokeWidth={3}
            />
          </MapView>
        )}
      </View>
    </View>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  mainbox: {
    textAlign: "center",
    margin: 0,
    flex: 1,
    justifyContent: "space-between",
  },
  mapView: {
    height: 600,
    width: 1000,
  },
  map: {
    height: "100%",
  },
  // Callout bubble
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Character image
  image: {
    width: "100%",
    height: 80,
  },
});
