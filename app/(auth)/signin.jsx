import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Formik } from "formik";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../config/firebaseConfig";
import validationSchema from "../../utils/authSchema";

const Signin = () => {
  const goto = useRouter();

  const handleGuestUser = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    goto.push("/home");
  };

  // const handleSignin = async (values) => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       values.email,
  //       values.password
  //     );

  //     const user = userCredential.user;
  //     const userDoc = await getDoc(doc(db, "users", user.uid));

  //     if (userDoc.exists()) {
  //       await AsyncStorage.setItem("userEmail", values.email);
  //       goto.push("/home");
  //     } else {
  //       Alert.alert("Error", "User profile not found in database.");
  //     }
  //   } catch (error) {
  //     if (
  //       error.code === "auth/user-not-found" ||
  //       error.code === "auth/wrong-password"
  //     ) {
  //       Alert.alert("Signin Error", "Incorrect email or password.", [
  //         { text: "OK" },
  //       ]);
  //     } else {
  //       Alert.alert("Signin Error", error.message, [{ text: "OK" }]);
  //     }
  //   }
  // };

  const handleSignin = async (values) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredentials.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User data:", userDoc.data());
        await AsyncStorage.setItem("userEmail", values.email);
        await AsyncStorage.setItem("isGuest", "false");
        goto.push("/home");
      } else {
        console.log("No such Doc");
      }
    } catch (error) {
      console.log(error);

      if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Signin Failed!",
          "Incorrect credentials. Please try again.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Sign in Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }
  };
  return (
    <SafeAreaView className="bg-[#0d1117] flex-1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <View className="items-center justify-center m-2">
          <Image
            source={require("../../assets/images/dinetimelogo.png")}
            style={{ width: 200, height: 100 }}
          />

          <Text className="mb-10 text-lg font-bold text-center text-white">
            Lets get you started
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignin}
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
                  {/* Email */}
                  <Text className="mb-2 text-white">Email</Text>
                  <TextInput
                    placeholder="Enter your email *"
                    placeholderTextColor={"#fff"}
                    className="border border-[#f49b33] rounded-lg h-10 p-2 mb-2 text-white"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {touched.email && errors.email && (
                    <Text className="mb-3 text-xs text-red-500">
                      {errors.email}
                    </Text>
                  )}

                  {/* Password */}
                  <Text className="mb-2 text-white">Password</Text>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor={"#fff"}
                    className="border border-[#f49b33] rounded-lg h-10 p-2 mb-2 text-white"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={true}
                  />
                  {touched.password && errors.password && (
                    <Text className="mb-3 text-xs text-red-500">
                      {errors.password}
                    </Text>
                  )}

                  {/* Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="p-2 my-2 bg-[#f49b33] rounded-lg"
                  >
                    <Text className="text-base font-bold text-center text-black">
                      Sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            {/* Sign up link */}
            <TouchableOpacity
              onPress={() => goto.push("/signup")}
              className="flex-row items-center justify-center gap-2 mt-4"
            >
              <Text className="text-base font-semibold text-white">
                Don’t have an account?
              </Text>
              <Text className="text-[#f49b33] underline text-lg font-bold">
                Sign up
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center justify-center my-4">
              <View className="border-b-2 border-[#f49b33] w-20" />
              <Text className="mx-2 text-white">or</Text>
              <View className="border-b-2 border-[#f49b33] w-20" />
            </View>

            {/* Guest */}
            <TouchableOpacity
              onPress={handleGuestUser}
              className="flex-row items-center justify-center gap-2 mt-2"
            >
              <Text className="text-base font-semibold text-white">Be a</Text>
              <Text className="text-[#f49b33] underline text-lg font-bold">
                Guest User
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Image */}
        <View className="flex items-center justify-center">
          <Image
            source={require("../../assets/images/Frame.png")}
            style={{ width: 350 }}
            resizeMode="contain"
          />
        </View>

        <StatusBar barStyle={"light-content"} backgroundColor={"#0d1117"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
