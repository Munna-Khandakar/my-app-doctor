import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import WalletScreen from "../screens/WalletScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CustomDrawer from "../components/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import COLORS from "../utils/Colors";
import DemoScreen from "../screens/DemoScreen";
const Drawer = createDrawerNavigator();

const AppStack = () => {
  const [loaded] = useFonts({
    "Roboto-Medium": require("../../assets/fonts/Montserrat.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: COLORS.main,
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "#333",
        // headerShown: false,
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: "Roboto-Medium",
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        // component={DemoScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="md-home-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="md-person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="md-settings-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="md-wallet-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
