import { Tabs } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../_src/AuthContext';

export default function TabLayout() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Logout', 'Você saiu com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deslogar.');
      console.error(error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Text style={{ fontWeight: 'bold', color: '#FF5656' }}>Logout</Text>
          </TouchableOpacity>
        ),
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}
