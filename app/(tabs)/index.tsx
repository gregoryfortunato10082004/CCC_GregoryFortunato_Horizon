import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import Constants from 'expo-constants'; // ⬅️ IMPORTAÇÃO FINAL

const StatusBarHeight = StatusBar.currentHeight

// 1. ACESSO FINAL À CHAVE INJETADA PELO app.json
// Usamos a asserção '!' para garantir que o TypeScript não reclame.
const GEMINI_API_KEY = Constants.expoConfig!.extra!.GEMINI_API_KEY; 

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export default function App(){
    
    const [city, setCity] = useState("");
    const [days, setDays] = useState(1);
    const [loading, setLoading] = useState(false);
    const [travel, setTravel] = useState("")

    async function handleGenerate() {
        if(city === "") {
            Alert.alert("Atenção" , "Preencha o nome da cidade")
            return;
        }

        if(!GEMINI_API_KEY){
            Alert.alert("Erro de Configuração", "Chave de API ausente. Verifique o app.json.");
            return;
        }

        setLoading(true);
        setTravel(""); 
        Keyboard.dismiss();

        const prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`

        try {
            // Requisição com FETCH para a API REST do Gemini (usando a chave fixa)
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    // 1. Array de Conteúdo (Mensagens)
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }]
                        }
                    ],
                    // 2. CORREÇÃO: Usando 'generationConfig' no lugar de 'config'
                    generationConfig: {
                         temperature: 0.20,
                         maxOutputTokens: 500,
                    }
                })
            });

            const data = await response.json();
            
            // Tratamento da resposta do Gemini
            if (data.candidates && data.candidates.length > 0) {
                const generatedText = data.candidates[0].content.parts[0].text;
                console.log(generatedText);
                setTravel(generatedText);
            } else if (data.error) {
                // Captura erros da API, como chave inválida ou limite excedido
                console.log("Erro da API Gemini:", data.error.message);
                Alert.alert("Erro da API", data.error.message);
            } else {
                console.log("Resposta inesperada:", data);
                Alert.alert("Erro", "Não foi possível processar a resposta da API.");
            }
            
        } catch (error) {
            
            console.log("Erro de requisição:", error);
            Alert.alert("Erro de Conexão", "Não foi possível conectar-se à API.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F10"/>
            <Text style={styles.heading}>Horizon</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Cidade Destino</Text>
                <TextInput
                    placeholder="Ex: Passo Fundo, RS"
                    style={styles.input}
                    value={city}
                    onChangeText={ (text) => setCity(text)}
                />
                <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}> {days.toFixed(0)} </Text> dias</Text>
                <Slider
                    style={{ width: '100%', height: 40}}
                    minimumValue={1}
                    maximumValue={7}
                    minimumTrackTintColor="#009688"
                    maximumTrackTintColor="#0000000"
                    value={days}
                    onValueChange={(value) => setDays(value)}
                />
            </View>
            <Pressable style={styles.button} onPress={handleGenerate} disabled={loading}>
                
                <Text style={styles.buttonText}>Gerar Roteiro</Text>
                <MaterialIcons name="travel-explore" size={24} color="#FFF"></MaterialIcons> 
            </Pressable>
            <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4,}} style={styles.containerScroll} showsHorizontalScrollIndicator={false}>
                {loading && (
                <View style={styles.content}>
                    <Text style={styles.tittle}> Seu Roteiro: </Text>
                    <ActivityIndicator color="#000" size="large" />
                </View>
                )}

                {travel.length > 0 && (
                <View style={styles.content}>
                    <Text style={styles.tittle}> Seu Roteiro: </Text>
                    <Text>{travel}</Text>
                </View>
                )}
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        paddingTop: 20,
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        paddingTop: Platform.OS === 'android' ? StatusBarHeight : 54
    },
    form: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#94a3b8',
        padding: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    days: {
        backgroundColor: '#f1f1f1',
    },
    button: {
        backgroundColor: '#FF5656',
        width: '90%',
        borderRadius: 8,
        flexDirection: 'row',
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    content: {
        backgroundColor: '#FFF',
        padding: 16,
        width: '100%',
        borderRadius: 8,
    },
    tittle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 14,
    },
    containerScroll: {
        width: '90%',
        marginTop: 8,
    }
});