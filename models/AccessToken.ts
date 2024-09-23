/**
 * AccessToken model. Access Tokens are used to allow users to register for the application.
 * Created by Saul Almanzar
 */

import addDays from "@/utils/addDays";
import firestore, {
  FirebaseFirestoreTypes,
  Timestamp,
} from "@react-native-firebase/firestore";
import { AccessToken } from "./types/AccessToken";

/**
 * Adds an Access Token document to Firestore.
 * @param {string} fullName Full name of person being "invited" to platform.
 * @param {FirebaseFirestoreTypes.Timestamp} [expiresAt]
 * @returns {string} Document ID of the newly created Access Token document.
 * Created by Saul Almanzar
 */
export const addAccessTokenDocument = async (
  fullName: string,
  expiresAt?: FirebaseFirestoreTypes.Timestamp
): Promise<string> => {
  try {
    if (!expiresAt) {
      expiresAt = Timestamp.fromDate(addDays(new Date(), 7));
    }

    const docRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> =
      await firestore().collection("AccessTokens").add({
        fullName,
        createdAt: Timestamp.now(),
        expiresAt: expiresAt,
      });

    console.log("Document successfully written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Could not create access token document.");
  }
};

export const getAccessTokenDocumentById = async (
  documentId: string
): Promise<AccessToken | null | undefined> => {
  try {
    const document = await firestore()
      .collection("AccessTokens")
      .doc(documentId)
      .get();

    if (document.exists) {
      const data = document.data();

      if (data) {
        const expiresAt = data.expiresAt as FirebaseFirestoreTypes.Timestamp;
        if (new Date(Date.now()) >= expiresAt.toDate()) {
          console.log("Document is expired.");
          return null;
        }

        const accessToken: AccessToken = {
          fullName: data.fullName,
          createdAt: data.createdAt,
          expiresAt: data.expiresAt,
        };

        console.log("Access Token Document:", accessToken);
        return accessToken;
      }
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    throw new Error("Could not fetch access token documnet.");
  }
};

export const deleteAccessTokenById = async (
  documentId: string
): Promise<void> => {
  try {
    await firestore().collection("AccessTokens").doc(documentId).delete();
    console.log(`Access Token [${documentId}] was deleted.`);
  } catch (error) {
    console.error(
      `There was an issue deleting the access token with the ID: ${documentId}`
    );
  }
};
