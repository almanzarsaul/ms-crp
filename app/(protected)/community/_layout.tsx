import { Stack } from "expo-router";
export default function CommunityLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Community" }} />
      <Stack.Screen name="[id]" options={{ title: "Post details" }} />
      <Stack.Screen
        name="CreatePostScreen"
        options={{ title: "Create new post" }}
      />
    </Stack>
  );
}
