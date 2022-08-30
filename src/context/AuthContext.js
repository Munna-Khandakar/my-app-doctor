import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";
import { PROXY_URL } from "@env";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    isLoggedIn();
  }, []);

  async function saveSecureData(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.log("error during saving SecureStore...");
      console.log(error);
    }
  }

  saveUserInfoAsyncStorage = async (value) => {
    try {
      setUserInfo(value);
      console.log("context of userinfo updated...");
      await AsyncStorage.setItem("userInfo", JSON.stringify(value));
      console.log("async storage of userinfo updated...");
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (mobile, password) => {
    setIsLoading(true);
    axios
      .post(`${PROXY_URL}/api/auth/doctor/login`, {
        mobile,
        password,
      })
      .then((res) => {
        let userToken = res.data.token;
        setUserToken(userToken);
        saveSecureData("userToken", userToken);
        getUserProfile(userToken);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.error);
          setIsLoading(false);
          return alert(error.response.data.error);
        }
      });
  };

  // logout | clear user token | clear user info
  const logout = () => {
    setIsLoading(true);
    setUserInfo(null);
    AsyncStorage.removeItem("userInfo");
    setUserToken(null);
    SecureStore.deleteItemAsync("userToken");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
      setUserInfo(userInfo);
      let userToken = await SecureStore.getItemAsync("userToken");
      setUserToken(userToken);
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setIsLoading(false);
        return alert("Something went wrong..");
      }
    }
  };

  // get user details
  const getUserProfile = async (token) => {
    console.log("getUserProfile");
    try {
      axios
        .get(`${PROXY_URL}/api/auth/doctor/profile`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let userInfo = res.data;
          console.log("user info saved...");
          saveUserInfoAsyncStorage(userInfo);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data.error);
            setIsLoading(false);
            return alert(error.response.data.error);
          }
        });
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setIsLoading(false);
        return alert("Something went wrong..");
      }
    }
  };

  const registration = async (verified, mobile, password) => {
    setIsLoading(true);
    if (!verified && !mobile) {
      setIsLoading(false);
      return alert("Please verify your phone number firse");
    }
    axios
      .post(`${PROXY_URL}/api/auth/doctor/register`, {
        verified,
        mobile,
        password,
      })
      .then((result) => {
        if (result) {
          setIsLoading(false);
          navigation.navigate("LoginScreen");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.error);
          setIsLoading(false);
          return alert(error.response.data.error);
        }
      });
  };

  const updateProfile = async (data) => {
    setIsLoading(true);
    try {
      const resp = await axios.put(`${PROXY_URL}/api/doctors/profile`, data, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (resp.data) {
        saveUserInfoAsyncStorage(resp.data.user);
        setIsLoading(false);
        return alert(resp.data.success);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return alert("Something went wrong...");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        registration,
        userInfo,
        userToken,
        setUserInfo,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
