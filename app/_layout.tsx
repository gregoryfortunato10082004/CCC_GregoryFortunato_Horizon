import { Slot } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../_src/AuthContext";
import AuthScreen from "../_src/screens/AuthScreen";

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Se não estiver logado, mostra a tela de login
  if (!user) return <AuthScreenWrapper />;

  // Se estiver logado, carrega normalmente o conteúdo do app
  return <Slot />;
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
