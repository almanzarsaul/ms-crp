import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";

export default function Events() {
  const user = auth().currentUser;
  return (
    <View>
      <Text>Welcome to events {user?.email}</Text>
    </View>
  );
}
