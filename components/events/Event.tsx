import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Event } from "@/models/types/Event";
import { COLOR_PRIMARY } from "@/assets/colors";
import {
  addLikeToPost,
  deleteLikeFromPost,
  getPostLikes,
} from "@/models/Community";
import auth from "@react-native-firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { formatDistance, format } from "date-fns";
import { getUser } from "@/models/User";
import { User } from "@/models/types/User";
import {
  addLikeToEvent,
  addRSVPToEvent,
  deleteLikeFromEvent,
  deleteRSVPFromEvent,
  getEventLikes,
  getEventRSVPs,
} from "@/models/Event";
import { RSVP } from "@/models/types/Event";

interface EventProps {
  event: Event;
  onPress?: any;
}

export const EventComponent: React.FC<EventProps> = ({ event, onPress }) => {
  const currentUserId = auth().currentUser!.uid;
  const [hasLiked, setHasLiked] = useState(false);
  const [currentUserLikeId, setCurrentUserLikeID] = useState<string | null>(
    null
  );
  const [currentUserRSVPID, setCurrentUserRSVPID] = useState<string | null>(
    null
  );
  const [author, setAuthor] = useState<User | null>();
  const [likesCount, setLikesCount] = useState(event.likesCount);
  const [currentlyLiking, setCurrentlyLiking] = useState(false);
  const [currentlyRSVPing, setCurrentlyRSVPing] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(event.rsvpsCount);
  const [hasRsvped, setHasRsvped] = useState(false); // Similar to hasLiked
  const [loading, setLoading] = useState(false);
  const [rsvps, setRSVPs] = useState<User[] | null>(null);

  const fetchRSVPs = async () => {
    try {
      console.log(`Fetching RSVPs for eventId: ${event.eventId}`);
      const rsvpList = await getEventRSVPs(event.eventId);

      if (rsvpList.length === 0) {
        console.log("No RSVP found for this event.");
      }

      const userPromises = rsvpList.map(async (rsvp: RSVP) => {
        console.log(`Fetching user details for userId: ${rsvp.userId}`);
        const user = await getUser(rsvp.userId);
        console.log(`Fetched user: `, user);
        return user;
      });

      const users = await Promise.all(userPromises);
      console.log("All user data fetched: ", users);
      setRSVPs(users);
    } catch (error) {
      console.error("Error fetching RSVPs or users:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleLike() {
    if (!currentlyLiking) {
      setCurrentlyLiking(true);
      try {
        if (hasLiked && currentUserLikeId) {
          await deleteLikeFromEvent(event.eventId, currentUserLikeId);
          setHasLiked(false);
          setLikesCount(likesCount - 1);
          setCurrentUserLikeID(null);
        } else {
          const likeId = await addLikeToEvent(event.eventId, currentUserId);
          setHasLiked(true);
          setLikesCount(likesCount + 1);
          setCurrentUserLikeID(likeId!);
        }
      } catch (error) {
        alert(`There was an issue handling your like request: ${error}`);
      } finally {
        setCurrentlyLiking(false);
      }
    }
  }

  async function handleRSVP() {
    if (!currentlyRSVPing) {
      setCurrentlyRSVPing(true);
      try {
        if (hasRsvped && currentUserRSVPID) {
          await deleteRSVPFromEvent(event.eventId, currentUserRSVPID);
          setHasRsvped(false);
          setRsvpCount(rsvpCount - 1);
          setCurrentUserRSVPID(null);
        } else {
          const rsvpId = await addRSVPToEvent(event.eventId, currentUserId);
          setHasRsvped(true);
          setRsvpCount(rsvpCount + 1);
          setCurrentUserRSVPID(rsvpId!);
        }
      } catch (error) {
        alert(`There was an issue handling your RSVP request: ${error}`);
      } finally {
        setCurrentlyRSVPing(false);
      }
    }
  }

  async function getAuthor() {
    const author = await getUser(event.organizerId); // Assuming `organizerId` is the correct field
    setAuthor(author);
  }

  async function checkIfUserHasLiked() {
    const eventLikes = await getEventLikes(event.eventId);
    eventLikes.forEach((like) => {
      if (like.userId === currentUserId) {
        setCurrentUserLikeID(like.likeId!);
        setHasLiked(true);
      }
    });
  }

  async function checkIfUserHasRSVPed() {
    const eventRSVPs = await getEventRSVPs(event.eventId);
    eventRSVPs.forEach((rsvp) => {
      if (rsvp.userId === currentUserId) {
        setCurrentUserRSVPID(rsvp.rsvpId!);
        setHasRsvped(true);
      }
    });
  }

  useEffect(() => {
    checkIfUserHasLiked();
    checkIfUserHasRSVPed();
    getAuthor();
  }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {event.mediaUrl && (
          <Image source={{ uri: event.mediaUrl }} style={styles.media} />
        )}
        <Text style={styles.content}>
          {event.content.substring(0, 236)}
          {event.content.length > 236 && "..."}
        </Text>

        {/* Time above the footer */}
        <Text style={styles.footerTime}>
          {`Event takes place ${formatDistance(
            new Date(event.eventDate.toDate()),
            new Date(),
            {
              addSuffix: true,
            }
          )} (${format(
            new Date(event.eventDate.toDate()),
            "MMMM d, yyyy HH:mm"
          )})`}
        </Text>

        {/* Footer: Organizer on the left, like/rsvp on the right */}
        <View style={styles.footer}>
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerText}>Organizer:</Text>
            {author && author.avatarURL ? (
              <Image source={{ uri: author.avatarURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <Text style={styles.name}>{author?.name}</Text>
          </View>

          <View style={styles.footerInteractions}>
            <TouchableOpacity style={styles.button} onPress={handleLike}>
              <Ionicons
                name={`heart${!hasLiked ? "-outline" : ""}`}
                size={24}
                color={COLOR_PRIMARY}
              />
              <Text style={styles.buttonText}>{likesCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRSVP}>
              <Ionicons
                name={`checkmark-circle${!hasRsvped ? "-outline" : ""}`}
                size={24}
                color={COLOR_PRIMARY}
              />
              <Text style={styles.buttonText}>{rsvpCount}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  media: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  content: {
    marginBottom: 10,
  },
  footerTime: {
    color: "#C5C5C5",
    fontSize: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  organizerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizerText: {
    marginRight: 5,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
  },
  footerInteractions: {
    flexDirection: "row",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  buttonText: {
    fontWeight: "bold",
    marginLeft: 5,
  },
});
