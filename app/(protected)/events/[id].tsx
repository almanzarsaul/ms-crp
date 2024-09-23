import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Post } from "@/models/types/Community";
import { COLOR_PRIMARY } from "@/assets/colors";
import { getPost } from "@/models/Community";
import { useLocalSearchParams } from "expo-router";
import { PostComponent } from "@/components/Post";
import EventTabs from "@/components/events/EventTabs";
import CommentList from "@/components/CommentList";
import { EventComponent } from "@/components/events/Event";
import { getEvent } from "@/models/Event";
import { Event } from "@/models/types/Event";

const EventDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const getPostObject = async () => {
    const fetchedEvent: Event | null = await getEvent(eventId);
    if (!fetchedEvent) {
      throw Error("Could not get event.");
    }
    setEvent({ ...fetchedEvent, eventId: eventId });
    console.log(event);
  };

  useEffect(() => {
    setLoading(true);
    try {
      getPostObject();
    } catch (error) {
      alert(`There was an issue getting the post [${eventId}].`);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <ActivityIndicator size="large" color={COLOR_PRIMARY} />;

  if (event)
    return (
      <View style={{ flex: 1 }}>
        <EventComponent event={event!} />
        <EventTabs eventId={eventId} />
      </View>
    );

  return <Text>Could not find post!</Text>;
};

export default EventDetail;
