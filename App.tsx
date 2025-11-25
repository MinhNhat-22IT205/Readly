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
