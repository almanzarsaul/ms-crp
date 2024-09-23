import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  GestureResponderEvent,
} from "react-native";
import { Post } from "@/models/types/Community"; // Assuming you have these interfaces defined in a file
import { COLOR_PRIMARY } from "@/assets/colors";
import {
  addLikeToPost,
  deleteLikeFromPost,
  getPostLikes,
} from "@/models/Community";
import { Timestamp } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import { getUser } from "@/models/User";
import { User } from "@/models/types/User";

interface PostProps {
  post: Post;
  onPress?: any;
}

export const PostComponent: React.FC<PostProps> = ({ post, onPress }) => {
  const currentUserId = auth().currentUser!.uid;
  const [hasLiked, setHasLiked] = useState(false);
  const [currentUserLikeId, setCurrentUserLikeID] = useState<string | null>(
    null
  );
  const [author, setAuthor] = useState<User | null>();
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [currentlyLiking, setCurrentlyLiking] = useState(false);

  async function handleLike() {
    if (!currentlyLiking) {
      // Prevent the user from liking twice
      setCurrentlyLiking(true);
      try {
        if (hasLiked && currentUserLikeId) {
          await deleteLikeFromPost(post.postId, currentUserLikeId);
          setHasLiked(false);
          setLikesCount(likesCount - 1);
          setCurrentUserLikeID(null);
        } else {
          const likeId = await addLikeToPost(post.postId, currentUserId);
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

  async function getAuthor() {
    const author = await getUser(post.authorId);
    setAuthor(author);
  }

  async function checkIfUserHasLiked() {
    const postLikes = await getPostLikes(post.postId);
    postLikes.forEach((like) => {
      if (like.userId === currentUserId) {
        setCurrentUserLikeID(like.likeId!);
        setHasLiked(true);
      }
    });
  }

  useEffect(() => {
    checkIfUserHasLiked();
    getAuthor();
  }, []);

  if (author) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.header}>
            {author.avatarURL ? (
              <Image source={{ uri: author.avatarURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <Text style={styles.name}>{author.name}</Text>
          </View>
          <Text style={styles.content}>
            {post.content.substring(0, 236)}
            {post.content.length > 236 && "..."}
          </Text>
          {post.mediaUrl && (
            <Image source={{ uri: post.mediaUrl }} style={styles.media} />
          )}
          <View style={styles.footer}>
            <Text style={styles.footerTime}>
              {formatDistance(post.createdAt.toDate(), new Date(), {
                addSuffix: true,
              })}
            </Text>
            <View style={styles.footerInteractions}>
              <TouchableOpacity style={styles.button} onPressOut={handleLike}>
                <Ionicons
                  name={`heart${!hasLiked ? "-outline" : ""}`}
                  size={24}
                  color={COLOR_PRIMARY}
                />
                <Text style={styles.buttonText}>{likesCount}</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={COLOR_PRIMARY}
                />
                <Text style={styles.buttonText}>{post.commentsCount}</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
  content: {
    marginBottom: 10,
  },
  media: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerTime: {
    color: "#C5C5C5",
    fontSize: 10,
  },
  footerInteractions: {
    flexDirection: "row",
  },
  buttonText: {
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
});
