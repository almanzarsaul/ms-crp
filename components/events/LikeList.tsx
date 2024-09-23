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
import { getEventLikes } from "@/models/Event";

export interface Like {
  likeId?: string;
  userId: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

const LikesList = ({ eventId }: { eventId: string }) => {
  const [likes, setLikes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // Fetch all likes for the post
        console.log(`Fetching likes for postId: ${eventId}`);
        const likesList = await getEventLikes(eventId);

        if (likesList.length === 0) {
          console.log("No likes found for this post.");
        }

        const userPromises = likesList.map(async (like: Like) => {
          console.log(`Fetching user details for userId: ${like.userId}`);
          const user = await getUser(like.userId);
          console.log(`Fetched user: `, user);
          return user;
        });

        const users = await Promise.all(userPromises);
        console.log("All user data fetched: ", users);
        setLikes(users);
      } catch (error) {
        console.error("Error fetching likes or users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [eventId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderLike = ({ item }: { item: User }) => (
    <View style={styles.likeItem}>
      {item.avatarURL ? (
        <Image source={{ uri: item.avatarURL }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const likeSeparator: React.FC = () => (
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
      data={likes}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderLike}
      ItemSeparatorComponent={likeSeparator}
    />
  );
};

const styles = StyleSheet.create({
  likeItem: {
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

export default LikesList;
