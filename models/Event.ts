/**
 * Event model. Includes Firestore queries for anything that has to do with an Event, such as comments, likes, and RSVPs.
 * Created by Saul Almanzar
 */

import firestore, {
  FirebaseFirestoreTypes,
  increment,
  Timestamp,
} from "@react-native-firebase/firestore";
import { Event, Like, RSVP, Comment } from "./types/Event";

// Get all events, optionally set a limit to ensure pagination.
export const getEvents = async (
  lastVisibleEvent?: FirebaseFirestoreTypes.DocumentData,
  pageSize?: number
): Promise<{
  events: Event[];
  lastVisible: FirebaseFirestoreTypes.DocumentData | null;
}> => {
  let eventsQuery = firestore()
    .collection("Events")
    .orderBy("createdAt", "desc");

  if (lastVisibleEvent) {
    eventsQuery = eventsQuery.startAfter(lastVisibleEvent);
  }

  if (pageSize) {
    eventsQuery = eventsQuery.limit(pageSize);
  }

  const eventsSnapshot = await eventsQuery.get();
  const events: Event[] = eventsSnapshot.docs.map((doc) => ({
    ...(doc.data() as Event),
    eventId: doc.id,
  }));
  const lastVisible =
    eventsSnapshot.docs.length > 0
      ? eventsSnapshot.docs[eventsSnapshot.docs.length - 1]
      : null; // Get last event that is returned in the snapshot

  return { events, lastVisible };
};

// Get a single event by its id
export const getEvent = async (eventId: string): Promise<Event | null> => {
  try {
    const document = await firestore().collection("Events").doc(eventId).get();
    return document.exists ? (document.data() as Event) : null;
  } catch (error) {
    console.error({
      message: `There was an error while getting Event[${eventId}].`,
      error: error,
    });
    return null;
  }
};

// Get an event's RSVPs by its eventId.
export const getEventRSVPs = async (eventId: string): Promise<RSVP[]> => {
  try {
    const document = await firestore()
      .collection("Events")
      .doc(eventId)
      .collection("RSVPs")
      .get();
    return document.docs.map((doc) => ({
      ...(doc.data() as RSVP),
      rsvpId: doc.id,
    }));
  } catch (error) {
    console.error({
      message: `There was an error while getting RSVPs for Event[${eventId}].`,
      error: error,
    });
    return [];
  }
};

// Get an event's likes by its eventId.
export const getEventLikes = async (eventId: string): Promise<Like[]> => {
  try {
    const document = await firestore()
      .collection("Events")
      .doc(eventId)
      .collection("Likes")
      .get();
    return document.docs.map((doc) => ({
      ...(doc.data() as Like),
      likeId: doc.id,
    }));
  } catch (error) {
    console.error({
      message: `There was an error while getting likes for Event[${eventId}].`,
      error: error,
    });
    return [];
  }
};

// Get an event's comments by its eventId.
export const getEventComments = async (eventId: string): Promise<Comment[]> => {
  try {
    const document = await firestore()
      .collection("Events")
      .doc(eventId)
      .collection("Comments")
      .get();
    return document.docs.map((doc) => doc.data() as Comment);
  } catch (error) {
    console.error({
      message: `There was an error while getting comments for Event[${eventId}].`,
      error: error,
    });
    return [];
  }
};

export const deleteRSVPFromEvent = async (
  eventId: string,
  rsvpId: string
): Promise<void> => {
  const eventReference = firestore().collection("Events").doc(eventId);
  await eventReference.collection("RSVPs").doc(rsvpId).delete();
  await eventReference.update({ rsvpsCount: increment(-1) });
};

export const deleteLikeFromEvent = async (
  eventId: string,
  likeId: string
): Promise<void> => {
  const eventReference = firestore().collection("Events").doc(eventId);
  await eventReference.collection("Likes").doc(likeId).delete();
  await eventReference.update({ likesCount: increment(-1) });
};

// Add RSVP to Event's RSVP subcollection and increase rsvpsCount by 1.
export const addRSVPToEvent = async (
  eventId: string,
  userId: string
): Promise<string | undefined> => {
  const rsvp: RSVP = {
    userId: userId,
    createdAt: Timestamp.now(),
  };
  try {
    // Add RSVP to the event's RSVP subcollection
    const document = await firestore()
      .collection("Events")
      .doc(eventId)
      .collection("RSVPs")
      .add(rsvp);
    // Increase RSVPCount on Event
    await firestore()
      .collection("Events")
      .doc(eventId)
      .update({ rsvpsCount: increment(1) });
    return document.id;
  } catch (error) {
    console.error({
      message: `There was an error while adding RSVP to Event[${eventId}].`,
      error: error,
    });
  }
};

// Add like to Event's Like subcollection and increase likesCount by 1.
export const addLikeToEvent = async (
  eventId: string,
  userId: string
): Promise<string | undefined> => {
  const like: Like = {
    userId: userId,
    createdAt: Timestamp.now(),
  };
  try {
    // Add Like to the event's Like subcollection
    const document = await firestore()
      .collection("Events")
      .doc(eventId)
      .collection("Likes")
      .add(like);
    // Increase LikeCount on Event
    await firestore()
      .collection("Events")
      .doc(eventId)
      .update({ likesCount: increment(1) });
    return document.id;
  } catch (error) {
    console.error({
      message: `There was an error while adding like to Event[${eventId}].`,
      error: error,
    });
  }
};

// Add comment to Event's comment subcollection and increase commentCount by 1.
export const addCommentToEvent = async (
  eventId: string,
  content: string,
  currentUserId: string
): Promise<void> => {
  const comment: Comment = {
    content: content,
    userId: currentUserId,
    createdAt: Timestamp.now(),
  };
  try {
    // Add comment to the event's Comment subcollection
    await firestore()
      .collection("Events")
      .doc(eventId)
      .collection("Comments")
      .add(comment);
    // Increase commentCount on Event
    await firestore()
      .collection("Events")
      .doc(eventId)
      .update({ commentCount: increment(1) });
  } catch (error) {
    console.error({
      message: `There was an error while adding comment to Event[${eventId}].`,
      error: error,
    });
  }
};

export const createEvent = async (
  organizerId: string,
  content: string,
  eventDate: Date,
  mediaUrl: string
): Promise<void> => {
  try {
    await firestore()
      .collection("Events")
      .add({
        organizerId,
        content,
        eventDate,
        createdAt: Timestamp.now(),
        rsvpsCount: 0,
        likesCount: 0,
        commentsCount: 0,
        mediaUrl: mediaUrl || null,
      } as Partial<Event>);
  } catch (error) {
    console.error({
      message: `There was an error while creating an event.`,
      error: error,
    });
  }
};
