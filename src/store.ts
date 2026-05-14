import { Property } from './types';
import { supabase } from './lib/supabase';
import { INITIAL_PROPERTIES } from './data';

export const getProperties = async (): Promise<Property[]> => {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn("Supabase não configurado. Exibindo dados locais.");
    const data = localStorage.getItem('aurum_properties');
    if (data) return JSON.parse(data);
    return INITIAL_PROPERTIES;
  }

  const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Erro ao buscar propriedades do Supabase:', error);
    return [];
  }
  
  return data.map(p => ({
    ...p,
    hasBBQ: p.has_bbq,
    hasPool: p.has_pool,
    hasLaundry: p.has_laundry,
  }));
};

export const saveProperties = async (properties: Property[]): Promise<boolean> => {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    try {
      localStorage.setItem('aurum_properties', JSON.stringify(properties));
      return true;
    } catch (e: any) {
      alert("Erro ao salvar: " + e.message);
      return false;
    }
  }

  return true; // Use addProperty, updateProperty e deleteProperty separadamente no Supabase
};

export const syncPropertiesToSupabase = async (property: Property): Promise<Property | null> => {
  const payload = {
    title: property.title,
    description: property.description,
    location: property.location,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    bathrooms: property.bathrooms,
    garages: property.garages,
    has_bbq: property.hasBBQ,
    has_pool: property.hasPool,
    has_laundry: property.hasLaundry,
    area: property.area,
    image: property.image,
    gallery: property.gallery,
    tag: property.tag,
    type: property.type,
  };

  if (typeof property.id === 'string' && property.id.length > 20) {
    // Edição (assumindo que o uuid do supabase tem +20 caracteres, e o date.now do localstorage não, ou trataremos ambos como string. Para simplificar, se já tiver um uuid, é update.)
    const { data, error } = await supabase.from('properties').update(payload).eq('id', property.id).select().single();
    if (error) { console.error(error); alert("Erro ao editar!"); return null; }
    return { ...data, hasBBQ: data.has_bbq, hasPool: data.has_pool, hasLaundry: data.has_laundry };
  } else {
    // Criação
    const { data, error } = await supabase.from('properties').insert(payload).select().single();
    if (error) { console.error(error); alert("Erro ao criar!"); return null; }
    return { ...data, hasBBQ: data.has_bbq, hasPool: data.has_pool, hasLaundry: data.has_laundry };
  }
};

export const deletePropertyFromSupabase = async (id: string | number): Promise<boolean> => {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
};

export const uploadImageToSupabase = async (file: File): Promise<string | null> => {
   if (!import.meta.env.VITE_SUPABASE_URL) return null;
   
   const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
   const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
   const filePath = `${fileName}`;

   const { error } = await supabase.storage.from('images').upload(filePath, file);
   
   if (error) {
     console.error('Upload Error:', error);
     return null;
   }

   const { data } = supabase.storage.from('images').getPublicUrl(filePath);
   return data.publicUrl;
};

export const getCredentials = async () => {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    const data = localStorage.getItem('aurum_credentials');
    if (data) return JSON.parse(data);
    return { user: 'admin', pass: '1234' };
  }

  const { data, error } = await supabase.from('settings').select('admin_user, admin_pass').eq('id', 1).single();
  if (error) {
    console.error(error);
    return { user: 'admin', pass: '1234' };
  }
  return { user: data.admin_user, pass: data.admin_pass };
};

export const saveCredentials = async (user: string, pass: string) => {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    localStorage.setItem('aurum_credentials', JSON.stringify({ user, pass }));
    return;
  }
  await supabase.from('settings').update({ admin_user: user, admin_pass: pass }).eq('id', 1);
};

export const getSupabaseSettings = async () => {
  if (!import.meta.env.VITE_SUPABASE_URL) return null;
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
  return data;
};

export const saveSupabaseSetting = async (key: string, value: string) => {
   if (!import.meta.env.VITE_SUPABASE_URL) return;
   await supabase.from('settings').update({ [key]: value }).eq('id', 1);
};
