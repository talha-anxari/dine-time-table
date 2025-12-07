import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(null);
  const goto = useRouter();

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };

    fetchUserEmail();
  }, []);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            await AsyncStorage.removeItem("userEmail");
            setUserEmail(null);
            Alert.alert("Success", "You have been signed out successfully.");
            goto.push("/signin");
          } catch (error) {
            Alert.alert("Error", "An error occurred while signing out.");
            console.log(error);
          }
        },
      },
    ]);
  };

  // Not logged in state
  if (!userEmail) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d1117]">
        <View className="items-center justify-center flex-1 px-6">
          <View className="items-center justify-center w-32 h-32 mb-6 bg-gray-800 rounded-full">
            <Text className="text-6xl">👤</Text>
          </View>
          <Text className="mb-3 text-3xl font-bold text-center text-white">
            Welcome!
          </Text>
          <Text className="mb-8 text-base text-center text-gray-400">
            Create an account to book tables, save favorites, and manage your
            reservations
          </Text>
          <TouchableOpacity
            onPress={() => goto.push("/signup")}
            className="bg-[#f49b33] rounded-xl px-12 py-4 shadow-lg active:scale-95 w-full"
          >
            <Text className="text-base font-bold text-center text-white">
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goto.push("/signin")}
            className="px-12 py-4 mt-3 border-2 border-gray-700 rounded-xl active:scale-95"
          >
            <Text className="text-base font-semibold text-center text-gray-300">
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Logged in state
  return (
    <SafeAreaView className="flex-1 bg-[#0d1117]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center px-6 pt-8 pb-6">
          <View className="items-center justify-center w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
            <Text className="text-5xl">👤</Text>
          </View>
          <Text className="text-2xl font-bold text-white">My Profile</Text>
          <Text className="mt-2 text-sm text-gray-400">
            Manage your account settings
          </Text>
        </View>

        {/* Profile Card */}
        <View className="px-6 mb-6">
          <View className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
            <Text className="mb-4 text-lg font-bold text-white">
              Account Information
            </Text>

            {/* Email Section */}
            <View className="flex-row items-center p-4 mb-3 bg-gray-800 rounded-xl">
              <View className="items-center justify-center w-10 h-10 mr-3 rounded-lg bg-orange-500/20">
                <Text className="text-xl">📧</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-400">Email Address</Text>
                <Text
                  className="mt-1 text-sm font-semibold text-white"
                  numberOfLines={1}
                >
                  {userEmail}
                </Text>
              </View>
            </View>

            {/* Account Status */}
            <View className="flex-row items-center p-4 bg-green-500/10 rounded-xl">
              <View className="items-center justify-center w-10 h-10 mr-3 rounded-lg bg-green-500/20">
                <Text className="text-xl">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-400">Account Status</Text>
                <Text className="mt-1 text-sm font-semibold text-green-400">
                  Active & Verified
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="mb-3 text-base font-bold text-gray-400">
            Quick Actions
          </Text>

          <TouchableOpacity
            onPress={() => goto.push("/(tabs)/history")}
            className="flex-row items-center justify-between p-4 mb-3 bg-gray-900 border border-gray-800 rounded-xl active:bg-gray-800"
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 rounded-lg bg-blue-500/20">
                <Text className="text-xl">📋</Text>
              </View>
              <Text className="text-base font-semibold text-white">
                Booking History
              </Text>
            </View>
            <Text className="text-gray-500">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => goto.push("/(tabs)")}
            className="flex-row items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl active:bg-gray-800"
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 rounded-lg bg-purple-500/20">
                <Text className="text-xl">🍽️</Text>
              </View>
              <Text className="text-base font-semibold text-white">
                Explore Restaurants
              </Text>
            </View>
            <Text className="text-gray-500">›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center p-4 border-2 bg-red-500/20 border-red-500/30 rounded-xl active:scale-95"
          >
            <Text className="mr-2 text-2xl">🚪</Text>
            <Text className="text-base font-bold text-center text-red-400">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-xs text-gray-600">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
