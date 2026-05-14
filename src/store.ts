import { Property } from './types';
import { INITIAL_PROPERTIES } from './data';

export const getProperties = (): Property[] => {
  const data = localStorage.getItem('aurum_properties');
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem('aurum_properties', JSON.stringify(INITIAL_PROPERTIES));
  return INITIAL_PROPERTIES;
};

export const saveProperties = (properties: Property[]): boolean => {
  try {
    localStorage.setItem('aurum_properties', JSON.stringify(properties));
    return true;
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      alert("Erro: O armazenamento local está cheio. As imagens enviadas são muito grandes. Tente enviar fotos menores.");
    } else {
      alert("Erro ao salvar: " + e.message);
    }
    return false;
  }
};

export const getCredentials = () => {
  const data = localStorage.getItem('aurum_credentials');
  if (data) {
    return JSON.parse(data);
  }
  const defaultCreds = { user: 'admin', pass: '1234' };
  localStorage.setItem('aurum_credentials', JSON.stringify(defaultCreds));
  return defaultCreds;
};

export const saveCredentials = (user: string, pass: string) => {
  localStorage.setItem('aurum_credentials', JSON.stringify({ user, pass }));
};
