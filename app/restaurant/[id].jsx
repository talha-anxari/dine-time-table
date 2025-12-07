import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "../../components/restaurant/DatePicker";
import FindSlots from "../../components/restaurant/FindSlots";
import GuestPicker from "../../components/restaurant/GuestPicker";
import { db } from "../../config/firebaseConfig";

const Restaurant = () => {
  const { id } = useLocalSearchParams();
  const goto = useRouter();
  const flatListRef = useRef(null);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const windowWidth = Dimensions.get("window").width;
  const [date, setDate] = useState(new Date());
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleNextImage = () => {
    const carouselLength = carouselData[0]?.images.length;
    if (currentImageIndex < carouselLength - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    } else {
      const newIndex = 0;
      setCurrentImageIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handlePrevImage = () => {
    const carouselLength = carouselData[0]?.images.length;
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    } else {
      const newIndex = carouselLength - 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const carouselItem = ({ item }) => (
    <View
      style={{
        width: windowWidth - 32,
        height: 280,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#000",
        marginHorizontal: 16,
      }}
    >
      <Image
        source={{ uri: item }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />

      {/* Dark Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 1,
        }}
      />

      {/* Navigation Arrows */}
      <TouchableOpacity
        onPress={handlePrevImage}
        style={{
          position: "absolute",
          top: "50%",
          marginTop: -20,
          left: 16,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: 10,
          borderRadius: 50,
          zIndex: 10,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNextImage}
        style={{
          position: "absolute",
          top: "50%",
          marginTop: -20,
          right: 16,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: 10,
          borderRadius: 50,
          zIndex: 10,
        }}
      >
        <Ionicons name="chevron-forward" size={24} color="white" />
      </TouchableOpacity>

      {/* Progress Indicators */}
      <View
        style={{
          position: "absolute",
          bottom: 16,
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {carouselData[0]?.images?.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === currentImageIndex ? 32 : 8,
              height: 4,
              backgroundColor:
                i === currentImageIndex ? "#f49b33" : "rgba(255,255,255,0.5)",
              borderRadius: 2,
              marginHorizontal: 3,
              transition: "all 0.3s",
            }}
          />
        ))}
      </View>
    </View>
  );

  const getRestaurantData = async () => {
    try {
      setLoading(true);
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", id)
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log("No matching restaurant found.");
        setLoading(false);
        return;
      }

      for (const doc of restaurantSnapshot.docs) {
        const restaurantData = doc.data();
        setRestaurantData(restaurantData);

        // Fetch carousel data
        const carouselQuery = query(
          collection(db, "carousel"),
          where("res_id", "==", doc.ref)
        );
        const carouselSnapshot = await getDocs(carouselQuery);
        const carouselImages = [];

        if (!carouselSnapshot.empty) {
          carouselSnapshot.forEach((carouselDoc) => {
            carouselImages.push(carouselDoc.data());
          });
          setCarouselData(carouselImages);
        }

        // Fetch slots data
        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", doc.ref)
        );
        const slotsSnapshot = await getDocs(slotsQuery);
        const slots = [];
        slotsSnapshot.forEach((slotDoc) => {
          slots.push(slotDoc.data());
        });
        setSlotsData(slots[0]?.slot);
      }
      setLoading(false);
    } catch (error) {
      console.log("fetching data failed", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  const handleLocation = async () => {
    const url = "https://maps.app.goo.gl/iR45DUh9W1NuWtZr8";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d1117] items-center justify-center">
        <ActivityIndicator size="large" color="#f49b33" />
        <Text className="mt-4 text-gray-400">
          Loading restaurant details...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => goto.back()}
          className="items-center justify-center w-10 h-10 bg-gray-900 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#f49b33" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white" numberOfLines={1}>
          {id}
        </Text>
        <TouchableOpacity className="items-center justify-center w-10 h-10 bg-gray-900 rounded-full">
          <Ionicons name="heart-outline" size={24} color="#f49b33" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Image Carousel */}
        <View className="my-4">
          {carouselData[0]?.images?.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={carouselData[0]?.images}
              renderItem={carouselItem}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              horizontal
              pagingEnabled
            />
          ) : (
            <View className="items-center justify-center h-64 mx-4 bg-gray-900 rounded-2xl">
              <Text className="text-4xl">🍽️</Text>
              <Text className="mt-2 text-gray-400">No images available</Text>
            </View>
          )}
        </View>

        {/* Restaurant Info Card */}
        <View className="mx-4 mb-4 bg-gray-900 border border-gray-800 rounded-2xl">
          {/* Rating & Status */}
          <View className="flex-row items-center justify-between p-4 pb-3 border-b border-gray-800">
            <View className="flex-row items-center">
              <View className="bg-[#f49b33] px-3 py-1.5 rounded-full flex-row items-center mr-3">
                <Text className="mr-1">⭐</Text>
                <Text className="text-sm font-bold text-white">4.5</Text>
              </View>
              <View className="bg-green-500 px-3 py-1.5 rounded-full">
                <Text className="text-xs font-bold text-white">● Open Now</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <TouchableOpacity
            onPress={handleLocation}
            className="flex-row items-start p-4 border-b border-gray-800 active:bg-gray-800"
          >
            <View className="items-center justify-center w-10 h-10 mr-3 bg-orange-500/20 rounded-xl">
              <Ionicons name="location-sharp" size={20} color="#f49b33" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Location</Text>
              <Text className="mt-1 text-sm text-white">
                {restaurantData?.address}
              </Text>
              <Text className="mt-1 text-sm font-semibold text-[#f49b33]">
                Get Directions →
              </Text>
            </View>
          </TouchableOpacity>

          {/* Timing */}
          <View className="flex-row items-center p-4">
            <View className="items-center justify-center w-10 h-10 mr-3 bg-blue-500/20 rounded-xl">
              <Ionicons name="time-outline" size={20} color="#f49b33" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Opening Hours</Text>
              <Text className="mt-1 text-sm font-semibold text-white">
                {restaurantData?.opening} - {restaurantData?.closing}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Section */}
        <View className="mx-4 mb-4 bg-gray-900 border border-gray-800 rounded-2xl">
          <View className="p-4 border-b border-gray-800">
            <Text className="text-lg font-bold text-white">Book a Table</Text>
            <Text className="mt-1 text-sm text-gray-400">
              Select your preferred date and guests
            </Text>
          </View>

          {/* Date Picker */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
            <View className="flex-row items-center flex-1">
              <View className="items-center justify-center w-10 h-10 mr-3 bg-purple-500/20 rounded-xl">
                <Ionicons name="calendar" size={20} color="#f49b33" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Booking Date</Text>
                <Text className="mt-1 text-sm font-semibold text-white">
                  Select Date
                </Text>
              </View>
            </View>
            <DatePicker date={date} setDate={setDate} />
          </View>

          {/* Guest Picker */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center flex-1">
              <View className="items-center justify-center w-10 h-10 mr-3 bg-pink-500/20 rounded-xl">
                <Ionicons name="people" size={20} color="#f49b33" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Number of Guests</Text>
                <Text className="mt-1 text-sm font-semibold text-white">
                  {selectedNumber} {selectedNumber === 1 ? "Guest" : "Guests"}
                </Text>
              </View>
            </View>
            <GuestPicker
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>

        {/* Available Slots */}
        <View className="mx-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-white">
              Available Time Slots
            </Text>
            <View className="bg-[#f49b33]/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-semibold text-[#f49b33]">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
          <FindSlots
            restaurant={id}
            date={date}
            selectedNumber={selectedNumber}
            slots={slotsData}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </View>

        {/* Features Section */}
        <View className="mx-4 mt-6">
          <Text className="mb-3 text-base font-bold text-white">
            Amenities & Features
          </Text>
          <View className="flex-row flex-wrap">
            <View className="px-4 py-2 mb-2 mr-2 bg-gray-900 border border-gray-800 rounded-xl">
              <Text className="text-sm text-gray-300">🅿️ Parking</Text>
            </View>
            <View className="px-4 py-2 mb-2 mr-2 bg-gray-900 border border-gray-800 rounded-xl">
              <Text className="text-sm text-gray-300">📶 Free WiFi</Text>
            </View>
            <View className="px-4 py-2 mb-2 mr-2 bg-gray-900 border border-gray-800 rounded-xl">
              <Text className="text-sm text-gray-300">❄️ AC</Text>
            </View>
            <View className="px-4 py-2 mb-2 mr-2 bg-gray-900 border border-gray-800 rounded-xl">
              <Text className="text-sm text-gray-300">🎵 Live Music</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0d1117",
    flex: 1,
    ...Platform.select({
      android: { paddingBottom: -48 },
      ios: { paddingBottom: 20 },
    }),
  },
});
