import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";
import { PROXY_URL } from "@env";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [image, setImage] = useState("");
  const [operationId, setOperationId] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  useEffect(() => {
    isLoggedIn();
    // removeOperationIdHandler();
    // removeOperationStatusHandler();
    // removeClientInfoHandler();
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
      await AsyncStorage.setItem("userInfo", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (mobile, password) => {
    setIsLoading(true);
    try {
      const user = await axios.post(`${PROXY_URL}/api/auth/doctor/login`, {
        mobile,
        password,
      });
      const token = await user.data.token;
      const userInfo = await axios.get(`${PROXY_URL}/api/auth/doctor/profile`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(userInfo.data);
      setUserToken(token);
      saveUserInfoAsyncStorage(userInfo.data);
      saveSecureData("userToken", token);
      setIsLoading(false);
      console.log("user info saved....");
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
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

  const setOperationStatusHandler = async (status) => {
    setOperationStatus(status);
    await AsyncStorage.setItem("operationStatus", status);
  };

  const removeOperationStatusHandler = async () => {
    setOperationStatus(null);
    await AsyncStorage.removeItem("operationStatus");
  };

  const setOperationIdHandler = async (id) => {
    setOperationId(id);
    await AsyncStorage.setItem("operationId", id);
  };

  const removeOperationIdHandler = async () => {
    setOperationId(null);
    await AsyncStorage.removeItem("operationId");
  };

  const setClientInfoHandler = async (details) => {
    setClientInfo(details);
    await AsyncStorage.setItem("clientInfo", JSON.stringify(details));
  };

  const removeClientInfoHandler = async () => {
    setClientInfo(null);
    await AsyncStorage.removeItem("clientInfo");
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
      setUserInfo(userInfo);
      let userToken = await SecureStore.getItemAsync("userToken");
      setUserToken(userToken);
      let operationStatus = await AsyncStorage.getItem("operationStatus");
      setOperationStatus(operationStatus);
      let operationId = await AsyncStorage.getItem("operationId");
      setOperationId(operationId);
      let clientInfo = JSON.parse(await AsyncStorage.getItem("clientInfo"));
      setClientInfo(clientInfo);
      setIsLoading(false);
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

  const updateSettings = async (data) => {
    setIsLoading(true);
    try {
      const resp = await axios.put(`${PROXY_URL}/api/doctors/settings`, data, {
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

  const updateProfilePhoto = async (data) => {
    setIsLoading(true);
    try {
      console.log("auth context....");
      const resp = await axios.put(
        `${PROXY_URL}/api/doctors/profile/photo`,
        { photo: data },
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (resp.data) {
        saveUserInfoAsyncStorage(resp.data.user);
        setIsLoading(false);
        return alert(resp.data.success);
      }
    } catch (err) {
      console.log("auth errpr");
      console.error(err);
      setIsLoading(false);
      return alert("Something went wrong...");
    }
  };

  const updateLocation = async (location) => {
    console.log(location);
    try {
      const resp = await axios.put(
        `${PROXY_URL}/api/doctors/location`,
        location,
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (resp.data) {
        return null;
      }
    } catch (err) {
      console.log(err);
      console.log("error while updating location");
      return alert("Something went wrong...");
    }
  };

  const updateEmergencyCallStatus = async (data) => {
    setIsLoading(true);
    try {
      const resp = await axios.put(`${PROXY_URL}/api/emergency`, data, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (resp.data) {
        console.log(resp.data);
        return null;
      }
    } catch (err) {
      console.error(err.message);
      setIsLoading(false);
      return alert("Something went wrong...");
    }
  };

  const acceptEmergencyCall = async (data) => {
    try {
      const resp = await axios.put(`${PROXY_URL}/api/accept/emergency`, data, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (resp) {
        return alert(resp.status);
      }
    } catch (err) {
      console.error(err.message);

      return alert("Something went wrong...");
    }
  };

  const updateExpoPushToken = async (data) => {
    try {
      const resp = await axios.put(
        `${PROXY_URL}/api/token/expoPushToken`,
        data,
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (resp) {
        console.log("ExpoPushToken Updated");
        return null;
      }
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const checkPayment = async () => {
    try {
      const res = await axios.post(
        `${PROXY_URL}/api/doctors/check/payment`,
        { operationId },
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(res.data.operationStatus);
      if (res.data.operationStatus === "payment completed") {
        await setOperationStatusHandler("readyToGo");
        await setClientInfoHandler(res.data);
        return null;
      }
    } catch (error) {
      console.log(error);
      return alert("Something went wrong");
    }
  };

  const completeOperationHandler = async () => {
    try {
      const res = await axios.post(
        `${PROXY_URL}/api/doctors/complete/operation`,
        { operationId },
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (res.data.operationStatus === "success") {
        await setOperationStatusHandler("review");
        return null;
      }
    } catch (error) {
      console.log(error);
      return alert("Something went wrong");
    }
  };

  const userReviewHandler = async () => {
    try {
      const res = await axios.post(
        `${PROXY_URL}/api/doctors/review`,
        { id: clientInfo },
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (res) {
        removeOperationIdHandler();
        removeOperationStatusHandler();
        removeClientInfoHandler();
        return null;
      }
    } catch (error) {
      console.log(error);
      return alert("Something went wrong");
    }
  };

  const skipUserReviewHandler = () => {
    removeOperationIdHandler();
    removeOperationStatusHandler();
    removeClientInfoHandler();
    isLoggedIn();
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
        updateProfilePhoto,
        image,
        setImage,
        updateSettings,
        updateEmergencyCallStatus,
        acceptEmergencyCall,
        updateExpoPushToken,
        updateLocation,
        setOperationIdHandler,
        operationId,
        operationStatus,
        setOperationStatusHandler,
        checkPayment,
        clientInfo,
        completeOperationHandler,
        userReviewHandler,
        skipUserReviewHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
