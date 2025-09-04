
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function Layout() {
  useEffect(()=>{},[]);
  return (<>
    <Stack screenOptions={{ headerStyle: { backgroundColor: "#fff" }, headerTintColor: "#000" }}>
      <Stack.Screen name="index" options={{ title: "Connexion" }} />
      <Stack.Screen name="dashboard/index" options={{ title: "Files" }} />
    </Stack>
    <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
  </>);
}
