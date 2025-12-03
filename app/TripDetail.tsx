import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { deleteTrip, getTripById, SavedTrip } from "../_src/_services/storageServices";

export default function TripDetail() {
  const router = useRouter(); 
  const params = useLocalSearchParams();
  const tripId = Array.isArray(params.tripId) ? params.tripId[0] : params.tripId;
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchTrip() {
      if (!tripId) {
        setLoading(false);
        return;
      }
      try {
        const t = await getTripById(tripId);
        if (!t) {
          const msg = "Roteiro não encontrado";
          Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Erro", msg);
          router.navigate('/(tabs)/SavedTrips'); 
        } else {
          setTrip(t);
        }
      } catch (error) {
         const msg = "Falha ao buscar detalhes do roteiro.";
         Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Erro", msg);
         router.navigate('/(tabs)/SavedTrips'); 
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId]);

  async function executeDelete() {
    if (!tripId) return;
    try {
      await deleteTrip(tripId);
      const msg = "Roteiro removido com sucesso.";
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert("Deletado", msg);
      }
      router.navigate('/(tabs)/SavedTrips'); 
    } catch (error) {
      const msg = "Não foi possível deletar o roteiro.";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Erro", msg);
    }
  }

  async function handleDelete() {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Deseja realmente deletar este roteiro permanentemente?");
      if (confirm) {
        await executeDelete();
      }
      return;
    }
    Alert.alert(
      "Deletar Roteiro",
      "Deseja realmente deletar este roteiro permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: executeDelete,
        },
      ]
    );
  }

  async function handleCopy() {
    if (!trip) return;
    await Clipboard.setStringAsync(trip.itinerary);
    const msg = "O roteiro foi copiado para a área de transferência.";
    Platform.OS === 'web' ? window.alert(`✅ Copiado!\n${msg}`) : Alert.alert("✅ Copiado!", msg);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5656" />
        <Text style={{marginTop: 10}}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Roteiro não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.navigate('/(tabs)/SavedTrips')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.cityTitle}>{trip.city}</Text>
        <View style={styles.daysTag}>
            <MaterialIcons name="calendar-today" size={14} color="#666" />
            <Text style={styles.daysText}>{trip.days.toFixed(0)} dias de viagem</Text>
        </View>

        <View style={styles.actionsBar}>
          <Pressable onPress={handleCopy} style={styles.actionButton}>
            <MaterialIcons name="content-copy" size={20} color="#666" />
            <Text style={styles.actionText}>Copiar Texto</Text>
          </Pressable>
          <Pressable onPress={handleDelete} style={[styles.actionButton, styles.deleteActionButton]}>
            <MaterialIcons name="delete-outline" size={20} color="#FF5656" />
            <Text style={[styles.actionText, { color: "#FF5656" }]}>Deletar</Text>
          </Pressable>
        </View>
        <View style={styles.markdownWrapper}>
            <Markdown style={markdownStyles}>{trip.itinerary}</Markdown>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f8f9fa" },
  headerBar: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  backButtonText: { fontSize: 16, marginLeft: 4, color: "#333" },
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  cityTitle: { fontSize: 32, fontWeight: "800", color: "#2c3e50", marginBottom: 4 },
  daysTag: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 6 },
  daysText: { fontSize: 14, color: "#666", fontWeight: "500" },
  actionsBar: { flexDirection: "row", gap: 12, marginBottom: 24 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteActionButton: { borderColor: "#ffcfcf", backgroundColor: "#fff5f5" },
  actionText: { fontSize: 16, color: "#555", fontWeight: "600" },
  markdownWrapper: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
  }
});

const markdownStyles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 26, color: "#444" },
  heading1: { fontSize: 26, fontWeight: "bold", color: "#FF5656", marginTop: 24, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  heading2: { fontSize: 22, fontWeight: "bold", color: "#333", marginTop: 20, marginBottom: 10 },
  heading3: { fontSize: 18, fontWeight: "bold", color: "#555", marginTop: 16, marginBottom: 8 },
  paragraph: { marginBottom: 16 },
  list_item: { marginBottom: 8 },
  bullet_list: { marginBottom: 16 },
  ordered_list: { marginBottom: 16 },
  strong: { fontWeight: "bold", color: "#222" },
  emphasis: { fontStyle: "italic", color: "#666" },
});