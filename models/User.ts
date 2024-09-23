import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { User } from "./types/User";
import firestore, { Timestamp } from "@react-native-firebase/firestore";

export const getUser = async (uid: string): Promise<User> => {
  const document = await firestore().collection("Users").doc(uid).get();
  return document.data() as User;
};

export const createUser = async (
  user: FirebaseAuthTypes.User,
  displayName?: string
): Promise<void> => {
  try {
    await firestore()
      .collection("Users")
      .doc(user.uid)
      .set({
        name: displayName || "",
        email: user.email,
        role: 0,
        avatarURL: user.photoURL,
        banned: false,
        deleted: false,
        createdAt: Timestamp.now(),
      } as Partial<User>);
  } catch (error) {
    console.error({
      message: `There was an error creating User[${user.uid}]`,
      error: error,
    });
  }
};

export const updateUserAvatar = async (uid: string, avatarURL: string) => {
  try {
    await firestore()
      .collection("Users")
      .doc(uid)
      .update({ avatarURL: avatarURL });
  } catch (error) {
    console.error({
      message: `There was an error updating the avatar for User[${uid}]`,
      error: error,
    });
  }
};
