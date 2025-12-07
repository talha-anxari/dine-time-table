import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";

const History = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const goto = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };
    fetchUserData();
  }, []);

  const fetchBookings = async () => {
    if (userEmail) {
      try {
        setRefreshing(true);
        const bookingCollection = collection(db, "bookings");
        const bookingQuery = query(
          bookingCollection,
          where("email", "==", userEmail)
        );
        const querySnapshot = await getDocs(bookingQuery);
        const bookingsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsList);
        setLoading(false);
        setRefreshing(false);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch bookings.");
        console.log(error);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userEmail]);

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-[#0d1117]">
        <ActivityIndicator size="large" color="#f49b33" />
        <Text className="mt-4 text-gray-400">Loading your bookings...</Text>
      </SafeAreaView>
    );
  }

  // Not logged in state
  if (!userEmail) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d1117] px-6">
        <View className="items-center justify-center flex-1">
          <View className="items-center justify-center w-24 h-24 mb-6 bg-gray-800 rounded-full">
            <Text className="text-5xl">📋</Text>
          </View>
          <Text className="mb-3 text-2xl font-bold text-center text-white">
            View Your Bookings
          </Text>
          <Text className="mb-8 text-base text-center text-gray-400">
            Sign in to access your booking history and manage your reservations
          </Text>
          <TouchableOpacity
            onPress={() => goto.push("/signin")}
            className="bg-[#f49b33] rounded-xl px-12 py-4 shadow-lg active:scale-95"
          >
            <Text className="text-base font-bold text-center text-white">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (bookings.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d1117] px-6">
        <View className="items-center justify-center flex-1">
          <View className="items-center justify-center w-24 h-24 mb-6 bg-gray-800 rounded-full">
            <Text className="text-5xl">🍽️</Text>
          </View>
          <Text className="mb-3 text-2xl font-bold text-center text-white">
            No Bookings Yet
          </Text>
          <Text className="mb-8 text-base text-center text-gray-400">
            Start exploring restaurants and make your first reservation!
          </Text>
          <TouchableOpacity
            onPress={() => goto.push("/")}
            className="bg-[#f49b33] rounded-xl px-12 py-4 shadow-lg active:scale-95"
          >
            <Text className="text-base font-bold text-center text-white">
              Explore Restaurants
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0d1117]">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-800">
        <Text className="text-2xl font-bold text-white">Booking History</Text>
        <Text className="mt-1 text-sm text-gray-400">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </Text>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchBookings}
            tintColor="#f49b33"
            colors={["#f49b33"]}
          />
        }
        renderItem={({ item }) => (
          <View className="p-5 mb-4 bg-gray-900 border border-gray-800 rounded-2xl">
            {/* Restaurant Name */}
            <View className="flex-row items-center mb-4">
              <View className="items-center justify-center w-12 h-12 mr-3 bg-orange-500/20 rounded-xl">
                <Text className="text-2xl">🏪</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">
                  {item.restaurant}
                </Text>
                <Text className="text-sm text-gray-400">Reservation</Text>
              </View>
            </View>

            {/* Booking Details */}
            <View className="pt-4 border-t border-gray-800">
              {/* Date & Time */}
              <View className="flex-row items-center mb-3">
                <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-800 rounded-lg">
                  <Text className="text-base">📅</Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Date</Text>
                  <Text className="text-sm font-semibold text-white">
                    {item.date}
                  </Text>
                </View>
              </View>

              {/* Time Slot */}
              <View className="flex-row items-center mb-3">
                <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-800 rounded-lg">
                  <Text className="text-base">⏰</Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Time Slot</Text>
                  <Text className="text-sm font-semibold text-white">
                    {item.slots}
                  </Text>
                </View>
              </View>

              {/* Guests */}
              <View className="flex-row items-center mb-3">
                <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-800 rounded-lg">
                  <Text className="text-base">👥</Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Guests</Text>
                  <Text className="text-sm font-semibold text-white">
                    {item.guests} {item.guests === 1 ? "person" : "people"}
                  </Text>
                </View>
              </View>

              {/* Email */}
              <View className="flex-row items-center">
                <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-800 rounded-lg">
                  <Text className="text-base">📧</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500">Contact</Text>
                  <Text
                    className="text-sm font-semibold text-white"
                    numberOfLines={1}
                  >
                    {item.email}
                  </Text>
                </View>
              </View>
            </View>

            {/* Status Badge */}
            <View className="flex-row justify-end mt-4">
              <View className="bg-green-500/20 px-3 py-1.5 rounded-full">
                <Text className="text-xs font-semibold text-green-400">
                  ✓ Confirmed
                </Text>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="items-center py-4">
            <Text className="text-sm text-gray-600">Pull down to refresh</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default History;
