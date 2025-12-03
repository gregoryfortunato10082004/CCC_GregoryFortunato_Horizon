import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { sendPasswordResetEmail, updateProfile } from "firebase/auth"; // ✅ Importamos o reset de senha
import { doc, updateDoc } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { getUserProfile } from "../../_src/_services/storageServices";
import { useAuth } from "../../_src/AuthContext";
import { auth, db } from "../../_src/firebaseConfig";


export default function Profile() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [modalPersonalVisible, setModalPersonalVisible] = useState(false);
  const [modalAboutVisible, setModalAboutVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);

  // Estados para Edição (Apenas Nome)
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchProfile() {
        if (user?.uid) {
          const data = await getUserProfile(user.uid);
          setUserData(data);
          setNewName(data?.displayName || user.displayName || "");
        }
        setLoading(false);
      }
      fetchProfile();
    }, [user])
  );

  // --- 1. ALTERAR NOME (Simples e Seguro) ---
  const handleSaveChanges = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (newName !== userData?.displayName) {
        await updateProfile(user, { displayName: newName });
        await updateDoc(doc(db, "users", user.uid), { displayName: newName });
        
        // Atualiza visualmente
        setUserData({ ...userData, displayName: newName });
        
        const msg = "Nome atualizado com sucesso!";
        Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Sucesso", msg);
        setModalEditVisible(false);
      } else {
        setModalEditVisible(false);
      }
    } catch (error: any) {
      console.error(error);
      const msg = "Não foi possível atualizar o nome.";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  };

  // --- 2. REDEFINIR SENHA (Usa o modelo do Firebase) ---
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      const msg = `Enviamos um e-mail para ${user.email} com o link para redefinir sua senha.`;
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("E-mail Enviado", msg);
    } catch (error) {
      console.error(error);
      const msg = "Erro ao enviar e-mail de redefinição.";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Erro", msg);
    }
  };

  const handleLogout = async () => {
    const executeLogout = async () => {
        try { await logout(); } catch (e) {}
    };
    if (Platform.OS === 'web') {
        if (window.confirm("Tem certeza que deseja sair?")) await executeLogout();
        return;
    }
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: executeLogout, style: "destructive" }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5656" />
      </View>
    );
  }

  const avatarLetter = userData?.displayName ? userData.displayName.charAt(0).toUpperCase() : "U";
  const displayName = userData?.displayName || "Usuário Horizon";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minha Conta</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setModalPersonalVisible(true)}>
          <View style={styles.iconBox}>
            <MaterialIcons name="person-outline" size={24} color="#555" />
          </View>
          <Text style={styles.menuText}>Ver Dados Pessoais</Text>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setModalEditVisible(true)}>
          <View style={styles.iconBox}>
            <MaterialIcons name="settings" size={24} color="#555" />
          </View>
          <Text style={styles.menuText}>Configurações da Conta</Text>
          <MaterialIcons name="edit" size={20} color="#FF5656" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicativo</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => setModalAboutVisible(true)}>
          <View style={styles.iconBox}>
             <MaterialIcons name="info-outline" size={24} color="#555" />
          </View>
          <Text style={styles.menuText}>Sobre o Horizon</Text>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FF5656" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.version}>Versão 1.0.0 (MVP)</Text>
      <View style={{height: 20}} /> 

      {/* MODAL 1: DADOS */}
      <Modal animationType="slide" transparent={true} visible={modalPersonalVisible} onRequestClose={() => setModalPersonalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meus Dados</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nome:</Text><Text style={styles.infoValue}>{displayName}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>E-mail:</Text><Text style={styles.infoValue}>{user?.email}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>ID (UID):</Text><Text style={styles.infoValueUID}>{user?.uid}</Text></View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalPersonalVisible(false)}><Text style={styles.closeButtonText}>Fechar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: SOBRE */}
      <Modal animationType="slide" transparent={true} visible={modalAboutVisible} onRequestClose={() => setModalAboutVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{alignItems: 'center', marginBottom: 15}}><MaterialIcons name="travel-explore" size={50} color="#FF5656" /></View>
            <Text style={styles.modalTitle}>Horizon</Text>
            <Text style={styles.sectionHeader}>Nossa História</Text>
            <Text style={styles.aboutText}>O Horizon nasceu com uma missão simples: acabar com as planilhas complexas de viagem. Criado por Grégory Fortunato, o app transforma seus sonhos de destino em planos práticos.</Text>
            <Text style={styles.sectionHeader}>Principais Funcionalidades</Text>
            <Text style={styles.aboutText}>✨ Geração de Roteiros com IA</Text>
            <Text style={styles.aboutText}>📅 Organização Dia a Dia</Text>
            <Text style={styles.aboutText}>☁️ Sincronização em Nuvem</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalAboutVisible(false)}><Text style={styles.closeButtonText}>Que legal!</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ MODAL 3: EDITAR PERFIL (Versão Segura) */}
      <Modal animationType="slide" transparent={true} visible={modalEditVisible} onRequestClose={() => setModalEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            
            {/* Campo Nome (Editável) */}
            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="Seu nome" />

            {/* Campo E-mail (Travado) */}
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={[styles.input, { backgroundColor: '#e0e0e0' }]}>
                <Text style={{color: '#666'}}>{user?.email}</Text>
            </View>
            <Text style={styles.helperText}>Para alterar o e-mail, entre em contato com o suporte.</Text>

            {/* Botão de Trocar Senha */}
            <Text style={styles.inputLabel}>Segurança</Text>
            <TouchableOpacity style={styles.resetPassBtn} onPress={handlePasswordReset}>
                <MaterialIcons name="lock-reset" size={20} color="#FF5656" />
                <Text style={styles.resetPassText}>Redefinir Senha via E-mail</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => setModalEditVisible(false)}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleSaveChanges} disabled={saving}>
                    {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Salvar Nome</Text>}
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#FF5656", alignItems: "center", paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20, shadowColor: "#FF5656", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", marginBottom: 12, borderWidth: 4, borderColor: "rgba(255,255,255,0.3)" },
  avatarText: { fontSize: 40, color: "#FF5656", fontWeight: "bold" },
  name: { fontSize: 22, color: "#FFF", fontWeight: "bold", marginBottom: 4 },
  email: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 12 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#999", marginBottom: 10, textTransform: "uppercase" },
  menuItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 16, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  iconBox: { width: 40, alignItems: "center" },
  menuText: { flex: 1, fontSize: 16, color: "#333", fontWeight: "500" },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0F0", padding: 16, borderRadius: 16, marginTop: 10, borderWidth: 1, borderColor: "#FFCDCD" },
  logoutText: { color: "#FF5656", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  version: { textAlign: "center", color: "#ccc", marginBottom: 40, fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  infoRow: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 },
  infoLabel: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  infoValue: { fontSize: 16, color: '#333', marginTop: 2 },
  infoValueUID: { fontSize: 12, color: '#555', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: 2, backgroundColor: '#f1f1f1', padding: 4, borderRadius: 4 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#FF5656' },
  aboutText: { fontSize: 15, color: '#444', marginBottom: 8, textAlign: 'left', lineHeight: 22 },
  closeButton: { backgroundColor: '#FF5656', borderRadius: 12, padding: 12, marginTop: 20, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  // Inputs e Botões de Edição
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f9f9f9' },
  helperText: { fontSize: 12, color: '#999', marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
  actionBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#eee' },
  saveBtn: { backgroundColor: '#FF5656' },
  cancelText: { color: '#333', fontWeight: 'bold' },
  saveText: { color: '#FFF', fontWeight: 'bold' },
  
  // Botão Reset Senha
  resetPassBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderColor: '#FF5656', borderRadius: 8, backgroundColor: '#FFF5F5' },
  resetPassText: { color: '#FF5656', fontWeight: 'bold' }
});