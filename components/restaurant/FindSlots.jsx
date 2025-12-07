// import { useState } from "react";
// import { Text, TouchableOpacity, View } from "react-native";

// export default function FindSlots({
//   date,
//   selectedNumber,
//   slots,
//   selectedSlot,
//   setSelectedSlot,
// }) {
//   const handleSlotPress = (slot) => {
//     let previousSlot = selectedSlot;
//     if (previousSlot === slot) {
//       setSelectedSlot(null);
//     } else {
//       setSelectedSlot(slot);
//     }
//   };

//   const [slotsVisible, setSlotsVisible] = useState(false);
//   return (
//     <View className="flex-1">
//       <View className={`flex ${selectedSlot != null && "flex-row"}`}>
//         <View className={`flex ${selectedSlot != null && "flex-1"}`}>
//           <TouchableOpacity onPress={() => setSlotsVisible(!slotsVisible)}>
//             <Text className="text-center text-lg font-semibold bg-[#fb9b33] p-2 my-3 mx-2 rounded-lg ">
//               Find Slots
//             </Text>
//           </TouchableOpacity>
//         </View>
//         {selectedSlot != null && (
//           <View className="flex-1">
//             <TouchableOpacity onPress={() => setSlotsVisible(!slotsVisible)}>
//               <Text className="text-center text-lg text-white font-semibold bg-[#fb9b33] p-2 my-3 mx-2 rounded-lg ">
//                 Book Slots
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//       {slotsVisible && (
//         <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
//           {slots.map((slot, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleSlotPress(slot)}
//               disabled={
//                 selectedSlot === slot || selectedSlot === null ? false : true
//               }
//               className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${
//                 selectedSlot && selectedSlot !== slot ? "opacity-50" : ""
//               }`}
//             >
//               <Text className="text-lg">{slot}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// }

import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from "formik";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import { db } from "../../config/firebaseConfig";
import guestFormSchema from "../../utils/guestFormSchema";

