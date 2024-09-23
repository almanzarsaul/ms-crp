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

const CreatePostScreen: React.FC = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const authorId = auth().currentUser?.uid;

  const handleImageUpload = (url: string | null) => {
    if (url) {
      setMedia(url);
    } else {
      console.log("Failed to upload image");
    }
  };

  if (!authorId) {
    router.navigate("/");
    return null;
  }

  const handlePostCreation = async () => {
    if (content.trim() === "") {
      Alert.alert("Error", "Post content cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await createPost(authorId, content, media.trim() !== "" ? media : null);
      Alert.alert("Success", "Post created successfully!");
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setMedia(""); // Clear the image url from state
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        selectionColor={COLOR_PRIMARY}
        multiline
      />
      <View style={styles.imageSelection}>
        {media.trim() === "" ? (
          <View>
            <Text>Include an image</Text>
            <TouchableOpacity
              onPress={() => {
                selectImage(handleImageUpload);
              }}
            >
              <Ionicons name="image-outline" size={40} color={COLOR_PRIMARY} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageView}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveImage}
            >
              <Ionicons name="close-circle-outline" size={30} color="red" />
            </TouchableOpacity>
            <Image source={{ uri: media }} style={styles.media} />
          </View>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Post"
          color={COLOR_PRIMARY}
          onPress={handlePostCreation}
        />
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
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  imageSelection: {
    marginBottom: 10,
  },
  imageView: {
    position: "relative",
  },
  media: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
    zIndex: 1, // Ensure the button is clickable by placing it above the image
  },
});

export default CreatePostScreen;
