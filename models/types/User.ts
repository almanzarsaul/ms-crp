import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: number;
  banned: boolean;
  deleted: boolean;
  avatarURL?: string | null;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}
