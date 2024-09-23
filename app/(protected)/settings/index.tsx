import {
  View,
  Button,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { addAccessTokenDocument } from "@/models/AccessToken";
import { selectImage } from "@/helpers/imageUtils";
import { getUser, updateUserAvatar } from "@/models/User";
import { User } from "@/models/types/User";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { COLOR_PRIMARY } from "@/assets/colors";

export default function Settings() {
  const roles = {
    0: "Member",
    1: "Mentor",
    2: "Admin",
  };
  const currentUserId = auth().currentUser!.uid;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarURL, setAvatarURL] = useState<string | null>("");
  const getUserDetails = async () => {
    try {
      setLoading(true);
      const fetchedUser: User = await getUser(currentUserId);
      setAvatarURL(fetchedUser.avatarURL || null);
      setUser(fetchedUser);
    } catch (error) {
      Alert.alert("There was an issue getting user data. Signing out.");
      await auth().signOut();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleImageUpload = (url: string | null) => {
    if (url) {
      updateUserAvatar(currentUserId, url);
    } else {
      console.log("Failed to upload image.");
    }
  };
  if (user) {
    return (
      <View style={{ padding: 20 }}>
        <View style={styles.userSection}>
          <TouchableOpacity onPress={() => selectImage(handleImageUpload)}>
            {avatarURL ? (
              <Image style={styles.avatar} source={{ uri: user?.avatarURL }} />
            ) : (
              <View style={styles.placeholderAvatar}></View>
            )}
          </TouchableOpacity>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text>{roles[user.role]}</Text>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button
            title="Sign Out"
            color={COLOR_PRIMARY}
            onPress={() => auth().signOut()}
          />
        </View>
        {user.role > 0 && (
          <View>
            <Button
              title="Generate Access Token"
              color={COLOR_PRIMARY}
              onPress={() =>
                router.push("/(protected)/settings/CreateAccessToken")
              }
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  placeholderAvatar: {
    backgroundColor: "gray",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 40,
  },
});
