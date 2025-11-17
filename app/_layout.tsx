// app/(tabs)/_layout.tsx
import { Tabs, Redirect, router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import AuthScreen from './AuthScreen'; // ⬅️ IMPORTAÇÃO AJUSTADA!
import { AuthProvider, useAuth } from './auth/AuthContext'; // ⬅️ Assumindo AuthContext em /app/auth

// Componente Wrapper para a Lógica de Autenticação
function AuthWrapper() {
  const { user, loading } = useAuth();
  
  if (loading) {
    // 1. Estado de Carregamento: Mostra um loader enquanto o Firebase verifica o usuário
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. Função de Sucesso de Autenticação (Redirecionamento)
  const handleAuthSuccess = () => {
    // Substitui a tela de login pela tela principal de roteiros
   router.replace('/'); 
  }

  if (!user) {
    // 3. Usuário Deslogado: Mostra a tela de Login/Registro
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }
  
  // 4. Usuário Logado: Renderiza as Abas
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Roteiros', headerShown: false }} />
      <Tabs.Screen name="explore" options={{ title: 'Explorar', headerShown: false }} />
      {/* ⬇️ Adicione aqui sua tela de perfil/logout que criaremos em breve */}
      {/* <Tabs.Screen name="profile" options={{ title: 'Perfil' }} /> */}
    </Tabs>
  );
}

// Layout Principal que envolve o app com o Provedor de Autenticação
export default function Layout() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}