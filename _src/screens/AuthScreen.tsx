import { MaterialIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform, // ✅ Importante: Adicionei Platform
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { createUserProfile } from '../_services/storageServices';
import { auth } from '../firebaseConfig';

interface AuthScreenProps {
    onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // ✅ Função auxiliar para mostrar Alertas na Web e no Celular
    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}\n\n${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleAuthentication = async () => {
        setLoading(true);
        try {
            if (isLogin) {
                // --- LOGIN ---
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // --- REGISTRO ---
                if (!name.trim()) {
                    showAlert("Erro", "Por favor, digite seu nome.");
                    setLoading(false);
                    return;
                }

                if (!email.trim() || !password.trim()) {
                    showAlert("Erro", "Preencha email e senha.");
                    setLoading(false);
                    return;
                }

                // 1. Cria a conta no Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // 2. Atualiza o nome no Auth
                await updateProfile(user, { displayName: name });

                // 3. Cria o perfil no Firestore
                await createUserProfile(user, name);
            }
            
            // Sucesso!
            onAuthSuccess();
        } catch (error: any) {
            let message = "Ocorreu um erro desconhecido.";
            if (error.code === 'auth/invalid-email') message = 'O formato do e-mail é inválido.';
            else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') message = 'Email ou senha incorretos.';
            else if (error.code === 'auth/email-already-in-use') message = 'Este e-mail já está em uso.';
            else if (error.code === 'auth/weak-password') message = 'A senha deve ter pelo menos 6 caracteres.';
            else if (error.code === 'auth/missing-password') message = 'Digite uma senha.';
            
            showAlert(isLogin ? "Erro no Login" : "Erro no Registro", message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <MaterialIcons name="person" size={100} color="#FF5656" style={styles.icon} />
            <Text style={styles.title}>{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</Text>

            {/* Campo de Nome (Apenas no Registro) */}
            {!isLogin && (
                <View style={styles.inputContainer}>
                    <MaterialIcons name="face" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Seu Nome"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                </View>
            )}

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
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', width: '90%', backgroundColor: '#FFF', borderRadius: 8, marginBottom: 15, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd', height: 50 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: '100%' },
    button: { backgroundColor: '#FF5656', width: '90%', borderRadius: 8, padding: 15, alignItems: 'center', justifyContent: 'center', marginTop: 10, height: 50 },
    buttonText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
    toggleText: { marginTop: 20, color: '#007AFF', fontSize: 15 },
});

export default AuthScreen;