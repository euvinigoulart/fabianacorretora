import { Property } from './types';
import { db } from './lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export const subscribeToProperties = (callback: (properties: Property[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Property);
    callback(data);
  }, (err) => {
    console.error("Error subscribing to properties:", err);
  });
  return unsubscribe;
};

export const subscribeToSettings = (callback: (settings: any) => void) => {
  const unsubscribe = onSnapshot(doc(db, 'config', 'settings'), (snapshot) => {
    const data = snapshot.exists() ? snapshot.data() : {};
    callback(data);
  }, (err) => {
    console.error("Error subscribing to settings:", err);
  });
  return unsubscribe;
};

export const saveProperty = async (property: Property): Promise<boolean> => {
  try {
    const propId = String(property.id || Date.now());
    const propRef = doc(db, 'properties', propId);
    await setDoc(propRef, { ...property, id: propId });
    return true;
  } catch (e: any) {
    alert("Erro ao salvar imóvel: " + e.message);
    return false;
  }
};

export const deletePropertyFromDb = async (id: string | number) => {
  try {
    await deleteDoc(doc(db, 'properties', String(id)));
  } catch (e: any) {
    console.error(e);
  }
};

export const saveSetting = async (key: string, value: string) => {
  try {
    await setDoc(doc(db, 'config', 'settings'), {
      [key]: value
    }, { merge: true });
  } catch (e: any) {
    console.error(e);
    alert("Erro ao salvar a configuração: " + e.message);
  }
};

export const removeSetting = async (key: string) => {
  try {
    await setDoc(doc(db, 'config', 'settings'), {
      [key]: ''
    }, { merge: true });
  } catch (e) {
    console.error(e);
  }
};

