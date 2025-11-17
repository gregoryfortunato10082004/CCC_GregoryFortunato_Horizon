import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants from 'expo-constants'; 

// ⬇️ CORREÇÃO: Garante que expoConfig seja acessado de forma segura e desempacotada.
// Isso resolve o erro "Cannot read property 'expoConfig' of undefined"
const expoConstants = Constants.expoConfig ?? Constants.default.expoConfig; 
const extra = expoConstants?.extra ?? {}; 

const firebaseConfig = {
    apiKey: extra.FIREBASE_API_KEY,
    authDomain: extra.FIREBASE_AUTH_DOMAIN,
    projectId: extra.FIREBASE_PROJECT_ID,
    storageBucket: extra.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
    appId: extra.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);