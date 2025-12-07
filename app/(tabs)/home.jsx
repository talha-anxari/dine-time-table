import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";

const Home = () => {
  const goto = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const temp = async () => {
    const value = await AsyncStorage.getItem("isGuest");
    const email = await AsyncStorage.getItem("userEmail");
    console.log("isGuest:", value);
    console.log("userEmail:", email);

    // Extract name from email for greeting
    if (email) {
      const name = email.split("@")[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => goto.push(`/restaurant/${item.name}`)}
      className="mr-4 overflow-hidden bg-gray-900 rounded-2xl"
      style={{
        width: 280,
        shadowColor: "#f49b33",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: "rgba(244, 155, 51, 0.2)",
      }}
    >
      {/* Image with gradient overlay */}
      <View className="relative">
        <Image
          resizeMode="cover"
          source={{ uri: item.image }}
          className="w-full h-40 rounded-t-2xl"
        />
        <View
          className="absolute inset-0 rounded-t-2xl"
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        />

        {/* Open Badge */}
        <View className="absolute top-3 left-3 bg-green-500 px-3 py-1.5 rounded-full">
          <Text className="text-xs font-bold text-white">● Open Now</Text>
        </View>

        {/* Rating Badge */}
        <View className="absolute top-3 right-3 bg-[#f49b33] px-3 py-1.5 rounded-full flex-row items-center">
          <Text className="mr-1 text-xs">⭐</Text>
          <Text className="text-xs font-bold text-white">4.5</Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        <Text className="mb-2 text-xl font-bold text-white" numberOfLines={1}>
          {item.name}
        </Text>

        {/* Address */}
        <View className="flex-row items-center mb-3">
          <View className="items-center justify-center w-6 h-6 mr-2 bg-gray-800 rounded-lg">
            <Text className="text-xs">📍</Text>
          </View>
          <Text className="flex-1 text-sm text-gray-400" numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        {/* Timing */}
        <View className="flex-row items-center pb-2 mb-3 border-b border-gray-800">
          <View className="items-center justify-center w-6 h-6 mr-2 bg-gray-800 rounded-lg">
            <Text className="text-xs">🕐</Text>
          </View>
          <Text className="text-sm text-gray-400">
            {item.opening} - {item.closing}
          </Text>
        </View>

        {/* View Details Button */}
        <TouchableOpacity
          className="bg-[#f49b33] rounded-xl py-3 active:scale-95"
          onPress={() => goto.push(`/restaurant/${item.name}`)}
        >
          <Text className="font-semibold text-center text-white">
            View Details →
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getRestaurants = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "restaurants"));
      const res = await getDocs(q);
      const restaurantsList = [];

      res.forEach((item) => {
        restaurantsList.push(item.data());
      });

      setRestaurants(restaurantsList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
    temp();
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-[#0d1117]"
      style={[
        Platform.OS === "android" && { paddingBottom: -48 },
        Platform.OS === "ios" && { paddingBottom: 20 },
      ]}
    >
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-gray-400">
              {userName ? `Hello, ${userName}` : "Welcome"}
            </Text>
            <Text className="text-2xl font-bold text-white">DineTime 🍽️</Text>
          </View>
          <TouchableOpacity
            className="items-center justify-center w-12 h-12 bg-gray-900 rounded-full"
            onPress={() => goto.push("/(tabs)/profile")}
          >
            <Text className="text-2xl">👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Hero Banner */}
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/homeBanner.png")}
          style={styles.bannerContainer}
          className="mb-6"
        >
          <View
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          />
          <BlurView
            intensity={Platform.OS === "android" ? 100 : 30}
            tint="dark"
            style={styles.blurBox}
          >
            <Text style={styles.title}>Dine with your</Text>
            <Text style={styles.title}>loved ones ❤️</Text>
            <Text className="mt-2 text-sm text-gray-300">
              Book your table in seconds
            </Text>
          </BlurView>
        </ImageBackground>

        {/* Special Discount Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <View>
              <Text className="text-3xl font-bold text-white">
                Special Discount
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                Limited time offers
              </Text>
            </View>
            <View className="bg-[#f49b33] px-3 py-1.5 rounded-full">
              <Text className="text-xs font-bold text-white">HOT 🔥</Text>
            </View>
          </View>

          {loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#f49b33" />
              <Text className="mt-3 text-sm text-gray-400">
                Loading restaurants...
              </Text>
            </View>
          ) : restaurants.length > 0 ? (
            <FlatList
              data={restaurants}
              keyExtractor={(item, index) => `discount-${item.name}-${index}`}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            />
          ) : (
            <View className="items-center py-20">
              <Text className="text-4xl">🍽️</Text>
              <Text className="mt-3 text-gray-400">No restaurants found</Text>
            </View>
          )}
        </View>

        {/* Popular Restaurants Section */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <View>
              <Text className="text-3xl font-bold text-white">
                Popular Restaurants
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                Most visited this week
              </Text>
            </View>
            <TouchableOpacity className="bg-gray-800 px-3 py-1.5 rounded-full">
              <Text className="text-xs font-semibold text-gray-300">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#f49b33" />
              <Text className="mt-3 text-sm text-gray-400">
                Loading restaurants...
              </Text>
            </View>
          ) : restaurants.length > 0 ? (
            <FlatList
              data={restaurants}
              keyExtractor={(item, index) => `popular-${item.name}-${index}`}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            />
          ) : (
            <View className="items-center py-20">
              <Text className="text-4xl">🍽️</Text>
              <Text className="mt-3 text-gray-400">No restaurants found</Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between">
            <View className="items-center flex-1 py-4 mr-2 bg-gray-900 rounded-2xl">
              <Text className="mb-2 text-3xl">🏆</Text>
              <Text className="text-2xl font-bold text-white">
                {restaurants.length}+
              </Text>
              <Text className="text-xs text-gray-400">Restaurants</Text>
            </View>
            <View className="items-center flex-1 py-4 mx-1 bg-gray-900 rounded-2xl">
              <Text className="mb-2 text-3xl">⭐</Text>
              <Text className="text-2xl font-bold text-white">4.8</Text>
              <Text className="text-xs text-gray-400">Avg Rating</Text>
            </View>
            <View className="items-center flex-1 py-4 ml-2 bg-gray-900 rounded-2xl">
              <Text className="mb-2 text-3xl">👥</Text>
              <Text className="text-2xl font-bold text-white">10K+</Text>
              <Text className="text-xs text-gray-400">Happy Users</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  bannerContainer: {
    width: "100%",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  blurBox: {
    width: "90%",
    paddingVertical: 24,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#f49b33",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(244, 155, 51, 0.3)",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
});
