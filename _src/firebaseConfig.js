import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { Platform } from "react-native"; // Importe o Platform para checar onde está rodando
// Importe também o browserLocalPersistence
import {
  browserLocalPersistence,
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const expoConfig = Constants.expoConfig ?? Constants.manifest ?? {};
const extra = expoConfig.extra ?? {};

const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  storageBucket: extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Lógica de escolha da persistência
let authPersistence;

if (Platform.OS === "web") {
  // Se for Web, usa a persistência padrão do navegador
  authPersistence = browserLocalPersistence;
} else {
  // Se for Celular, usa o AsyncStorage
  authPersistence = getReactNativePersistence(AsyncStorage);
}

export const auth = initializeAuth(app, {
  persistence: authPersistence,
});

export const db = getFirestore(app);