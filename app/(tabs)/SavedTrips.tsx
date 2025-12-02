import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router"; // ✅ Adicionado useFocusEffect
import { useCallback, useState } from "react"; // ✅ Adicionado useCallback e removido useEffect
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { deleteTrip, getSavedTrips, SavedTrip } from "../../_src/_services/storageServices";

export default function SavedTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchTrips() {
    // Dica: Se quiser que a troca de aba seja instantânea (sem piscar carregando), 
    // comente a linha 'setLoading(true)' abaixo.
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

  // ✅ MUDANÇA AQUI: useFocusEffect garante que a lista atualize ao entrar na aba
  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

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
              // Atualiza a lista localmente para não precisar buscar tudo de novo
              setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
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
      <Pressable 
        style={styles.tripCard}
        onPress={() => router.push({ pathname: "/TripDetail", params: { tripId: item.id } })}
      >
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
      </Pressable>
    );
  }

  if (loading && trips.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5656" />
        <Text>Carregando roteiros...</Text>
      </View>
    );
  }

  if (!loading && !trips.length) {
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
      refreshing={loading}
      onRefresh={fetchTrips} 
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