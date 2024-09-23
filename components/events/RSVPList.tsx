import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

// Assuming the getPostLikes and getUser methods are already implemented elsewhere
import { getPostLikes } from "@/models/Community"; // Adjust this import according to your file structure
import { getUser } from "@/models/User"; // Adjust this import according to your file structure
import { User } from "@/models/types/User";
import { getEventLikes, getEventRSVPs } from "@/models/Event";
import { RSVP } from "@/models/types/Event";

const RSVPsList = ({ eventId }: { eventId: string }) => {
  const [rsvps, setRSVPs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // Fetch all likes for the post
        console.log(`Fetching RSVPs for postId: ${eventId}`);
        const rsvpList = await getEventRSVPs(eventId);

        if (rsvpList.length === 0) {
          console.log("No RSVP found for this post.");
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

    fetchLikes();
  }, [eventId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderRSVP = ({ item }: { item: User }) => (
    <View style={styles.rsvpItem}>
      {item.avatarURL ? (
        <Image source={{ uri: item.avatarURL }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const rsvpsSeparator: React.FC = () => (
    <View
      style={{
        width: "100%",
        borderBottomColor: "#F4F4F4",
        borderBottomWidth: 1,
      }}
    ></View>
  );

  return (
    <FlatList
      data={rsvps}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderRSVP}
      ItemSeparatorComponent={rsvpsSeparator}
    />
  );
};

const styles = StyleSheet.create({
  rsvpItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
});

export default RSVPsList;
