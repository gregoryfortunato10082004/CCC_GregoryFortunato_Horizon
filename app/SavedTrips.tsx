import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { deleteTrip, getSavedTrips, SavedTrip } from "../_src/_services/storageServices";

export default function SavedTrips() {
  const [trips, setTrips] = useState<SavedTrip[]>([]); // ✅ tipo definido
  const [loading, setLoading] = useState(false);

  async function fetchTrips() {
    setLoading(true);
    try {
      const savedTrips = await getSavedTrips();
      setTrips(savedTrips);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os roteiros.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  async function handleDelete(id: string) {
    Alert.alert(
      "Deletar Roteiro",
      "Deseja realmente deletar este roteiro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTrip(id);
              setTrips(trips.filter((trip) => trip.id !== id)); // ✅ tipagem correta
              Alert.alert("Deletado", "Roteiro removido com sucesso.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o roteiro.");
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }: { item: SavedTrip }) {
    return (
      <View style={styles.tripCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.city}>{item.city}</Text>
          <Text style={styles.days}>{item.days.toFixed(0)} dias</Text>
          <Text style={styles.itinerary} numberOfLines={3}>
            {item.itinerary}
          </Text>
        </View>

        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={24} color="#FF5656" />
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando roteiros...</Text>
      </View>
    );
  }

  if (!trips.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum roteiro salvo ainda 😔</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#666" },
  tripCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  city: { fontSize: 18, fontWeight: "bold" },
  days: { fontSize: 14, color: "#666", marginBottom: 4 },
  itinerary: { fontSize: 14, color: "#333" },
  deleteButton: { justifyContent: "center", marginLeft: 12 },
});
