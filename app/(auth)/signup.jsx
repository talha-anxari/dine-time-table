import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
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
import validationSchema from "../../utils/authSchema";

const Signup = () => {
  const goto = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const handleGuestUser = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    goto.push("/home");
  };

  const handleSignup = async (values) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        username: values.username,
        email: values.email,
        createdAt: new Date(),
      });

      await AsyncStorage.setItem("userEmail", values.email);
      await AsyncStorage.setItem("isGuest", "false");
      goto.push("/home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Signup Error",
          "The email address is already in use by another account.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Signup Error", error.message, [{ text: "OK" }]);
      }
    }
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
            source={require("../../assets/images/dinetimelogo.png")}
            style={{ width: 200, height: 100 }}
          />
          <Text className="mb-10 text-lg font-bold text-center text-white">
            Lets get you started
          </Text>
          <View className="w-5/6">
            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignup}
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
                  <Text className="mb-2 text-white">Username</Text>
                  <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor={"#fff"}
                    className="border border-[#f49b33] rounded-lg p-2 mb-4 h-10 text-white"
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    value={values.username}
                  />
                  {touched.username && errors.username && (
                    <Text className="mb-2 text-xs text-red-500">
                      {errors.username}
                    </Text>
                  )}
                  <Text className="mb-2 text-white">Email</Text>
                  <TextInput
                    placeholder="Enter your email *"
                    placeholderTextColor={"#fff"}
                    className="border border-[#f49b33] rounded-lg h-10 p-2 mb-4 text-white"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {touched.email && errors.email && (
                    <Text className="mb-2 text-xs text-red-500">
                      {errors.email}
                    </Text>
                  )}
                  <Text className="mb-2 text-white">Password</Text>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor={"#fff"}
                    className="border border-[#f49b33] rounded-lg h-10 p-2 mb-4 text-white"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={true}
                  />
                  {touched.password && errors.password && (
                    <Text className="mb-2 text-xs text-red-500">
                      {errors.password}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
                  >
                    <Text className="text-base font-bold text-center">
                      Sign up
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <View>
              <TouchableOpacity
                onPress={() => goto.push("/signin")}
                className="flex-row items-center justify-center gap-2 mt-4"
              >
                <Text className="text-base font-semibold text-white">
                  Already have account?
                </Text>
                <Text className="text-[#f49b33] underline text-lg font-bold">
                  Sign in
                </Text>
              </TouchableOpacity>
              <Text className="text-base font-semibold text-center text-white">
                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />{" "}
                or{" "}
                <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
              </Text>
              <TouchableOpacity
                onPress={handleGuestUser}
                className="flex-row items-center justify-center gap-2 mt-4"
              >
                <Text className="text-base font-semibold text-white">Be a</Text>
                <Text className="text-[#f49b33] underline text-lg font-bold">
                  Guest User
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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

export default Signup;
