import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../assets/Colors";

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.dark.text,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#0b1f29",
          backgroundColor: Colors.SECONDARY,
          height: 75 + insets.bottom, // 61 fixed height + safe area
          paddingBottom: 20 + insets.bottom, // to avoid overlap with home indicator
        },
        tabBarLabelStyle: {
          backgroundColor: Colors.SECONDARY,
          height: 75 + insets.bottom, // 61 fixed height + safe area
          paddingBottom: 20 + insets.bottom, // to avoid overlap with home indicator
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
