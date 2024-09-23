import { Stack } from "expo-router";
export default function CommunityLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen
        name="CreateAccessToken"
        options={{ title: "Create Access Token" }}
      />
    </Stack>
  );
}
