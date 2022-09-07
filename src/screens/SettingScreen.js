import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import COLORS from "../utils/Colors";
import { useFonts } from "expo-font";
import React, { useState, useContext } from "react";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  Fontisto,
  FontAwesome5,
} from "@expo/vector-icons";
import { PROXY_URL } from "@env";
import { AuthContext } from "../context/AuthContext";
import SelectList from "react-native-dropdown-select-list";
import TextInputWithLabel from "../components/TextInputWithLabel";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const SettingScreen = () => {
  const [loaded] = useFonts({
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat.ttf"),
  });
  const { userInfo, isLoading, updateSettings } = useContext(AuthContext);

  const [charge, setCharge] = useState(userInfo.charge);

  const submitFormHandler = async () => {
    let data = {
      charge,
    };
    updateSettings(data);
  };

  if (userInfo === null) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ padding: 20, marginTop: 20 }}>
        <TextInputWithLabel
          label="Consultant Fee"
          icon={
            <FontAwesome
              name="money"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={charge}
          setValue={setCharge}
        />

        <TouchableOpacity
          onPress={submitFormHandler}
          style={{
            flex: 1,
            backgroundColor: COLORS.main,
            padding: 20,
            borderRadius: 10,
            marginBottom: 30,
          }}
          // disabled={!isLoading}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={{
                textAlign: "center",
                fontWeight: "700",
                color: "white",
              }}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
