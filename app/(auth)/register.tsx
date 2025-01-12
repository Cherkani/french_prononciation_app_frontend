import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Alert, TouchableOpacity, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { FancyAlert } from 'react-native-expo-fancy-alerts';

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [visible, setVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const toggleAlert = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const handleSubmit = async () => {
    const user = { fullname, login, password, city };
    const { data, error } = await supabase.from("users").insert([user]);

    if (error) {
      console.error("Error inserting data:", error);
      setAlertMessage("Failed to register. Please try again.");
    } else {
      console.log("Data inserted successfully:", data);
      setAlertMessage("Registration successful!");
    }
    toggleAlert();
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
        <Image source={require("../../assets/cat1.png")} style={styles.image} />
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
          value={password}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.textInput}
          value={city}
          placeholder="City"
          onChangeText={(text) => setCity(text)}
        />
        <View style={styles.separator} />
        <Pressable onPress={handleSubmit} style={[styles.button, styles.registerButton]}>
          <Text style={styles.text}>Register</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/login")} style={[styles.button, styles.backButton]}>
          <Text style={styles.text}>Back to Login</Text>
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
};

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
    backgroundColor: "#ff8c00", // Changer la couleur ici
    marginTop: 8,
    borderRadius: 32,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#ff8c00",
  },
  backButton: {
    backgroundColor: "#ff8c00",
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

export default RegisterScreen;
