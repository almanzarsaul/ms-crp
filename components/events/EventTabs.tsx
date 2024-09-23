import React, { useCallback } from "react";
import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import LikesList from "@/components/events/LikeList";
import { COLOR_PRIMARY } from "@/assets/colors";
import CommentList from "@/components/events/CommentList";
import RSVPsList from "./RSVPList";

interface EventTabsProp {
  eventId: string;
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

const EventTabs: React.FC<EventTabsProp> = ({ eventId }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "rsvps", title: "Attending" },
    { key: "comments", title: "Comments" },
    { key: "likes", title: "Likes" },
  ]);

  // Memoize LikesList to avoid rerendering
  const renderLikesList = useCallback(
    () => <LikesList eventId={eventId} />,
    [eventId]
  );

  const renderCommentsList = useCallback(
    () => <CommentList eventId={eventId} />,
    [eventId]
  );

  const renderRSVPList = useCallback(
    () => <RSVPsList eventId={eventId} />,
    [eventId]
  );

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case "likes":
        return renderLikesList();
      case "comments":
        return renderCommentsList();
      case "rsvps":
        return renderRSVPList();

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

export default EventTabs;
