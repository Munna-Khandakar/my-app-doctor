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
  Image,
  ActivityIndicator,
} from "react-native";
import COLORS from "../utils/Colors";
import { useFonts } from "expo-font";
import React, { useEffect, useState, useContext } from "react";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import { PROXY_URL } from "@env";

import { AuthContext } from "../context/AuthContext";
import SelectList from "react-native-dropdown-select-list";
import TextInputWithLabel from "../components/TextInputWithLabel";

const ProfileScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat.ttf"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, userToken } = useContext(AuthContext);
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [zilla, setZilla] = useState("");
  const [upzilla, setUpzilla] = useState("");
  const [thana, setThana] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [presentAddressDetails, setPresentAddressDetails] = useState("");
  const [permanentAddressDetails, setPermanentAddressDetails] = useState("");

  const zillaList = [
    { key: "1", value: "Dhaka" },
    { key: "2", value: "Rajshahi" },
    { key: "3", value: "Bogura" },
    { key: "4", value: "Rangpur" },
  ];
  const upzillaList = [
    { key: "1", value: "Sarda" },
    { key: "2", value: "Palashbari" },
    { key: "3", value: "Gobindogonj" },
    { key: "4", value: "Chapai" },
  ];

  const thanaList = [
    { key: "1", value: "Sarda" },
    { key: "2", value: "Palashbari" },
    { key: "3", value: "Gobindogonj" },
    { key: "4", value: "Chapai" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => {}}>
          <View
            style={{
              borderColor: COLORS.main,
              borderWidth: 2,
              borderRadius: 100,
              width: 110,
              height: 110,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            <Image
              source={require("../../assets/images/user-profile.jpg")}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
          </View>
        </TouchableOpacity>

        <TextInputWithLabel
          label="Full Name"
          icon={
            <MaterialIcons
              name="person-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={fullName}
          setValue={setFullName}
        />
        <TextInputWithLabel
          label="Mobile"
          icon={
            <MaterialIcons
              name="phone"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={mobile}
          setValue={setMobile}
          keyboardType="phone-pad"
        />
        <TextInputWithLabel
          label="Email"
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
        />
        <TextInputWithLabel
          label="NID"
          icon={
            <AntDesign
              name="idcard"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={nid}
          setValue={setNid}
          keyboardType="phone-pad"
        />

        {/* present address  */}
        <View style={{ marginBottom: 20 }}>
          <SelectList
            placeholder="Zilla"
            setSelected={setZilla}
            data={zillaList}
            arrowicon={
              <FontAwesome
                name="chevron-down"
                size={12}
                color={COLORS.iconColor}
              />
            }
            // search={false}
            searchicon={
              <FontAwesome name="search" size={12} color={COLORS.iconColor} />
            }
            //  onSelect={() => alert(selected)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <SelectList
            placeholder="Upzilla"
            setSelected={setUpzilla}
            data={upzillaList}
            arrowicon={
              <FontAwesome
                name="chevron-down"
                size={12}
                color={COLORS.iconColor}
              />
            }
            // search={false}
            searchicon={
              <FontAwesome name="search" size={12} color={COLORS.iconColor} />
            }
            // search={false}
            //onSelect={() => alert(selected)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <SelectList
            placeholder="Thana"
            setSelected={setThana}
            data={thanaList}
            arrowicon={
              <FontAwesome
                name="chevron-down"
                size={12}
                color={COLORS.iconColor}
              />
            }
            // search={false}
            searchicon={
              <FontAwesome name="search" size={12} color={COLORS.iconColor} />
            }
            // search={false}
            //  onSelect={() => alert(selected)}
          />
        </View>
        <TextInputWithLabel
          label="Present Address Details"
          icon={
            <MaterialCommunityIcons
              name="home-city-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={presentAddressDetails}
          setValue={setPresentAddressDetails}
        />

        {/* permanent address  */}
        <View style={{ marginBottom: 20 }}>
          <SelectList
            placeholder="Zilla"
            setSelected={setZilla}
            data={zillaList}
            arrowicon={
              <FontAwesome
                name="chevron-down"
                size={12}
                color={COLORS.iconColor}
              />
            }
            // search={false}
            searchicon={
              <FontAwesome name="search" size={12} color={COLORS.iconColor} />
            }
            //  onSelect={() => alert(selected)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <SelectList
            placeholder="Upzilla"
            setSelected={setUpzilla}
            data={upzillaList}
            arrowicon={
              <FontAwesome
                name="chevron-down"
                size={12}
                color={COLORS.iconColor}
              />
            }
            // search={false}
            searchicon={
              <FontAwesome name="search" size={12} color={COLORS.iconColor} />
            }
            // search={false}
            //onSelect={() => alert(selected)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <SelectList
            placeholder="Thana"
            setSelected={setThana}
            data={thanaList}
            arrowicon={
              <FontAwesome
                name="chevron-down"
                size={12}
                color={COLORS.iconColor}
              />
            }
            // search={false}
            searchicon={
              <FontAwesome name="search" size={12} color={COLORS.iconColor} />
            }
            // search={false}
            //  onSelect={() => alert(selected)}
          />
        </View>
        <TextInputWithLabel
          label="Permanent Address Details"
          icon={
            <Fontisto
              name="holiday-village"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={permanentAddressDetails}
          setValue={setPermanentAddressDetails}
        />
        <TouchableOpacity
          onPress={() => {}}
          style={{
            flex: 1,
            backgroundColor: COLORS.main,
            padding: 20,
            borderRadius: 10,
            marginBottom: 30,
          }}
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

export default ProfileScreen;

const styles = StyleSheet.create({});
