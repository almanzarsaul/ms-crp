import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

// Assuming the getPostLikes and getUser methods are already implemented elsewhere
import {
  addCommentToPost,
  getPostComments,
  getPostLikes,
} from "@/models/Community"; // Adjust this import according to your file structure
import { getUser } from "@/models/User"; // Adjust this import according to your file structure
import { User } from "@/models/types/User";
import { Comment } from "@/models/types/Community";

import { formatDistance } from "date-fns";
import { COLOR_PRIMARY } from "@/assets/colors";
import auth from "@react-native-firebase/auth";

export interface Like {
  likeId?: string;
  userId: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

const CommentList = ({ postId }: { postId: string }) => {
  const currentUser = auth().currentUser!.uid;
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState<{ [key: string]: User }>({});
  const handleComment = async () => {
    await addCommentToPost(postId, content, currentUser);
    fetchComments();
    setContent("");
  };

  const fetchComments = async () => {
    try {
      // Fetch all comments for the post
      console.log(`Fetching comments for postId: ${postId}`);
      const commentsList = await getPostComments(postId);

      if (commentsList.length === 0) {
        console.log("No comments found for this post.");
      }

      // Fetch user data for each comment
      const userPromises = commentsList.map(async (comment) => {
        if (!usersMap[comment.userId]) {
          const user = await getUser(comment.userId);
          return { userId: comment.userId, user };
        }
        return null;
      });

      // Resolve all user promises
      const users = await Promise.all(userPromises);

      // Populate usersMap with the fetched user data
      const newUsersMap = { ...usersMap };
      users.forEach((result) => {
        if (result) {
          newUsersMap[result.userId] = result.user;
        }
      });

      setUsersMap(newUsersMap);
      setComments(commentsList);
    } catch (error) {
      console.error("Error fetching comments or users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View>
        {usersMap[item.userId]?.avatarURL ? (
          <Image
            source={{ uri: usersMap[item.userId].avatarURL! }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{usersMap[item.userId].name}</Text>
          <Text>{item.content}</Text>
        </View>
        <Text style={styles.time}>
          {formatDistance(item.createdAt.toDate(), new Date(), {
            addSuffix: true,
          })}
        </Text>
      </View>
    </View>
  );

  const commentSeparator: React.FC = () => (
    <View
      style={{
        width: "100%",
        borderBottomColor: "#F4F4F4",
        borderBottomWidth: 1,
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* FlatList for Comments */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComment}
        ItemSeparatorComponent={commentSeparator}
        style={styles.commentList}
      />
      {/* Input for new comment */}
      <View style={styles.inputContainer}>
        <TextInput
          selectionColor={COLOR_PRIMARY}
          placeholder="Leave a comment"
          style={styles.textInput}
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity onPress={handleComment} style={styles.iconButton}>
          <Ionicons name="send" size={24} color={COLOR_PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  commentList: {
    flex: 1,
    marginBottom: 10, // Added margin for space between the list and input
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  textInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  iconButton: {
    padding: 10,
    marginLeft: 10,
  },
  commentItem: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 10,
    color: "#C5C5C5",
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
});

export default CommentList;
