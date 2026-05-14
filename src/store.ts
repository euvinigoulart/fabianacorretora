import { Property } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { INITIAL_PROPERTIES } from './data';

export const getProperties = async (): Promise<Property[]> => {
  if (!isSupabaseConfigured) {
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
  if (!isSupabaseConfigured) {
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
   if (!isSupabaseConfigured) return null;
   
   try {
     const fileExt = (file.name || '').split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
     const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000000)}.${fileExt}`;
     
     // Converter de forma segura
     let uploadBody: File | Blob = file;
     try {
       // Alguns navegadores móveis têm problemas com objetos File customizados
       uploadBody = new Blob([await file.arrayBuffer()], { type: file.type || 'image/jpeg' });
     } catch (e) {
       console.log('Fallback para file nativo', e);
     }
     
     const { data, error } = await supabase.storage.from('images').upload(fileName, uploadBody, {
       cacheControl: '3600',
       upsert: true,
       contentType: file.type || 'image/jpeg'
     });
     
     if (error) {
       console.error('Upload Error from Supabase:', error);
       alert(`Erro no upload: ${error.message || JSON.stringify(error)}`);
       return null;
     }
  
     const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
     return urlData.publicUrl;
   } catch (err: any) {
     console.error('Unexpected error during upload:', err);
     alert(`Erro inesperado: ${err.message || String(err)}`);
     return null;
   }
};

export const getCredentials = async () => {
  if (!isSupabaseConfigured) {
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
  if (!isSupabaseConfigured) {
    localStorage.setItem('aurum_credentials', JSON.stringify({ user, pass }));
    return;
  }
  await supabase.from('settings').update({ admin_user: user, admin_pass: pass }).eq('id', 1);
};

export const getSupabaseSettings = async () => {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
  return data;
};

export const saveSupabaseSetting = async (key: string, value: string) => {
   if (!isSupabaseConfigured) return;
   
   // Tentar atualizar
   const { data, error } = await supabase.from('settings').update({ [key]: value }).eq('id', 1).select();
   
   if (error) {
     console.error('Erro ao atualizar config:', error);
   } else if (!data || data.length === 0) {
     // Se não atualizou nenhuma linha, tenta inserir
     const { error: insertErr } = await supabase.from('settings').insert({ id: 1, [key]: value });
     if (insertErr) console.error('Erro ao inserir config:', insertErr);
   }
};
