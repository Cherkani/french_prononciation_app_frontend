import React, { useState, useEffect, useCallback } from "react";
import { Button, Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from "react-native";
import { useAuth } from "../../../context/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { FancyAlert } from 'react-native-expo-fancy-alerts';

export default function Profile() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [login, setLogin] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState(""); // Ajouter l'état du mot de passe
  const [visible, setVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (user) {
        setFullname(user.fullname);
        setLogin(user.login);
        setCity(user.city); // Assurez-vous que la ville est récupérée
      }
    };
    fetchUserData();
  }, []);

  const toggleAlert = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const handleUpdate = async () => {
    const user = JSON.parse(await AsyncStorage.getItem("user"));
    const updates = { fullname, login, city };
    if (password) {
      updates.password = password; // Ajouter le mot de passe aux mises à jour si fourni
    }
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.userId);

    if (error) {
      console.error("Error updating data:", error.message); // Afficher le message d'erreur
      setAlertMessage(`Failed to update profile. Error: ${error.message}`);
    } else {
      console.log("Data updated successfully:", data);
      setAlertMessage("Profile updated successfully!");
      await AsyncStorage.setItem("user", JSON.stringify({ ...user, fullname, login, city }));
    }
    toggleAlert();
  };

  const onLogOut = async () => {
    await AsyncStorage.removeItem("user");
    signOut();
  };

  return (
    <ImageBackground
      source={{
        uri: "https://marketplace.canva.com/EAF6DEqEaro/1/0/900w/canva-orange-white-cartoon-illustrative-funny-cat-phone-wallpaper-W05PU8BDltw.jpg",
      }}
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.container}>
        <Image source={require("../../../assets/cat1.png")} style={styles.image} />
        <TextInput
          style={styles.textInput}
          value={fullname}
          placeholder="Full Name"
          onChangeText={(text) => setFullname(text)}
        />
        <TextInput
          style={styles.textInput}
          value={login}
          placeholder="Login"
          onChangeText={(text) => setLogin(text)}
        />
        <TextInput
          style={styles.textInput}
          value={city}
          placeholder="City"
          onChangeText={(text) => setCity(text)}
        />
        <TextInput
          style={styles.textInput}
          value={password}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.separator} />
        <Pressable onPress={handleUpdate} style={[styles.button, styles.updateButton]}>
          <Text style={styles.text}>Update Profile</Text>
        </Pressable>
        <Pressable onPress={onLogOut} style={[styles.button, styles.logoutButton]}>
          <Text style={{ color: "white" }}>Log Out</Text>
        </Pressable>

        <FancyAlert
          visible={visible}
          icon={<View style={styles.icon}><Text>🤓</Text></View>}
          style={{ backgroundColor: 'white' }}
        >
          <Text style={{ marginTop: -16, marginBottom: 32 }}>{alertMessage}</Text>
          <TouchableOpacity style={styles.btn} onPress={toggleAlert}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
        </FancyAlert>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginTop: 16,
  },
  textInput: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 8,
    width: "60%",
    borderRadius: 32,
  },
  text: {
    color: "white",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "60%",
    backgroundColor: "#05BFDB",
    marginTop: 8,
    borderRadius: 32,
    alignItems: "center",
  },
  icon: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 50,
    width: '100%',
  },
  btn: {
    borderRadius: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: 'stretch',
    backgroundColor: '#4CB748',
    marginTop: 16,
    minWidth: '50%',
    paddingHorizontal: 16,
  },
  btnText: {
    color: '#FFFFFF',
  },
  updateButton: {
    backgroundColor: "#ff8c00",
  },
  logoutButton: {
    backgroundColor: "#ff8c00",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },
});
