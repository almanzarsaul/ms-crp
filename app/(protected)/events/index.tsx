import { COLOR_PRIMARY } from "@/assets/colors";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Button,
  FlatList,
  RefreshControl,
  Text,
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
import { getEvents } from "@/models/Event";
import { EventComponent } from "@/components/events/Event";
import { Event } from "@/models/types/Event";

export default function Community() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const userCache: { [userId: string]: User } = {};

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchEvents();

    setRefreshing(false);
  };

  const fetchEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      const { events: eventsData } = await getEvents();

      const eventsWithOrganizers = await Promise.all(
        eventsData.map(async (event) => {
          if (!userCache[event.organizerId]) {
            // Fetch user if not already cached
            const user = await getUser(event.organizerId);
            userCache[event.organizerId] = user;
          }

          return {
            ...event,
            organizer: userCache[event.organizerId],
          };
        })
      );
      setEvents(eventsWithOrganizers);
    } catch (error) {
      alert("There was an error fetching posts!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size={"large"}
        color={COLOR_PRIMARY}
        style={{ marginVertical: 20 }}
      />
    );

  const eventSeparator: React.FC = () => (
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
        title="Create Event"
        color={COLOR_PRIMARY}
        onPress={() => router.push("/(protected)/events/CreateEventScreen")}
      />
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventComponent
            event={item}
            onPress={() => router.push(`/events/${item.eventId}`)}
          />
        )}
        keyExtractor={(event) => event.eventId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={eventSeparator}
      />
    </View>
  );
}
