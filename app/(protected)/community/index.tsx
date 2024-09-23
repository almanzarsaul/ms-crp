import { COLOR_PRIMARY } from "@/assets/colors";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Button,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { Stack } from "expo-router/stack";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPosts } from "@/models/Community";
import { Post } from "@/models/types/Community";
import { getUser } from "@/models/User";
import { User } from "@/models/types/User";
import { PostComponent } from "@/components/Post";

export default function Community() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const userCache: { [userId: string]: User } = {};

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchPosts();

    setRefreshing(false);
  };

  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      const { posts: postsData } = await getPosts();

      const postsWithAuthors = await Promise.all(
        postsData.map(async (post) => {
          if (!userCache[post.authorId]) {
            // Fetch user if not already cached
            const user = await getUser(post.authorId);
            userCache[post.authorId] = user;
          }

          return {
            ...post,
            author: userCache[post.authorId],
          };
        })
      );

      setPosts(postsWithAuthors);
    } catch (error) {
      alert("There was an error fetching posts!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size={"large"}
        color={COLOR_PRIMARY}
        style={{ marginVertical: 20 }}
      />
    );

  const postSeparator: React.FC = () => (
    <View
      style={{
        width: "100%",
        borderBottomColor: "#F4F4F4",
        borderBottomWidth: 1,
      }}
    ></View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Create Post"
        color={COLOR_PRIMARY}
        onPress={() => router.push("/(protected)/community/CreatePostScreen")}
      />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostComponent
            post={item}
            onPress={() => router.push(`/community/${item.postId}`)}
          />
        )}
        keyExtractor={(post) => post.postId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={postSeparator}
      />
    </View>
  );
}
