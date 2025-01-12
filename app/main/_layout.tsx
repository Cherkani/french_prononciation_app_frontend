import React, { useState, useEffect } from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from "expo-router/drawer";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/auth";

const CustomDrawerContent = (props) => {
  const { onLogOut } = props;
  const [login, setLogin] = useState("");
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (user) {
        setLogin(user.login);
        setFullname(user.fullname);
      }
    };
    fetchUserData();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoContainer}>
        <Image source={require("../../assets/cat1.png")} style={styles.image} />
        <Text style={styles.userInfoText}>Full Name: {fullname}</Text>
        <Text style={styles.userInfoText}>Login: {login}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Log Out"
        onPress={onLogOut}
        style={[styles.button, styles.logoutButton]}
        labelStyle={styles.buttonText}
      />
    </DrawerContentScrollView>
  );
};

export default function MainLayout() {
  const { signOut } = useAuth();

  const onLogOut = async () => {
    await AsyncStorage.removeItem("user");
    signOut();
  };

  return (
    <Drawer
      screenOptions={{
        drawerPosition: "left",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} onLogOut={onLogOut} />}
    >
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
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#05BFDB",
    marginTop: 10,
    borderRadius: 32,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  logoutButton: {
    backgroundColor: "#ff8c00",
  },
});
