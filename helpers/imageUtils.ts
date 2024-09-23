import { Platform } from "react-native";
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
  ImageLibraryOptions,
} from "react-native-image-picker";
import storage from "@react-native-firebase/storage";

export const uploadImage = async (uri: string): Promise<string | null> => {
  try {
    const filename = uri.substring(uri.lastIndexOf("/") + 1); // Unique name based on filepath
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;

    const task = storage().ref(filename).putFile(uploadUri);

    // Listen for state changes, errors, and completion of the upload.
    task.on("state_changed", (snapshot) => {
      console.log("Uploading: ", snapshot.bytesTransferred); // Log the progress of the upload
    });

    await task; // Wait for task

    // Get download URL
    const url = await storage().ref(filename).getDownloadURL();
    console.log("Download URL: ", url);
    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const selectImage = (callback: (url: string | null) => void): void => {
  const options: ImageLibraryOptions = {
    mediaType: "photo",
    quality: 1,
  };

  launchImageLibrary(options, (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.errorCode) {
      console.log("ImagePicker Error: ", response.errorCode);
    } else if (response.assets && response.assets[0].uri) {
      const uri = response.assets[0].uri;
      uploadImage(uri).then(callback);
    }
  });
};
