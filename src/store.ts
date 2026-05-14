import { Property } from './types';

export const subscribeToProperties = (callback: (properties: Property[]) => void) => {
  const fetchProps = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        callback(data.properties || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  fetchProps();
  const intervalId = setInterval(fetchProps, 2000);

  return () => clearInterval(intervalId);
};

export const subscribeToSettings = (callback: (settings: any) => void) => {
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        callback(data.settings || {});
      }
    } catch (e) {
      console.error(e);
    }
  };

  fetchSettings();
  const intervalId = setInterval(fetchSettings, 2000);

  return () => clearInterval(intervalId);
};

export const saveProperty = async (property: Property): Promise<boolean> => {
  try {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(property)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP error! status: ${res.status} - ${text}`);
    }
    return true;
  } catch (e: any) {
    alert("Erro ao salvar imóvel: " + e.message);
    return false;
  }
};

export const deletePropertyFromDb = async (id: string | number) => {
  try {
    await fetch(`/api/properties/${id}`, {
      method: 'DELETE'
    });
  } catch (e: any) {
    console.error(e);
  }
};

export const saveSetting = async (key: string, value: string) => {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [key]: value })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP error! status: ${res.status} - ${text}`);
    }
  } catch (e: any) {
    console.error(e);
    alert("Erro ao salvar a configuração: " + e.message);
  }
};

export const removeSetting = async (key: string) => {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [key]: '' })
    });
  } catch (e) {
    console.error(e);
  }
};

