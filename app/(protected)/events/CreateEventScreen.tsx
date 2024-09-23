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
import { createPost } from "@/models/Community";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOR_PRIMARY } from "@/assets/colors";
import { selectImage } from "@/helpers/imageUtils";
import { Ionicons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { createEvent } from "@/models/Event";

const CreateEventScreen: React.FC = () => {
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [media, setMedia] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [time, setTime] = useState(new Date(Date.now()));
  const router = useRouter();
  const organizerId = auth().currentUser?.uid;

  const handleImageUpload = (url: string | null) => {
    if (url) {
      setMedia(url);
    } else {
      console.log("Failed to upload image");
    }
  };

  if (!organizerId) {
    router.navigate("/");
    return null;
  }

  const handlePostCreation = async () => {
    if (content.trim() === "") {
      Alert.alert("Error", "Event content cannot be empty.");
      return;
    }

    if (address.trim() === "") {
      Alert.alert("Error", "Events require an address.");
      return;
    }

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());

    if (combinedDateTime < new Date(Date.now())) {
      Alert.alert("Error", "The event must be some time in the future.");
      return;
    }

    if (media === "") {
      Alert.alert("Error", "Events require a header image.");
      return;
    }

    setLoading(true);
    try {
      await createEvent(organizerId, content, combinedDateTime, media.trim());
      Alert.alert("Success", "Event created successfully!");
      router.back();
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setMedia(""); // Clear the image url from state
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageSelection}>
        {media.trim() === "" ? (
          <View>
            <Text>Set a header image</Text>
            <TouchableOpacity
              onPress={() => {
                selectImage(handleImageUpload);
              }}
            >
              <Ionicons name="image-outline" size={40} />
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
      <TextInput
        style={styles.textInput}
        placeholder="Describe the event"
        value={content}
        onChangeText={setContent}
        selectionColor={COLOR_PRIMARY}
        multiline
      />
      <TextInput
        style={styles.addressInput}
        placeholder="Address of event"
        value={address}
        onChangeText={setAddress}
        selectionColor={COLOR_PRIMARY}
      />
      <View>
        <Text>Set time of event</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          <Ionicons name="calendar-outline" size={40} />
          <Text>{format(date, "EEEE, MMMM do, yyyy")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 10,
          }}
        >
          <Ionicons name="time-outline" size={40} />
          <Text>{format(time, "h:mm a")}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Create Event"
          color={COLOR_PRIMARY}
          onPress={handlePostCreation}
        />
      )}

      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          mode="date"
          onChange={(_, selectedDate: any) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(new Date(selectedDate));
            }
          }}
        />
      )}

      {showTimePicker && (
        <RNDateTimePicker
          value={time}
          mode="time"
          onChange={(_, selectedTime: any) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setTime(new Date(selectedTime));
            }
          }}
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
  addressInput: {
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

export default CreateEventScreen;
