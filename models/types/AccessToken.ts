import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface AccessToken {
  fullName: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  expiresAt: FirebaseFirestoreTypes.Timestamp;
}
