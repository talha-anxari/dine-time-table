import { Text, TouchableOpacity, View } from "react-native";

export default function GuestPicker({ selectedNumber, setSelectedNumber }) {
  const decrement = () => {
    selectedNumber > 1 && setSelectedNumber(selectedNumber - 1);
  };
  const increment = () => {
    selectedNumber < 12 && setSelectedNumber(selectedNumber + 1);
  };
  return (
    <View className="flex flex-row rounded-lg items-center text-white text-base">
      <TouchableOpacity onPress={decrement} className="rounded">
        <Text className="text-white text-lg border border-[#fb9b33] rounded-l-lg px-3">
          -
        </Text>
      </TouchableOpacity>
      <Text className="text-white text-lg bg-[#474747] border border-[#474747] px-3">
        {selectedNumber}
      </Text>
      <TouchableOpacity onPress={increment} className="rounded-lg">
        <Text className="text-white text-lg  border border-[#fb9b33] rounded-r-lg px-3">
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
