import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { useAuth } from "../../_src/AuthContext";
import { saveTrip } from "../../_src/_services/storageServices"; // ✅ import corrigido

const StatusBarHeight = StatusBar.currentHeight;
const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const LOADING_MESSAGES = [
  "🌍 Criando seu horizonte...",
  "✈️ Planejando sua viagem...",
  "🗺️ Montando a melhor aventura...",
  "🎒 Preparando seu roteiro...",
  "🌟 Explorando destinos incríveis...",
];

export default function App() {
  const { user, logout } = useAuth();
  const [city, setCity] = useState("");
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("");  
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingMessage((prev) => {
        const currentIndex = LOADING_MESSAGES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
        return LOADING_MESSAGES[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  async function handleGenerate() {
    if (!city) return Alert.alert("Atenção", "Preencha o nome da cidade");
    if (!GEMINI_API_KEY)
      return Alert.alert("Erro de Configuração", "Chave de API ausente.");

    setLoading(true);
    setTravel("");
    setLoadingMessage(LOADING_MESSAGES[0]);
    Keyboard.dismiss();

    const prompt = `Crie um roteiro para uma viagem de ${days.toFixed(
      0
    )} dias em ${city}. Seja detalhado e criativo.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
        }),
      });

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Não foi possível gerar o roteiro.";

      setTravel(text.replace(/##+/g, ""));
    } catch (error) {
      Alert.alert("Erro", "Falha ao gerar o roteiro.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!travel.trim()) {
      Alert.alert("⚠️ Atenção", "Não há roteiro para copiar ainda.");
      return;
    }
    await Clipboard.setStringAsync(travel);
    Alert.alert("✅ Copiado!", "O roteiro foi copiado.");
  }

  async function handleSave() {
    if (!travel.trim()) {
      Alert.alert("⚠️ Atenção", "Não há roteiro para salvar ainda.");
      return;
    }

    if (!user) {
      Alert.alert("⚠️ Atenção", "Você precisa estar logado para salvar.");
      return;
    }

    try {
      console.log("Salvando roteiro para o usuário:", user.uid);
      console.log("Dados:", { city, days, travel });

      await saveTrip(city, days, travel);
      Alert.alert("💾 Salvo!", "Roteiro salvo nos favoritos!");
    } catch (error) {
      console.error("Erro ao salvar roteiro:", error);
      Alert.alert("Erro", "Não foi possível salvar o roteiro na Firebase.");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent />
      <Text style={styles.heading}>Horizon</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Cidade Destino</Text>
        <TextInput
          placeholder="Ex: Passo Fundo, RS"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>
          Tempo de estadia: <Text style={styles.days}>{days.toFixed(0)}</Text> dias
        </Text>

        <Slider
          minimumValue={1}
          maximumValue={7}
          value={days}
          onValueChange={setDays}
          style={{ width: "100%", height: 40 }}
        />
      </View>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Gerando..." : "Gerar Roteiro"}</Text>
        <MaterialIcons name="travel-explore" size={24} />
      </Pressable>

      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
          </View>
        ) : !travel.trim() ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyText}>Gere um roteiro e ele aparecerá aqui 👇</Text>
            <Text style={styles.emptySubtext}>Escolha a cidade e descubra seu destino!</Text>
          </View>
        ) : (
          <View style={styles.outputBox}>
            <View style={styles.actionsBar}>
              <Pressable onPress={handleSave} style={styles.actionButton}>
                <MaterialIcons name="bookmark" size={20} color="#FF5656" />
                <Text style={styles.actionText}>Salvar</Text>
              </Pressable>

              <Pressable onPress={handleCopy} style={styles.actionButton}>
                <MaterialIcons name="content-copy" size={20} color="#666" />
                <Text style={styles.actionText}>Copiar</Text>
              </Pressable>
            </View>
            <Markdown>{travel}</Markdown>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1", alignItems: "center", paddingTop: 20 },
  heading: { fontSize: 32, fontWeight: "bold", paddingTop: Platform.OS === "android" ? StatusBarHeight : 54 },
  form: { backgroundColor: "#fff", width: "90%", borderRadius: 8, padding: 16, marginTop: 16, marginBottom: 8 },
  label: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 4, borderColor: "#94a3b8", padding: 8, fontSize: 16, marginBottom: 16 },
  days: { backgroundColor: "#f1f1f1" },
  button: { backgroundColor: "#FF5656", width: "90%", borderRadius: 8, flexDirection: "row", padding: 14, justifyContent: "center", alignItems: "center", gap: 8 },
  buttonDisabled: { backgroundColor: "#FFB3B3" },
  buttonText: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
  containerScroll: { width: "90%", marginTop: 8 },
  loadingContainer: { alignItems: "center", marginTop: 40, padding: 20 },
  loadingText: { fontSize: 16, marginTop: 16, color: "#666" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyEmoji: { fontSize: 64 },
  emptyText: { fontSize: 18, color: "#666", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#999" },
  outputBox: { backgroundColor: "#fff", padding: 16, borderRadius: 8 },
  actionsBar: { flexDirection: "row", justifyContent: "flex-end", gap: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 6, padding: 8, backgroundColor: "#F8F8F8", borderRadius: 6 },
  actionText: { fontSize: 14, color: "#666", fontWeight: "500" },
});
