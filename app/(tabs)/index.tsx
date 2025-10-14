import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";

const StatusBarHeight = StatusBar.currentHeight

export default function App(){
    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F10"/>
            <Text style={styles.heading}>Horizon</Text>
            <View style={styles.form}>
                <Text style={styles.label}>CidadeDestino</Text>
                <TextInput
                    placeholder="Ex: Passo Fundo, RS"
                    style={styles.input}
                />
                <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}> 10 </Text> dias</Text>
                <Slider
                    style={{ width: 200, height: 40}}
                    minimumValue={1}
                    maximumValue={7}
                    minimumTrackTintColor="#009688"
                    maximumTrackTintColor="#0000000"
                />
            </View>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Gerar Roteiro</Text>
                <MaterialIcons Name="travel-explore" size={24} color="#FFF"></MaterialIcons>
            </Pressable>
            <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4,}} style={styles.containerScroll} showsHorizontalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.tittle}> Seu Roteiro:  </Text>
                    <Text> Roteiro completo</Text>
                </View>
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
