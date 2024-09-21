import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";

export default function Home() {
  const user = auth().currentUser;
  return (
    <View>
      <Text>Hello {user?.email}</Text>
    </View>
  );
}
