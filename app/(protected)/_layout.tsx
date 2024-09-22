import { Tabs } from "expo-router";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLOR_PRIMARY } from "@/assets/colors";
import auth from "@react-native-firebase/auth";

export default function TabLayout() {
  const user = auth().currentUser;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarActiveBackgroundColor: COLOR_PRIMARY,
        tabBarStyle: { height: 80 },
        tabBarItemStyle: {height: 80},
        tabBarLabelStyle: { display: "none" },
      }}
    >
      <Tabs.Screen
        name="CommunityScreen"
        options={{
          title: "Community",
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: 45, height: 45 }}
              source={
                focused
                  ? require("@/assets/images/crp-logo-white.png")
                  : require("@/assets/images/crp-logo-black.png")
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="EventsScreen"
        options={{
          title: "Events",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={30}
              color={focused ? "white" : "fff"}
              name={focused ? "calendar" : "calendar-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: user?.displayName || user?.email || "Settings", // Fallback to email if user does not have a display name. Should never have to fall back to "Settings".
          tabBarIcon: () => (
            <Image
              style={{ width: 28, height: 28 }}
              source={{ uri: "https://avatar.iran.liara.run/public/1.png" }}
            ></Image>
          ),
        }}
      />
    </Tabs>
  );
}
