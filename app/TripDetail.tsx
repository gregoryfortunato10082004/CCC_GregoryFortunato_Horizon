import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { deleteTrip, getTripById, SavedTrip } from "../_src/_services/storageServices";

type RootStackParamList = {
  TripDetail: { tripId: string };
};

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetail() {
  const route = useRoute<TripDetailRouteProp>();
  const navigation = useNavigation();
  const { tripId } = route.params;

  const [trip, setTrip] = useState<SavedTrip | null>(null);

  useEffect(() => {
    async function fetchTrip() {
      const t = await getTripById(tripId);
      if (!t) {
        Alert.alert("Erro", "Roteiro não encontrado");
        navigation.goBack();
      } else {
        setTrip(t);
      }
    }
    fetchTrip();
  }, [tripId]);

  async function handleDelete() {
    Alert.alert(
      "Deletar Roteiro",
      "Deseja realmente deletar este roteiro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            if (!trip) return;
            try {
              await deleteTrip(trip.id);
              Alert.alert("Deletado", "Roteiro removido com sucesso.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o roteiro.");
            }
          },
        },
      ]
    );
  }

  async function handleCopy() {
    if (!trip) return;
    await Clipboard.setStringAsync(trip.itinerary);
    Alert.alert("✅ Copiado!", "O roteiro foi copiado.");
  }

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando roteiro...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.city}>{trip.city}</Text>
      <Text style={styles.days}>{trip.days.toFixed(0)} dias</Text>

      <View style={styles.actionsBar}>
        <Pressable onPress={handleCopy} style={styles.actionButton}>
          <MaterialIcons name="content-copy" size={24} color="#666" />
          <Text style={styles.actionText}>Copiar</Text>
        </Pressable>

        <Pressable onPress={handleDelete} style={styles.actionButton}>
          <MaterialIcons name="delete" size={24} color="#FF5656" />
          <Text style={[styles.actionText, { color: "#FF5656" }]}>Deletar</Text>
        </Pressable>
      </View>

      <Markdown style={markdownStyles}>{trip.itinerary}</Markdown>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  city: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  days: { fontSize: 16, color: "#666", marginBottom: 16 },
  actionsBar: { flexDirection: "row", gap: 12, marginBottom: 16 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  actionText: { fontSize: 14, color: "#666", fontWeight: "500" },
});

const markdownStyles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 24, color: "#333" },
  strong: { fontWeight: "bold" },
});
