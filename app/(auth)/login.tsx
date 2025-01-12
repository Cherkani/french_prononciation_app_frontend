import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../supabase/supabase";
import { StyleSheet } from "react-native";
const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const height = useHeaderHeight();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInTapped = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("password")
        .eq("login", login)
        .single();

      if (error || !data) {
        console.log("Login incorrect");
        Alert.alert("Error", "Incorrect login or password");
        throw error || new Error("User not found");
      }

      if (password !== data.password) {
        console.log("Password incorrect");
        Alert.alert("Error", "Incorrect login or password");
        throw new Error("Incorrect password");
      }

      console.log("Login and password are correct");
      navigation.navigate("Home" as never);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={height}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Sign in</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your login"
            value={login}
            onChangeText={setLogin}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => navigation.navigate("ForgotPassword" as never)}>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
          <Button
            title={loading ? "Loading..." : "Sign in"}
            onPress={onSignInTapped}
            disabled={loading}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Have an account?{" "}
              <Pressable onPress={() => navigation.navigate("Register" as never)}>
                <Text style={styles.link}>Sign up</Text>
              </Pressable>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  link: {
    color: "#05BFDB",
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
  },
});

export default LoginScreen;
