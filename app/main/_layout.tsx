import React, { useState, useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainLayout() {
  const [login, setLogin] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (user) {
        setLogin(user.login);
      }
    };
    fetchUserData();
  }, []);

  return (
    <Drawer
      screenOptions={{
        drawerPosition: "left",
      }}
    >
      <Drawer.Screen 
        name="bonjour" 
        options={{
          title: `${login}`,
          drawerLabel: () => (
            <View style={styles.userInfoContainer}>
              <Image source={require("../../assets/cat1.png")} style={styles.image} />
              <Text style={styles.userInfoText}>Login: {login}</Text>
            </View>
          )
        }}
      />
      <Drawer.Screen 
        name="home" 
        options={{
          title: "Accueil",
          drawerLabel: "Accueil"
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  userInfoContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
