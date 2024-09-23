import React, { useCallback } from "react";
import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import LikesList from "@/components/LikeList";
import { COLOR_PRIMARY } from "@/assets/colors";
import CommentList from "@/components/CommentList";

interface PostTabsProps {
  postId: string;
}

interface Route {
  key: string;
  title: string;
}

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: COLOR_PRIMARY }}
    style={{ backgroundColor: "white" }}
    labelStyle={{ color: COLOR_PRIMARY }}
  />
);

const PostTabs: React.FC<PostTabsProps> = ({ postId }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "comments", title: "Comments" },
    { key: "likes", title: "Likes" },
  ]);

  // Memoize LikesList to avoid rerendering
  const renderLikesList = useCallback(
    () => <LikesList postId={postId} />,
    [postId]
  );

  const renderCommentsList = useCallback(
    () => <CommentList postId={postId} />,
    [postId]
  );

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case "likes":
        return renderLikesList();
      case "comments":
        return renderCommentsList();
      default:
        return null;
    }
  };

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};

export default PostTabs;
