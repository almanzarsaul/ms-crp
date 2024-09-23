import { Stack } from "expo-router";
export default function EventLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Events" }} />
      <Stack.Screen name="[id]" options={{ title: "Event details" }} />
      <Stack.Screen
        name="CreateEventScreen"
        options={{ title: "Create new event" }}
      />
    </Stack>
  );
}
