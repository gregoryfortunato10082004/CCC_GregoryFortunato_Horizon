import Slider from '@react-native-community/slider';
import { Platform, StatusBar, StyleSheet, Text, TextInput, View, } from "react-native";

const StatusBarHeight = StatusBar.currentHeight

export default function App(){
    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F10"/>        
            <Text style={styles.heading}>Roteirize</Text>
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
    }
});