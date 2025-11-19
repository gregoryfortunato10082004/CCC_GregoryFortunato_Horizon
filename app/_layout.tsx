import React from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../_src/AuthContext";
import AuthScreen from "../_src/screens/AuthScreen";
import TabLayout from "./(tabs)/_layout";

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) return <AuthScreenWrapper />;

  return <TabLayout />;
}

function AuthScreenWrapper() {
  return <AuthScreen onAuthSuccess={() => console.log("Login realizado")} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
