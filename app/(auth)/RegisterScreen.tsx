import { COLOR_PRIMARY } from "@/assets/colors";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import RNDatePicker from "@react-native-community/datetimepicker";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  deleteAccessTokenById,
  getAccessTokenDocumentById,
} from "@/models/AccessToken";
import { createUser } from "@/models/User";

/**
 * The UI and logic for the Login Screen.
 * @returns React.FC
 * Created by Saul Almanzar
 */
const RegisterScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [birthday, setBirthday] = useState(new Date(Date.now()));

  const [showDatePicker, setShowDatePicker] = useState(false);

  /**
   * Searches AccessToken collection in state.
   * @returns Document if found, null if not.
   * Created by Saul Almanzar
   */
  const checkAccessToken = async () => {
    try {
      const document = await getAccessTokenDocumentById(accessToken);

      if (!document) {
        console.log("Access token is expired or never existed.");
        setVerified(false);
      } else {
        setFullName(document?.fullName || "");
        setVerified(true);
        return document;
      }
    } catch (error) {
      console.error("There was an error fetching the document. ", error);
    }
  };

  /**
   * Register the user using state variables.
   * After registration, update the user's displayName with the full name stored in Access Token.
   * Also after registration, delete access token.
   * Created by Saul Almanzar
   */
  const register = async () => {
    if (password === confirmPassword) {
      try {
        const userCredential: FirebaseAuthTypes.UserCredential =
          await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await createUser(user, fullName);
        console.log("Creating user Firestore document");

        await deleteAccessTokenById(accessToken);
      } catch (error) {
        const err = error as FirebaseError;
        alert("Sign in failed: " + err.message);
      }
    } else {
      // If user did not type the same password in Confirm Password
    }
  };

  // Check if the user has a valid Access Token
  if (!verified) {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={styles.form}>
          <View style={styles.formField}>
            <Text style={styles.text}>Access Token</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Access Token provided by CRP"
              value={accessToken}
              onChangeText={setAccessToken}
            />
          </View>
          <Pressable style={styles.button} onPress={() => checkAccessToken()}>
            <Text style={styles.buttonText}>Check access token</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.form}>
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeHeaderText}>Welcome</Text>
          <Text style={styles.welcomeHeaderName}>{fullName}</Text>
          <Text>Please complete your registration below</Text>
        </View>
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
        <View style={styles.formField}>
          <Text style={styles.text}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter your password again"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        {/* <View style={styles.formField}>
          <Text style={styles.text}>Birthday</Text>
          <Pressable onPress={() => setShowDatePicker(true)}>
            <TextInput readOnly style={styles.input}>
              {birthday.toLocaleDateString("default", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </TextInput>
          </Pressable>
        </View> */}
        <Pressable style={styles.button} onPress={() => register()}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        {/* {showDatePicker && (
          <RNDatePicker
            value={birthday}
            onChange={(_, selectedDate: any) => {
              setShowDatePicker(false);
              setBirthday(selectedDate);
            }}
          />
        )} */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "gray",
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    lineHeight: 12,
    color: "black",
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
  welcomeBanner: {
    width: "100%",
    marginBottom: 50,
  },
  welcomeHeaderText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
    marginBottom: -15,
  },
  welcomeHeaderName: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLOR_PRIMARY,
  },
});

export default RegisterScreen;
