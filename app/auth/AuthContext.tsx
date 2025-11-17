// app/auth/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Importe 'User'
import { auth } from '../firebaseConfig'; // ⬅️ Caminho corrigido dentro de /app!

// Definição de Tipos para o Contexto
interface AuthContextType {
    user: User | null | undefined; // Firebase User, null (deslogado), ou undefined (carregando)
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: undefined, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta o status de autenticação do Firebase.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Recebe o objeto User ou null
      setLoading(false);
    });

    return unsubscribe; // Limpa o listener ao desmontar
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}