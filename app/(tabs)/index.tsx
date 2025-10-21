import { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";

const StatusBarHeight = StatusBar.currentHeight

export default function App(){
    
    const [city, setCity] = useState("");
    const [days, setDays] = useState(1);
    const [loading, setLoading] = useState(false);
    const [travel, setTravel] = useState("")

    function handleGenerate() {
        console.log(city)
        console.log(days.toFixed(0));
    }

    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F10"/>
            <Text style={styles.heading}>Horizon</Text>
            <View style={styles.form}>
                <Text style={styles.label}>CidadeDestino</Text>
                <TextInput
                    placeholder="Ex: Passo Fundo, RS"
                    style={styles.input}
                    value={city}
                    onChangeText={ (text) => setCity(text)}
                />
                <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}> {days.toFixed(0)} </Text> dias</Text>
                <Slider
                    style={{ width: 200, height: 40}}
                    minimumValue={1}
                    maximumValue={7}
                    minimumTrackTintColor="#009688"
                    maximumTrackTintColor="#0000000"
                    value={days}
                    onValueChange={(value) => setDays(value)}
                />
            </View>
            <Pressable style={styles.button} onPress={handleGenerate}>
                <Text style={styles.buttonText}>Gerar Roteiro</Text>
                <MaterialIcons Name="travel-explore" size={24} color="#F1F1"></MaterialIcons>
            </Pressable>
            <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4,}} style={styles.containerScroll} showsHorizontalScrollIndicator={false}>
                {loading && (
                <View style={styles.content}>
                    <Text style={styles.tittle}> Seu Roteiro:  </Text>
                    <ActivityIndicator color="#000" size="large" />
                </View>
                )}

                {travel && (
                <View style={styles.content}>
                    <Text style={styles.tittle}> Seu Roteiro:  </Text>
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
