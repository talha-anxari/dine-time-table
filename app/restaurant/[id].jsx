import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "../../components/restaurant/DatePicker";
import FindSlots from "../../components/restaurant/FindSlots";
import GuestPicker from "../../components/restaurant/GuestPicker";
import { db } from "../../config/firebaseConfig";

const Restaurant = () => {
  const { id } = useLocalSearchParams();
  const flatListRef = useRef(null);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    }

    if (currentImageIndex === carouselLength - 1) {
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
    }

    if (currentImageIndex === 0) {
      const newIndex = carouselLength - 1;
      setCurrentImageIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const carouselItem = ({ item }) => (
    <View
      style={{
        width: windowWidth - 2,
        height: 256,
        borderRadius: 25,
        overflow: "hidden", // This is critical for rounded corners
        backgroundColor: "#000",
      }}
    >
      {/* Background Image - Remove individual borderRadius */}
      <Image
        source={{ uri: item }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />

      {/* Dark Overlay (Optional) */}
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

      {/* Left Arrow */}
      <View
        style={{
          position: "absolute",
          top: "50%",
          marginTop: -20,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: 8,
          borderRadius: 50,
          left: 2,
          zIndex: 10,
        }}
      >
        <Ionicons
          onPress={handlePrevImage}
          name="arrow-back"
          size={24}
          color="white"
        />
      </View>

      {/* Right Arrow */}
      <View
        style={{
          position: "absolute",
          top: "50%",
          marginTop: -20,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: 8,
          borderRadius: 50,
          right: 16,
          zIndex: 10,
        }}
      >
        <Ionicons
          onPress={handleNextImage}
          name="arrow-forward"
          size={24}
          color="white"
        />
      </View>

      {/* Progress Bar Style Dots */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
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
              width: i === currentImageIndex ? 28 : 8,
              height: 4,
              backgroundColor:
                i === currentImageIndex ? "#f49b33" : "rgba(255,255,255,0.5)",
              borderRadius: 2,
              marginHorizontal: 2,
            }}
          />
        ))}
      </View>
    </View>
  );
  const getRestaurantData = async () => {
    try {
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", id)
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log("No matching restaurant found.");
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
        if (carouselSnapshot.empty) {
          console.log("No matching carousel found.");
          return;
        }
        carouselSnapshot.forEach((carouselDoc) => {
          carouselImages.push(carouselDoc.data());
        });
        setCarouselData(carouselImages);

        // Fetch slots data
        // Slots Data
        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", doc.ref)
        );
        const slotsSnapshot = await getDocs(slotsQuery);
        // const slots = [];
        // slotsSnapshot.forEach((slotDoc) => {
        //   slots.push(slotDoc.data());
        // });
        // setSlotsData(slots[0]?.slot);
        const slots = [];
        slotsSnapshot.forEach((slotDoc) => {
          slots.push(slotDoc.data());
        });
        setSlotsData(slots[0]?.slot);
      }
    } catch (error) {
      console.log("fetching data faild", error);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.idContainer}>
          <Text style={styles.idText}>{id}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={carouselData[0]?.images}
            renderItem={carouselItem}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            horizontal
            style={styles.flatList}
          />
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={24} color={"#f49b33"} />
          <Text style={styles.addressText}>
            {restaurantData?.address} |{" "}
            <Text onPress={handleLocation} style={styles.directionsText}>
              Get Directions
            </Text>
          </Text>
        </View>

        <View style={styles.timingContainer}>
          <Ionicons name="time" size={24} color={"#f49b33"} />
          <Text style={styles.timingText}>
            {restaurantData?.opening} - {restaurantData?.closing}
          </Text>
        </View>
        <View className="flex-1 border border-[#fb9b33] rounded-lg p-2 m-2">
          <View className="flex-row items-center justify-between p-2 m-2">
            {/* Left Side: Icon + Label */}
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color={"#fb9b33"} />
              <Text className="mx-2 text-base text-white">
                Select booking date
              </Text>
            </View>

            {/* Right Side: DatePicker */}
            <DatePicker date={date} setDate={setDate} />
          </View>

          <View className="flex-row bg-[#474747] rounded-lg items-center justify-between p-2 m-2">
            {/* Left Side: Icon + Label */}
            <View className="flex-row items-center">
              <Ionicons name="people" size={20} color={"#fb9b33"} />
              <Text className="mx-2 text-base text-white">
                Select number of guests
              </Text>
            </View>

            {/* Right Side: DatePicker */}
            <GuestPicker
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>
        <View className="flex-1">
          <FindSlots
            restaurant={id}
            date={date}
            selectedNumber={selectedNumber}
            slots={slotsData} // ✅ Agar slotsData mein slot array hai
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Restaurant;

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0d1117",
    flex: 1,
    ...Platform.select({
      android: { paddingBottom: -48 },
      ios: { paddingBottom: 20 },
    }),
  },

  scrollView: {
    flex: 1,
    showsVerticalScrollIndicator: false,
  },

  idContainer: {
    flex: 1,
    padding: 8,
    marginVertical: 8,
  },

  idText: {
    fontSize: 20,
    color: "#f49b33",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#f49b33",
  },

  carouselContainer: {
    height: 256, // h-64 = 16 * 16 = 256
    maxWidth: "98%",
    marginHorizontal: 8, // mx-2 = 8
    borderRadius: 25,
  },

  flatList: {
    borderRadius: 25,
  },

  locationContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    marginTop: 8,
  },

  addressText: {
    color: "#fff",
    maxWidth: "75%",
  },

  directionsText: {
    color: "#f49b33",
    textDecorationLine: "underline",
    fontStyle: "italic",
    marginTop: 4,
    fontWeight: "600",
  },

  timingContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
  },

  timingText: {
    color: "#fff",
    marginHorizontal: 8,
    maxWidth: "75%",
  },
});

// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useLocalSearchParams } from "expo-router";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   Linking,
//   ScrollView,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import DatePicker from "../../components/restaurant/DatePicker";
// import FindSlots from "../../components/restaurant/FindSlots";
// import GuestPicker from "../../components/restaurant/GuestPicker";
// import { db } from "../../config/firebaseConfig";

// const Restaurant = () => {
//   const [restaurantData, setRestaurantData] = useState({});
//   const [carouselData, setCarouselData] = useState({});
//   const [date, setDate] = useState(new Date());
//   const [slotsData, setSlotsData] = useState({});
//   const { restaurant } = useLocalSearchParams();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatlistRef = useRef(null);
//   const [selectedNumber, setSelectedNumber] = useState(2);

//   const [selectedSlot, setSelectedSlot] = useState(null);

//   const windowWindow = Dimensions.get("window").width;

//   const handleNextImage = () => {
//     const carouselLength = carouselData[0]?.images.length;
//     if (currentIndex < carouselLength - 1) {
//       const nextIndex = currentIndex + 1;
//       setCurrentIndex(nextIndex);
//       flatlistRef.current.scrollToIndex({ index: nextIndex, animated: true });
//     }

//     if (currentIndex === carouselLength - 1) {
//       const nextIndex = 0;
//       setCurrentIndex(nextIndex);
//       flatlistRef.current.scrollToIndex({ index: nextIndex, animated: true });
//     }
//   };
//   const handlePrevImage = () => {
//     const carouselLength = carouselData[0]?.images.length;
//     if (currentIndex > 0) {
//       const prevIndex = currentIndex - 1;
//       setCurrentIndex(prevIndex);
//       flatlistRef.current.scrollToIndex({ index: prevIndex, animated: true });
//     }

//     if (currentIndex === 0) {
//       const prevIndex = carouselLength - 1;
//       setCurrentIndex(prevIndex);
//       flatlistRef.current.scrollToIndex({ index: prevIndex, animated: true });
//     }
//   };

//   const carouselItem = ({ item }) => {
//     return (
//       <View
//         style={{ width: windowWindow - 32 }}
//         className="relative h-64 mx-2 overflow-hidden"
//       >
//         {/* Image */}
//         <Image
//           source={{ uri: item }}
//           resizeMode="cover"
//           className="w-full h-52"
//           style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
//         />

//         {/* Icon Overlay */}
//         {/* Next Button */}
//         <View
//           style={{
//             position: "absolute",
//             top: "35%",
//             right: 16,
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             borderRadius: 50,
//             padding: 8,
//             zIndex: 10,
//           }}
//         >
//           <Ionicons
//             onPress={handleNextImage}
//             name="arrow-forward"
//             size={24}
//             color="#fff"
//           />
//         </View>

//         {/* Previous Button */}
//         <View
//           style={{
//             position: "absolute",
//             top: "35%",
//             left: 6,
//             backgroundColor: "rgba(0, 0, 0, 0.6)",
//             borderRadius: 50,
//             padding: 8,
//             zIndex: 10,
//           }}
//         >
//           <Ionicons
//             onPress={handlePrevImage}
//             name="arrow-back"
//             size={24}
//             color="#fff"
//           />
//         </View>

//         <View
//           style={{
//             position: "absolute",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexDirection: "row",
//             left: "50%",
//             transform: [{ translateX: -50 }],
//             zIndex: 10,
//             bottom: 60,
//           }}
//         >
//           {carouselData[0].images?.map((_, i) => (
//             <View
//               key={i}
//               className={`${
//                 i === currentIndex && "h-3 w-3 bg-white"
//               } bg-gray-200 h-2 w-2 mx-1 rounded-full`}
//             />
//           ))}
//         </View>
//       </View>
//     );
//   };

//   const getRestaurantData = async () => {
//     try {
//       const restaurantQuery = query(
//         collection(db, "restaurants"),
//         where("name", "==", restaurant)
//       );
//       const restaurantSnapshot = await getDocs(restaurantQuery);

//       if (restaurantSnapshot.empty) {
//         console.log("Data not found");
//       }

//       for (const doc of restaurantSnapshot.docs) {
//         const restaurantData = doc.data();
//         setRestaurantData(restaurantData);

//         // Carousel Data
//         const carouselQuery = query(
//           collection(db, "carousel"),
//           where("res_id", "==", doc.ref)
//         );
//         const carouselSnapshot = await getDocs(carouselQuery);
//         const carouselImages = [];
//         carouselSnapshot.forEach((carouselDoc) => {
//           carouselImages.push(carouselDoc.data());
//         });
//         setCarouselData(carouselImages);

//         // Slots Data
//         const slotsQuery = query(
//           collection(db, "slots"),
//           where("ref_id", "==", doc.ref)
//         );
//         const slotsSnapshot = await getDocs(slotsQuery);
//         const slots = [];
//         slotsSnapshot.forEach((slotDoc) => {
//           slots.push(slotDoc.data());
//         });
//         setSlotsData(slots[0]?.slot);
//       }
//     } catch (error) {
//       console.log("fetching data faild", error);
//     }
//   };

//   useEffect(() => {
//     getRestaurantData();
//   }, []);

//   const handleLocation = async () => {
//     const url = "https://maps.app.goo.gl/53VpjotE56LuSBWc8";
//     const supported = await Linking.openURL(url);

//     if (supported) {
//       await Linking.openURL(url);
//     } else {
//       console.log("You have to access", url);
//     }
//   };

//   return (
//     <SafeAreaView style={{ backgroundColor: "#0d1117", flex: 1 }}>
//       <ScrollView style={{ flex: 1 }} className="p-2 my-2">
//         <View className="mb-4">
//           <Text className="text-xl font-semibold text-[#fb9b33]">
//             {restaurant}
//           </Text>
//           <View className="border-b border-[#fb9b33]" />
//         </View>
//         <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
//           <FlatList
//             ref={flatlistRef}
//             data={carouselData[0]?.images}
//             renderItem={carouselItem}
//             horizontal
//             scrollEnabled={false}
//             showsHorizontalScrollIndicator={false}
//           />
//         </View>
//         <View className="flex-row p-2 mt-2">
//           <Ionicons size={24} color={"#fb9b33"} name="location-sharp" />
//           <Text className="text-white max-w-[75%] ml-2 flex-1 flex-wrap">
//             {restaurantData?.address} |{" "}
//             <Text
//               onPress={handleLocation}
//               className="text-[#fb9b33] font-semibold underline"
//             >
//               Get Direction
//             </Text>
//           </Text>
//         </View>
//         <View className="flex-row p-2">
//           <Ionicons size={20} color={"#fb9b33"} name="time" />
//           <Text className="text-white max-w-[75%] ml-2 flex-1 flex-wrap">
//             {restaurantData?.opening} - {restaurantData?.closing}
//           </Text>
//         </View>

//         {/* <View className="flex-row items-center justify-between p-2 m-2">
//           <View className="flex-row flex-1">
//             <Ionicons name="calendar" size={20} color={"#fb9b33"} />
//             <Text className="mx-2 text-base text-white">
//               Select booking date
//             </Text>
//             <DatePicker date={date} setDate={setDate} />
//           </View>
//         </View> */}

//         {/* <View className="flex-row items-center justify-between p-2 m-2">
//           <View className="flex-row items-center mr-4">
//             <View className="bg-[#fb9b33]/20 p-2 rounded-lg mr-3">
//               <Ionicons name="calendar" size={20} color="#fb9b33" />
//             </View>
//             <Text className="text-base font-medium text-white">
//               Booking Date
//             </Text>
//           </View>
//           <View className="flex-1 ml-4">
//             <DatePicker date={date} setDate={setDate} />
//           </View>
//         </View> */}
//         <View className="flex-1 border border-[#fb9b33] rounded-lg p-2 m-2">
//           <View className="flex-row items-center justify-between p-2 m-2">
//             {/* Left Side: Icon + Label */}
//             <View className="flex-row items-center">
//               <Ionicons name="calendar" size={20} color={"#fb9b33"} />
//               <Text className="mx-2 text-base text-white">
//                 Select booking date
//               </Text>
//             </View>

//             {/* Right Side: DatePicker */}
//             <DatePicker date={date} setDate={setDate} />
//           </View>

//           <View className="flex-row bg-[#474747] rounded-lg items-center justify-between p-2 m-2">
//             {/* Left Side: Icon + Label */}
//             <View className="flex-row items-center">
//               <Ionicons name="people" size={20} color={"#fb9b33"} />
//               <Text className="mx-2 text-base text-white">
//                 Select number of guests
//               </Text>
//             </View>

//             {/* Right Side: DatePicker */}
//             <GuestPicker
//               selectedNumber={selectedNumber}
//               setSelectedNumber={setSelectedNumber}
//             />
//           </View>
//         </View>
//         <View className="flex-1">
//           <FindSlots
//             date={date}
//             selectedNumber={selectedNumber}
//             slots={slotsData}
//             selectedSlot={selectedSlot}
//             setSelectedSlot={setSelectedSlot}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Restaurant;
