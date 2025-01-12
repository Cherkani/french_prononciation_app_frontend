import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { Pressable, StyleSheet, Text, View, Alert, TouchableOpacity, ImageBackground, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "../../context/auth";
import { supabase } from "../lib/supabase";
import { FancyAlert } from 'react-native-expo-fancy-alerts';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const [visible, setVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const toggleAlert = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const onSignInTapped = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, password, login, fullname, city")
        .eq("login", email)
        .single();

      if (error || !data) {
        console.log("Login incorrect");
        setAlertMessage("Incorrect login or password");
        toggleAlert();
        throw error || new Error("User not found");
      }

      if (password !== data.password) {
        console.log("Password incorrect");
        setAlertMessage("Incorrect login or password");
        toggleAlert();
        throw new Error("Incorrect password");
      }

      console.log("Login and password are correct");
      await AsyncStorage.setItem("user", JSON.stringify({ email, password, userId: data.id, login: data.login, fullname: data.fullname, city: data.city }));
      signIn({ email, password, userId: data.id, login: data.login, fullname: data.fullname, city: data.city });
      setAlertMessage("Login successful!");
      toggleAlert();
      router.push("/home"); // Assurez-vous que la navigation se fait ici
    } catch (error) {
      console.log(error);
      setAlertMessage("Failed to fetch data. Please try again.");
      toggleAlert();
    } finally {
      setLoading(false);
    }
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
          value={email}
          placeholder="Type email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.textInput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Type password"
          secureTextEntry
        />
        <View style={styles.separator} />
        <Pressable onPress={onSignInTapped} style={[styles.button, styles.loginButton]}>
          <Text style={styles.text}>Login</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/register")} style={[styles.button, styles.registerButton]}>
          <Text style={styles.text}>Register</Text>
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
    backgroundColor: "#ff8c00", // Changer la couleur ici
    marginTop: 8,
    borderRadius: 32,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#ff8c00",
  },
  registerButton: {
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
    borderRadius: 60,
    marginBottom: 20,
  },
});
