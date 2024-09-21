import { Text, Pressable, View, StyleSheet, Image } from "react-native";
import { COLOR_PRIMARY } from "@/assets/colors";
import { Link } from "expo-router";
import { initializeApp } from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";
/**
 * Main screen that user sees if not logged in.
 * @returns React.FC
 * Created by Saul Almanzar
 */



export default function Index() {
  return (
    <View style={styles.flex}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require("@/assets/images/crp.png")}
      />
      <View style={styles.container}>
        <Link href="/(auth)/LoginScreen" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/RegisterScreen" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Create an account</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  image: {
    resizeMode: "contain",
    width: "75%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
    marginHorizontal: 20,
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
