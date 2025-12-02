import { MaterialIcons } from '@expo/vector-icons'; // Importando ícones
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
        tabBarActiveTintColor: '#FF5656', // Cor destaque
        tabBarInactiveTintColor: '#999',  // Cor inativa
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Novo Roteiro',
          tabBarIcon: ({ color }) => <MaterialIcons name="add-circle-outline" size={28} color={color} />,
        }}
      />
      
      {/* Esta é a nova aba que conecta com o arquivo 'saved.tsx' que você moveu */}
      <Tabs.Screen
        name="SavedTrips"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={28} color={color} />,
        }}
      />

    
    </Tabs>
  );
}