import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { createPost } from "@/models/Community"; // Import the createPost function
import { useRouter } from "expo-router"; // For navigating back after post creation
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOR_PRIMARY } from "@/assets/colors";
import { selectImage } from "@/helpers/imageUtils";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import {
  addAccessTokenDocument,
  getAccessTokenDocumentById,
} from "@/models/AccessToken";
import { AccessToken } from "@/models/types/AccessToken";

const CreatePostScreen: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const authorId = auth().currentUser?.uid;

  if (!authorId) {
    router.navigate("/");
    return null;
  }

  const handleCopy = async () => {
    await Clipboard.setStringAsync(accessToken);
  };

  const handleCreateAccessToken = async () => {
    if (userName.trim() === "") {
      Alert.alert("Error", "Please provide the user's full name.");
      return;
    }

    setLoading(true);
    const fetchedAccessToken = await addAccessTokenDocument(userName.trim());
    try {
      if (fetchedAccessToken) {
        setAccessToken(fetchedAccessToken);
      } else {
        throw new Error("Unable to create access token, try again");
      }
    } catch (error) {
      console.error(`Error while creating access token: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {accessToken ? (
        <View>
          <Text>Access token made for {userName}</Text>

          <View>
            <TouchableOpacity onPress={handleCopy}>
              <Text style={{ fontSize: 25 }}>
                {accessToken} <Ionicons name="copy" size={25} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text>Enter user's full name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="John Doe"
            value={userName}
            onChangeText={setUserName}
            selectionColor={COLOR_PRIMARY}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button
              title="Create new access code"
              color={COLOR_PRIMARY}
              onPress={handleCreateAccessToken}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  media: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});

export default CreatePostScreen;
