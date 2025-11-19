import { MaterialIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

interface AuthScreenProps {
    onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthentication = async () => {
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            Alert.alert("Sucesso", isLogin ? "Login realizado!" : "Conta criada com êxito!");
            onAuthSuccess();
        } catch (error: any) {
            let message = "Ocorreu um erro desconhecido.";
            if (error.code === 'auth/invalid-email') message = 'O formato do e-mail é inválido.';
            else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') message = 'Credenciais inválidas.';
            else if (error.code === 'auth/email-already-in-use') message = 'Este e-mail já está em uso.';
            else if (error.code === 'auth/weak-password') message = 'A senha deve ter pelo menos 6 caracteres.';
            Alert.alert(isLogin ? "Erro no Login" : "Erro no Registro", message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <MaterialIcons name="person" size={100} color="#FF5656" style={styles.icon} />
            <Text style={styles.title}>{isLogin ? 'Fazer Login' : 'Criar Conta'}</Text>

            <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Senha (mín. 6 caracteres)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAuthentication} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Registrar'}</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} disabled={loading}>
                <Text style={styles.toggleText}>
                    {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Fazer Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f1f1f1' },
    icon: { marginBottom: 30 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', width: '90%', backgroundColor: '#FFF', borderRadius: 8, marginBottom: 15, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd' },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50 },
    button: { backgroundColor: '#FF5656', width: '90%', borderRadius: 8, padding: 15, alignItems: 'center', justifyContent: 'center', marginTop: 10, height: 50 },
    buttonText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
    toggleText: { marginTop: 20, color: '#007AFF', fontSize: 15 },
});

export default AuthScreen;
