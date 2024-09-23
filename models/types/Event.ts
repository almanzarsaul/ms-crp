import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { User } from "./User";

export interface Event {
  eventId: string;
  organizerId: string;
  organizer?: User;
  content: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  eventDate: FirebaseFirestoreTypes.Timestamp;
  likesCount: number;
  commentsCount: number;
  rsvpsCount: number;
  mediaUrl?: string;
  tags?: string;
  deleted: boolean;
}

export interface Like {
  likeId?: string;
  userId: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Comment {
  commentId?: string;
  userId: string;
  content: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  repliesCount?: number;
  replies?: Comment[];
  likesCount?: number;
  likes?: Like[];
}

export interface RSVP {
  rsvpId?: string;
  userId: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}
