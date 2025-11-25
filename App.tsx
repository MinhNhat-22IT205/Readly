import "./global.css";
import { Text, View } from "react-native";
import AppNavigator from "./src/app/navigation/AppNavigator";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
}

// import "./global.css"
// import { Text, View } from "react-native";

// export default function App() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-xl font-bold text-blue-500">
//         Welcome to Nativewind!
//       </Text>
//     </View>
//   );
// }
