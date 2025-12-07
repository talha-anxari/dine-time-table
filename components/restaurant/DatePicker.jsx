// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useState } from "react";
// import { Platform, Text, TouchableOpacity, View } from "react-native";

// export default function DatePicker({ date, setDate }) {
//   const [show, setShow] = useState(false);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(false);
//     setDate(currentDate);
//   };

//   const showPicker = () => {
//     setShow(true);
//   };

//   return (
//     <View className="flex flex-row items-center space-x-4">
//       <TouchableOpacity
//         onPress={showPicker}
//         className={`text-white text-base justify-end items-center rounded-lg ${
//           Platform.OS === "android" && "px-4 py-2 justify-center bg-[#474747]"
//         }`}
//       >
//         {/* <Text className="text-[#fb9b33]">Select Date</Text> */}
//         {Platform.OS === "android" && (
//           <Text className="text-white">{date.toLocaleDateString()}</Text>
//         )}
//         {Platform.OS === "android" && show && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={onChange}
//             minimumDate={new Date()}
//             maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
//             accentColor="#fb9b33" // iOS only
//             textColor="#fb9b33" // iOS only
//             className="text-[#fb9b33]"
//           />
//         )}
//         {Platform.OS === "ios" && show && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={onChange}
//             minimumDate={new Date()}
//             maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
//             accentColor="#fb9b33" // iOS only
//             textColor="#fb9b33" // iOS only
//             className="text-[#fb9b33]"
//           />
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DatePicker({ date, setDate }) {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    // Android par picker automatically close ho jata hai, lekin iOS par aap shayad ek explicit control chahenge.
    const currentDate = selectedDate || date;
    if (Platform.OS === "android") {
      setShow(false);
    }
    setDate(currentDate);
  };

  const showPicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showPicker} style={styles.button}>
        <Text style={styles.buttonText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          accentColor="#fb9b33" // iOS only
          textColor="#fb9b33" // iOS only
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#474747",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useState } from "react";
// import { Platform, Text, TouchableOpacity, View } from "react-native";

// export default function DatePicker({ date, setDate }) {
//   const [show, setShow] = useState(false);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === "ios");
//     setDate(currentDate);
//   };

//   const showPicker = () => {
//     setShow(true);
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString("en-US", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const isToday = (date) => {
//     const today = new Date();
//     return date.toDateString() === today.toDateString();
//   };

//   return (
//     <View className="flex-1">
//       <TouchableOpacity
//         onPress={showPicker}
//         className="flex-row items-center justify-between bg-[#2a2a2a] border border-[#404040] rounded-xl px-4 py-3 shadow-lg"
//         activeOpacity={0.8}
//       >
//         <View className="flex-row items-center flex-1">
//           <View className="bg-[#fb9b33]/20 p-2 rounded-lg mr-3">
//             <Ionicons name="calendar-outline" size={18} color="#fb9b33" />
//           </View>
//           <View className="flex-1">
//             <Text className="text-[#fb9b33] text-xs font-medium uppercase tracking-wide mb-1">
//               Selected Date
//             </Text>
//             <Text className="text-base font-semibold text-white">
//               {isToday(date) ? "Today" : formatDate(date)}
//             </Text>
//             {isToday(date) && (
//               <Text className="text-sm text-gray-400">{formatDate(date)}</Text>
//             )}
//           </View>
//         </View>
//         <View className="bg-[#fb9b33]/10 p-2 rounded-lg">
//           <Ionicons name="chevron-down" size={16} color="#fb9b33" />
//         </View>
//       </TouchableOpacity>

//       {show && Platform.OS === "android" && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display="default"
//           onChange={onChange}
//           minimumDate={new Date()}
//           maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
//           accentColor="#fb9b33"
//           textColor="#fb9b33"
//         />
//       )}

//       {show && Platform.OS === "ios" && (
//         <View className="mt-4 bg-[#1a1a1a] rounded-xl p-4">
//           <View className="flex-row items-center justify-between mb-3">
//             <Text className="text-lg font-semibold text-white">
//               Select Date
//             </Text>
//             <TouchableOpacity
//               onPress={() => setShow(false)}
//               className="bg-[#fb9b33] px-4 py-2 rounded-lg"
//             >
//               <Text className="font-medium text-white">Done</Text>
//             </TouchableOpacity>
//           </View>
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="spinner"
//             onChange={onChange}
//             minimumDate={new Date()}
//             maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
//             accentColor="#fb9b33"
//             textColor="#fb9b33"
//             style={{ backgroundColor: "#1a1a1a" }}
//           />
//         </View>
//       )}
//     </View>
//   );
// }

// import DateTimePicker from "@react-native-community/datetimepicker";
// import moment from "moment";
// import { useState } from "react";

// import {
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function DatePicker() {
//   const [show, setShow] = useState(false);
//   const [date, setDate] = useState(new Date());

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === "ios"); // iOS ke liye picker screen pe rehta hai
//     setDate(currentDate);
//   };

//   const showDatepicker = () => {
//     setShow(true);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.button} onPress={showDatepicker}>
//         <Text style={styles.buttonText}>
//           {moment(date).format("MMMM D, YYYY")}
//         </Text>
//       </TouchableOpacity>

//       {show && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display={Platform.OS === "android" ? "calendar" : "spinner"}
//           onChange={onChange}
//           minimumDate={new Date(2000, 0, 1)}
//           maximumDate={new Date(2100, 11, 31)}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     alignItems: "center",
//   },
//   button: {
//     backgroundColor: "#1E40AF",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });
