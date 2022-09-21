import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const NavigationScreen = () => {
  const [myLocation, setMyLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState({
    latitude: 23.84128037608889,
    longitude: 90.3681009238087,
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

  // check for the payment in one minute interval
  const MINUTE_MS = 1000;
  useEffect(() => {
    const interval = setInterval(() => {
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
        console.log("updating location");
      })();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  if (myLocation == null) {
    return <Text>Loading map</Text>;
  }
  return (
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
        >
          <Marker coordinate={myLocation} />
          <Marker coordinate={clientLocation} />
          <Polyline
            coordinates={[myLocation, clientLocation]}
            strokeColor="#000"
            strokeColors={["#7F0000"]}
            strokeWidth={3}
          />
        </MapView>
      )}
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
});
