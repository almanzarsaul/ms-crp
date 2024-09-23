import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Post } from "@/models/types/Community";
import { COLOR_PRIMARY } from "@/assets/colors";
import { getPost } from "@/models/Community";
import { useLocalSearchParams } from "expo-router";
import { PostComponent } from "@/components/Post";
import PostTabs from "@/components/PostTabs";
import CommentList from "@/components/CommentList";

const PostDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const getPostObject = async () => {
    const fetchedPosts: Post | null = await getPost(postId);
    if (!fetchedPosts) {
      throw Error("Could not get post.");
    }
    setPost({ ...fetchedPosts, postId: postId });
    console.log(post);
  };

  useEffect(() => {
    setLoading(true);
    try {
      getPostObject();
    } catch (error) {
      alert(`There was an issue getting the post [${postId}].`);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <ActivityIndicator size="large" color={COLOR_PRIMARY} />;

  if (post)
    return (
      <View style={{ flex: 1 }}>
        <PostComponent post={post!} />
        <PostTabs postId={postId} />
      </View>
    );

  return <Text>Could not find post!</Text>;
};

export default PostDetail;
