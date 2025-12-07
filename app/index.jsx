import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const goto = useRouter();

  const handleGuestUser = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    goto.push("/home");
  };
  return (
    <SafeAreaView className={`bg-[#0d1117] flex-1`}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <View className="m-2 justify-center items-center bg-[#0d1117]">
          <Image
            source={require("../assets/images/dinetimelogo.png")}
            style={{ width: 300, height: 300 }}
          />
          <View className="w-3/4 ">
            <TouchableOpacity
              onPress={() => goto.push("/signup")}
              className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
            >
              <Text className="text-base font-bold text-center">Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGuestUser}
              className="p-2 my-2 bg-transparent border border-[#f49b33] rounded-lg"
            >
              <Text className="text-base font-bold text-center text-[#f49b33]">
                Guest User
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-base font-semibold text-center text-white">
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> or{" "}
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
            </Text>
            <TouchableOpacity
              onPress={() => goto.push("signin")}
              className="flex-row items-center justify-center gap-2 my-2"
            >
              <Text className="text-base font-semibold text-white">
                Already have account?
              </Text>
              <Text className="text-[#f49b33] underline text-lg font-bold">
                Sign in
              </Text>
              <Text></Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex items-center justify-center">
          <Image
            source={require("../assets/images/Frame.png")}
            style={{ width: 350 }}
            resizeMode="contain"
          />
        </View>
        <StatusBar barStyle={"light-content"} backgroundColor={"#0d1117"} />
      </ScrollView>
    </SafeAreaView>
  );
}