const FindSlots = ({
  date,
  selectedNumber,
  slots,
  selectedSlot,
  setSelectedSlot,
  restaurant,
}) => {
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const handlePress = () => {
    setSlotsVisible(!slotsVisible);
  };
  const handleSlotPress = (slot) => {
    let previousSlot = selectedSlot;
    if (previousSlot === slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = async () => {
    const guestStatus = await AsyncStorage.getItem("isGuest");
    const userEmail = await AsyncStorage.getItem("userEmail");

    if (userEmail) {
      // Proceed with booking
      try {
        await addDoc(collection(db, "bookings"), {
          email: userEmail,
          slots: selectedSlot,
          date: date.toISOString(),
          guests: selectedNumber,
          restaurant: restaurant,
        });
        alert("Booking Successful!");
      } catch (error) {
        console.log(error);
      }
    } else if (guestStatus === "true") {
      setFormVisible(true);
      setModalVisible(true);
    }
  };
  // const handleFormSubmit = async (values) => {
  //   try {
  //     await addDoc(collection(db, "bookings"), {
  //       ...values,
  //       slots: selectedSlot,
  //       date: date.toISOString(),
  //       guests: selectedNumber,
  //       restaurant: restaurant,
  //     });
  //     alert("Booking Successful!");
  //     setModalVisible(false);
  //     setFormVisible(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleFormSubmit = async (values) => {
    try {
      console.log("Form values:", values);
      console.log("Selected slot:", selectedSlot);
      console.log("Selected number:", selectedNumber);
      console.log("Restaurant:", restaurant);

      // Create booking data
      const bookingData = {
        fullName: values.fullName,
        phone: values.phone,
        slot: selectedSlot, // Changed from 'slots' to 'slot' for consistency
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant: restaurant,
        isGuest: true,
        createdAt: new Date().toISOString(),
        status: "confirmed",
      };

      console.log("Booking data to save:", bookingData);

      // Add to Firestore
      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      console.log("Booking created with ID:", docRef.id);

      // Success
      alert("Booking Successful! Your booking ID: " + docRef.id);
      setModalVisible(false);
      setFormVisible(false);

      // Reset form
      setSelectedSlot(null);
      setSlotsVisible(false);
    } catch (error) {
      console.error("Booking error details:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      // Specific error handling
      if (error.code === "permission-denied") {
        alert("Permission denied. Please check Firebase rules.");
      } else {
        alert("Booking failed. Error: " + error.message);
      }
    }
  };
  return (
    <View className="flex-1">
      <View className={`flex ${selectedSlot != null && "flex-row"}`}>
        <View className={`flex ${selectedSlot != null && "flex-1"}`}>
          <TouchableOpacity onPress={handlePress}>
            <Text className="text-lg font-semibold text-center bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>
        {selectedSlot != null && (
          <View className="flex-1">
            <TouchableOpacity onPress={handleBooking}>
              <Text className="text-lg text-white font-semibold text-center bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
                Book Slots
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {slotsVisible && (
        <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
          {slots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${
                selectedSlot && selectedSlot !== slot ? "opacity-50" : ""
              }`}
              onPress={() => handleSlotPress(slot)}
            >
              <Text className="text-lg font-bold text-white">{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="items-center justify-end flex-1 bg-black/50">
          <View className="w-full bg-white rounded-t-3xl max-h-[80%]">
            {/* Header with Close Button */}
            <View className="flex-row items-center justify-between p-6 pb-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-800">
                {formVisible ? "Book Your Slot" : "Login Required"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Text className="text-lg font-bold text-gray-600">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="p-6">
              {formVisible ? (
                <Formik
                  initialValues={{ fullName: "", phone: "" }}
                  validationSchema={guestFormSchema}
                  onSubmit={handleFormSubmit}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <View className="w-full">
                      {/* Full Name Field */}
                      <View className="mb-4">
                        <Text className="mb-2 text-sm font-semibold text-gray-700">
                          Full Name
                        </Text>
                        <TextInput
                          placeholder="Enter your name"
                          placeholderTextColor="#9CA3AF"
                          className="p-3 text-gray-800 border border-gray-300 rounded-xl bg-gray-50"
                          onChangeText={handleChange("fullName")}
                          onBlur={handleBlur("fullName")}
                          value={values.fullName}
                        />
                        {touched.fullName && errors.fullName && (
                          <Text className="mt-1 text-xs text-red-500">
                            {errors.fullName}
                          </Text>
                        )}
                      </View>

                      {/* Phone Number Field */}
                      <View className="mb-6">
                        <Text className="mb-2 text-sm font-semibold text-gray-700">
                          Phone Number
                        </Text>
                        <TextInput
                          placeholder="Enter your phone number"
                          placeholderTextColor="#9CA3AF"
                          className="p-3 text-gray-800 border border-gray-300 rounded-xl bg-gray-50"
                          onChangeText={handleChange("phone")}
                          onBlur={handleBlur("phone")}
                          value={values.phone}
                          keyboardType="phone-pad"
                        />
                        {touched.phone && errors.phone && (
                          <Text className="mt-1 text-xs text-red-500">
                            {errors.phone}
                          </Text>
                        )}
                      </View>

                      {/* Submit Button */}
                      <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-[#f49b33] rounded-xl p-4 shadow-lg active:scale-95 transition-transform"
                      >
                        <Text className="text-base font-bold text-center text-white">
                          Confirm Booking
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              ) : (
                <View className="items-center py-8">
                  <View className="items-center justify-center w-16 h-16 mb-4 bg-orange-100 rounded-full">
                    <Text className="text-2xl">🔒</Text>
                  </View>
                  <Text className="mb-2 text-lg font-semibold text-center text-gray-800">
                    Please log in to book a slot
                  </Text>
                  <Text className="mb-6 text-sm text-center text-gray-500">
                    You need to be logged in to continue
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      // Navigate to login screen
                    }}
                    className="bg-[#f49b33] rounded-xl px-8 py-3"
                  >
                    <Text className="font-semibold text-white">
                      Go to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;
