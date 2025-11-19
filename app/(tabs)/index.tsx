import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Constants from "expo-constants";
import { useState } from "react";
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
  View
} from "react-native";
import { useAuth } from "../../_src/AuthContext";

const StatusBarHeight = StatusBar.currentHeight;
const GEMINI_API_KEY = Constants.expoConfig!.extra!.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export default function App() {
  const { user, logout } = useAuth();
  const [city, setCity] = useState("");
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("");

  console.log("USUARIO ATUAL NA TELA PRINCIPAL:", user);

 async function handleGenerate() {
  if (!city) return Alert.alert("Atenção", "Preencha o nome da cidade");
  if (!GEMINI_API_KEY) return Alert.alert("Erro de Configuração", "Chave de API ausente.");

  setLoading(true);
  setTravel("");
  Keyboard.dismiss();

  const prompt = `Crie um roteiro para uma viagem de ${days.toFixed(0)} dias em ${city}. Seja detalhado e criativo.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generate?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Estrutura recomendada atualmente
          prompt: {
            text: prompt
          },
          temperature: 0.2,
          candidateCount: 1,
          maxOutputTokens: 500
        }),
      }
    );

    const data = await response.json();

    if (data.candidates?.length) {
      setTravel(data.candidates[0].content[0].text);
    } else {
      Alert.alert("Erro", "Não foi possível processar a resposta da API.");
      console.error("Resposta inesperada da API:", data);
    }
  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    Alert.alert("Erro de Conexão", "Não foi possível conectar-se à API.");
  } finally {
    setLoading(false);
  }
}
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#F1F1F10" />
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
          style={{ width: "100%", height: 40 }}
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={setDays}
        />
      </View>

      <Pressable style={styles.button} onPress={handleGenerate} disabled={loading}>
        <Text style={styles.buttonText}>Gerar Roteiro</Text>
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }} style={styles.containerScroll}>
        {loading && <ActivityIndicator size="large" color="#000" />}
        {travel.length > 0 && <Text style={styles.travelText}>{travel}</Text>}
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
  buttonText: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
  containerScroll: { width: "90%", marginTop: 8 },
  travelText: { fontSize: 16, lineHeight: 22 }
});
