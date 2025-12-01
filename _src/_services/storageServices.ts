import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../_src/firebaseConfig";

export interface SavedTrip {
  id: string;
  city: string;
  days: number;
  itinerary: string;
  createdAt: string;
  userId?: string;
}

// Salvar roteiro
export async function saveTrip(city: string, days: number, itinerary: string) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não está logado");

  try {
    await addDoc(collection(db, "trips"), {
      userId: user.uid,
      city,
      days,
      itinerary,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro ao salvar trip:", err);
    throw new Error("Falha ao salvar roteiro no Firestore");
  }
}

// Buscar todos os roteiros do usuário
export async function getSavedTrips(): Promise<SavedTrip[]> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não está logado");

  const q = query(
    collection(db, "trips"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    city: docSnap.data().city,
    days: docSnap.data().days,
    itinerary: docSnap.data().itinerary,
    createdAt: docSnap.data().createdAt,
    userId: docSnap.data().userId,
  }));
}

// Buscar roteiro específico pelo id
export async function getTripById(id: string): Promise<SavedTrip | null> {
  try {
    const docRef = doc(db, "trips", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<SavedTrip, "id">) };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Erro ao buscar trip:", err);
    return null;
  }
}

// Deletar roteiro
export async function deleteTrip(id: string) {
  await deleteDoc(doc(db, "trips", id));
}
