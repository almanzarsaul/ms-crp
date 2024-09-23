/**
 * Community model. Includes Firestore queries for anything that has to do with a Post, such as comments and likes.
 * Created by Saul Almanzar
 */

import firestore, {
  FirebaseFirestoreTypes,
  increment,
  Timestamp,
} from "@react-native-firebase/firestore";
import { Post, Like, Comment } from "./types/Community";

// Get all posts, optionally set a limit to ensure pagination.
export const getPosts = async (
  lastVisiblePost?: FirebaseFirestoreTypes.DocumentData,
  pageSize?: number
): Promise<{
  posts: Post[];
  lastVisible: FirebaseFirestoreTypes.DocumentData | null;
}> => {
  let postsQuery = firestore().collection("Posts").orderBy("createdAt", "desc");

  if (lastVisiblePost) {
    postsQuery = postsQuery.startAfter(lastVisiblePost);
  }

  if (pageSize) {
    postsQuery = postsQuery.limit(pageSize);
  }

  const postsSnapshot = await postsQuery.get();
  const posts: Post[] = postsSnapshot.docs.map((doc) => ({
    ...(doc.data() as Post),
    postId: doc.id,
  }));
  const lastVisible =
    postsSnapshot.docs.length > 0
      ? postsSnapshot.docs[postsSnapshot.docs.length - 1]
      : null; // Get last post that is returned in the snapshot

  return { posts, lastVisible };
};

// Get a single post by its id
export const getPost = async (postId: string): Promise<Post | null> => {
  try {
    const document = await firestore().collection("Posts").doc(postId).get();
    return document.exists ? (document.data() as Post) : null;
  } catch (error) {
    console.error({
      message: `There was an error while getting Post[${postId}].`,
      error: error,
    });
    return null;
  }
};

// Get a post's likes by it's postId.
export const getPostLikes = async (postId: string): Promise<Like[]> => {
  try {
    const document = await firestore()
      .collection("Posts")
      .doc(postId)
      .collection("Likes")
      .get();
    return document.docs.map((doc) => ({
      ...(doc.data() as Like),
      likeId: doc.id,
    }));
  } catch (error) {
    console.error({
      message: `There was an error while getting likes for Post[${postId}].`,
      error: error,
    });
    return [];
  }
};

// Get a post's comments by it's postId.
export const getPostComments = async (postId: string): Promise<Comment[]> => {
  try {
    const document = await firestore()
      .collection("Posts")
      .doc(postId)
      .collection("Comments")
      .get();
    return document.docs.map((doc) => doc.data() as Comment);
  } catch (error) {
    console.error({
      message: `There was an error while getting comments for Post[${postId}].`,
      error: error,
    });
    return [];
  }
};

export const deleteLikeFromPost = async (
  postId: string,
  likeId: string
): Promise<void> => {
  const postReference = firestore().collection("Posts").doc(postId);
  await postReference.collection("Likes").doc(likeId).delete();
  await postReference.update({ likesCount: increment(-1) });
};

// Add like to Post's Like subcollection and increase likesCount by 1.
export const addLikeToPost = async (
  postId: string,
  userId: string
): Promise<string | undefined> => {
  const like: Like = {
    userId: userId,
    createdAt: Timestamp.now(),
  };
  try {
    // Add Like to the post's Like subcollection
    const document = await firestore()
      .collection("Posts")
      .doc(postId)
      .collection("Likes")
      .add(like);
    // Increase LikeCount on Post
    await firestore()
      .collection("Posts")
      .doc(postId)
      .update({ likesCount: increment(1) });
    return document.id;
  } catch (error) {
    console.error({
      message: `There was an error while adding like to Post[${postId}].`,
      error: error,
    });
  }
};

// Add comment to Post's comment subcollection and increase commentCount by 1.
export const addCommentToPost = async (
  postId: string,
  content: string,
  currentUserId: string
): Promise<void> => {
  const comment: Comment = {
    content: content,
    userId: currentUserId,
    createdAt: Timestamp.now(),
  };
  try {
    // Add comment to the post's Comment subcollection
    await firestore()
      .collection("Posts")
      .doc(postId)
      .collection("Comments")
      .add(comment);
    // Increase commentCount on Post
    await firestore()
      .collection("Posts")
      .doc(postId)
      .update({ commentCount: increment(1) });
  } catch (error) {
    console.error({
      message: `There was an error while adding comment to Post[${postId}].`,
      error: error,
    });
  }
};

export const createPost = async (
  authorId: string,
  content: string,
  mediaUrl?: string | null
): Promise<void> => {
  try {
    await firestore()
      .collection("Posts")
      .add({
        authorId,
        content,
        createdAt: Timestamp.now(),
        likesCount: 0,
        commentsCount: 0,
        mediaUrl: mediaUrl || null,
      } as Partial<Post>);
  } catch (error) {
    console.error({
      message: `There was an error while creating a post.`,
      error: error,
    });
  }
};
