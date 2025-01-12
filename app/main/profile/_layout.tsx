import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#05BFDB",
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
     
    </Tabs>
  );
}
