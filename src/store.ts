import { Property } from './types';
import { db, auth } from './lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const subscribeToProperties = (callback: (properties: Property[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Property);
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'properties');
  });
  return unsubscribe;
};

export const subscribeToSettings = (callback: (settings: any) => void) => {
  const unsubscribe = onSnapshot(doc(db, 'config', 'settings'), (snapshot) => {
    const data = snapshot.exists() ? snapshot.data() : {};
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'config/settings');
  });
  return unsubscribe;
};

export const saveProperty = async (property: Property): Promise<boolean> => {
  try {
    const propId = String(property.id || Date.now());
    await setDoc(doc(db, 'properties', propId), { ...property, id: propId });
    return true;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, 'properties/' + property.id);
    return false;
  }
};

export const deletePropertyFromDb = async (id: string | number) => {
  try {
    await deleteDoc(doc(db, 'properties', String(id)));
  } catch (error: any) {
    handleFirestoreError(error, OperationType.DELETE, 'properties/' + id);
  }
};

export const saveSetting = async (key: string, value: string) => {
  try {
    await setDoc(doc(db, 'config', 'settings'), { [key]: value }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, 'config/settings');
  }
};

export const removeSetting = async (key: string) => {
  try {
    await setDoc(doc(db, 'config', 'settings'), { [key]: '' }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, 'config/settings');
  }
};

