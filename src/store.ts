import { Property } from './types';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export const subscribeToProperties = (callback: (properties: Property[]) => void) => {
  return onSnapshot(collection(db, 'properties'), (snapshot) => {
    const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
    callback(props);
  }, (error) => {
    console.error('Firestore Error:', error);
  });
};

export const subscribeToSettings = (callback: (settings: any) => void) => {
  return onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({});
    }
  }, (error) => {
    console.error('Firestore Error:', error);
  });
};

export const saveProperty = async (property: Property): Promise<boolean> => {
  try {
    const propId = property.id.toString();
    await setDoc(doc(db, 'properties', propId), property);
    return true;
  } catch (e: any) {
    alert("Erro ao salvar imóvel. Limite de tamanho pode ter sido excedido (1MB). Pode usar fotos menores.");
    console.error("Firestore error: " + e.message);
    return false;
  }
};

export const deletePropertyFromDb = async (id: string | number) => {
  try {
    await deleteDoc(doc(db, 'properties', id.toString()));
  } catch (e: any) {
    console.error(e);
  }
};

export const saveSetting = async (key: string, value: string) => {
  try {
    const settingsRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(settingsRef);
    if (!docSnap.exists()) {
      await setDoc(settingsRef, { [key]: value });
    } else {
      await updateDoc(settingsRef, { [key]: value });
    }
  } catch (e: any) {
    if (e.message.includes('No document to update') || e.code === 'not-found') {
      await setDoc(doc(db, 'settings', 'global'), { [key]: value });
    } else {
      console.error(e);
      alert("Erro ao salvar a imagem." + e.message);
    }
  }
};

export const removeSetting = async (key: string) => {
  try {
    const settingsRef = doc(db, 'settings', 'global');
    await updateDoc(settingsRef, { [key]: '' });
  } catch (e) {
    console.error(e);
  }
};

