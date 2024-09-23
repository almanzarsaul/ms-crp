import { COLOR_PRIMARY } from "@/assets/colors";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";

/**
 * The UI and logic for the Login Screen.
 * @returns React.FC
 * Created by Saul Almanzar
 */
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      const err = error as FirebaseError;
      alert("Sign in failed: " + err.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.form}>
        <Text style={styles.headerText}>Login</Text>
        <View style={styles.formField}>
          <Text style={styles.text}>Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable style={styles.button} onPress={() => login()}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    alignSelf: "flex-start",
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },
  text: {
    color: "gray",
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    lineHeight: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    flexDirection: "column",
    marginHorizontal: 20,
  },
  formField: {
    width: "100%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: COLOR_PRIMARY,
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default LoginScreen;
