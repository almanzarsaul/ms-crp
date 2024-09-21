import { View, Button } from "react-native";
import auth from "@react-native-firebase/auth";
import { addAccessTokenDocument } from "@/models/AccessToken";

export default function Settings() {
  return (
    <View>
      <Button title="Sign Out" onPress={() => auth().signOut()} />
      <Button
        title="Generate Access Token"
        onPress={() => addAccessTokenDocument("John Doe")}
      />
    </View>
  );
}
