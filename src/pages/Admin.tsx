import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit, Save, Settings } from 'lucide-react';
import { Property } from '../types';
import { getProperties, syncPropertiesToSupabase, deletePropertyFromSupabase, getCredentials, saveCredentials, uploadImageToSupabase, getSupabaseSettings, saveSupabaseSetting } from '../store';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [authError, setAuthError] = useState('');

  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [watermarkImg, setWatermarkImg] = useState<string>('');
  const [heroImg, setHeroImg] = useState<string>('');
  const [aboutImg, setAboutImg] = useState<string>('');
  const [ctaImg, setCtaImg] = useState<string>('');
  const [footerLogoImg, setFooterLogoImg] = useState<string>('');
  const [profileImg, setProfileImg] = useState<string>('');
  
  const [formData, setFormData] = useState<Property>({
    id: '', title: '', location: '', price: '', beds: 0, baths: 0, area: '', image: '', tag: '', type: 'sale', gallery: []
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getProperties().then(setPropertiesState);
      
      const loadSettings = async () => {
         const supaSettings = await getSupabaseSettings();
         if (supaSettings) {
             setWatermarkImg(supaSettings.watermark_img || '');
             setHeroImg(supaSettings.hero_img || '');
             setAboutImg(supaSettings.about_img || '');
             setCtaImg(supaSettings.cta_img || '');
             setFooterLogoImg(supaSettings.footer_logo_img || '');
             setProfileImg(supaSettings.profile_img || '');
         } else {
             setWatermarkImg(localStorage.getItem('aurum_watermark_image') || '');
             setHeroImg(localStorage.getItem('aurum_hero_image') || '');
             setAboutImg(localStorage.getItem('aurum_about_image') || '');
             setCtaImg(localStorage.getItem('aurum_cta_image') || '');
             setFooterLogoImg(localStorage.getItem('aurum_footer_logo') || '');
             setProfileImg(localStorage.getItem('aurum_profile_image') || '');
         }
      };
      loadSettings();
    }
  }, [isAuthenticated]);

  const handleWatermarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      await uploadAndSetImage(file, resized, 'watermark_img', setWatermarkImg);
      alert("Marca d'água atualizada com sucesso!");
    }
  };

  const handleRemoveWatermark = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) await saveSupabaseSetting('watermark_img', '');
    else localStorage.removeItem('aurum_watermark_image');
    setWatermarkImg('');
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      await uploadAndSetImage(file, resized, 'hero_img', setHeroImg);
      alert("Imagem de fundo da tela inicial atualizada com sucesso!");
    }
  };

  const handleRemoveHero = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) await saveSupabaseSetting('hero_img', '');
    else localStorage.removeItem('aurum_hero_image');
    setHeroImg('');
  };

  const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      await uploadAndSetImage(file, resized, 'about_img', setAboutImg);
      alert("Imagem da seção Sobre atualizada com sucesso!");
    }
  };

  const handleRemoveAbout = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) await saveSupabaseSetting('about_img', '');
    else localStorage.removeItem('aurum_about_image');
    setAboutImg('');
  };

  const handleCtaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      await uploadAndSetImage(file, resized, 'cta_img', setCtaImg);
      alert("Imagem de fundo do Contato atualizada com sucesso!");
    }
  };

  const handleRemoveCta = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) await saveSupabaseSetting('cta_img', '');
    else localStorage.removeItem('aurum_cta_image');
    setCtaImg('');
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      await uploadAndSetImage(file, resized, 'footer_logo_img', setFooterLogoImg);
      alert("Logo do rodapé atualizada com sucesso!");
    }
  };

  const handleRemoveFooterLogo = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) await saveSupabaseSetting('footer_logo_img', '');
    else localStorage.removeItem('aurum_footer_logo');
    setFooterLogoImg('');
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      await uploadAndSetImage(file, resized, 'profile_img', setProfileImg);
      alert("Foto de perfil atualizada com sucesso!");
    }
  };

  const handleRemoveProfile = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) await saveSupabaseSetting('profile_img', '');
    else localStorage.removeItem('aurum_profile_image');
    setProfileImg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const creds = await getCredentials();
    if (user === creds.user && pass === creds.pass) {
      setIsAuthenticated(true);
      setAuthError('');
      setNewUser(creds.user);
      setNewPass(creds.pass);
    } else {
      setAuthError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser('');
    setPass('');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if(newUser && newPass) {
      saveCredentials(newUser, newPass);
      alert('Credenciais atualizadas com sucesso!');
      setIsSettingsOpen(false);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg',
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  const uploadAndSetImage = async (file: File, resizedDataUrl: string, key: string, setter: (val: string) => void) => {
     if (import.meta.env.VITE_SUPABASE_URL) {
         setIsUploading(true);
         const fileObj = dataURLtoFile(resizedDataUrl, file.name);
         const url = await uploadImageToSupabase(fileObj);
         setIsUploading(false);
         if (url) {
            setter(url);
            await saveSupabaseSetting(key, url);
         }
     } else {
         localStorage.setItem(`aurum_${key}`, resizedDataUrl);
         setter(resizedDataUrl);
     }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const watermarkData = localStorage.getItem('aurum_watermark_image');
          if (watermarkData && ctx) {
            const wmImg = new Image();
            wmImg.onload = () => {
              ctx.globalAlpha = 0.6;
              const wmWidth = width * 0.25; // 25% of image width
              const wmHeight = wmImg.height * (wmWidth / wmImg.width);
              const padding = 20;
              ctx.drawImage(wmImg, width - wmWidth - padding, height - wmHeight - padding, wmWidth, wmHeight);
              ctx.globalAlpha = 1.0;
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            wmImg.onerror = () => {
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            wmImg.src = watermarkData;
          } else {
            resolve(canvas.toDataURL('image/jpeg', 0.6));
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const resized = await resizeImage(file);
      if (import.meta.env.VITE_SUPABASE_URL) {
         const fileObj = dataURLtoFile(resized, file.name);
         const url = await uploadImageToSupabase(fileObj);
         if (url) {
             setFormData({ ...formData, image: url });
         }
      } else {
         setFormData({ ...formData, image: resized });
      }
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);

    const newGallery: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const resized = await resizeImage(file);
        
        if (import.meta.env.VITE_SUPABASE_URL) {
            const fileObj = dataURLtoFile(resized, file.name);
            const url = await uploadImageToSupabase(fileObj);
            if (url) newGallery.push(url);
        } else {
            newGallery.push(resized);
        }
    }
    
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), ...newGallery]
    }));
    setIsUploading(false);
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index)
    }));
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("A imagem principal é obrigatória.");
      return;
    }
    
    if (import.meta.env.VITE_SUPABASE_URL) {
        setIsUploading(true);
        const result = await syncPropertiesToSupabase({
            ...formData,
            id: editingId || ''
        });
        setIsUploading(false);
        if (result) {
            setPropertiesState(await getProperties());
            resetForm();
        }
    } else {
        let updatedProps;
        if (editingId) {
          updatedProps = properties.map(p => p.id === editingId ? { ...formData, id: editingId } : p);
        } else {
          updatedProps = [...properties, { ...formData, id: Date.now() }];
        }
        
        if (await saveProperties(updatedProps)) {
          setPropertiesState(updatedProps);
          resetForm();
        }
    }
  };

  const handleDeleteProperty = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      if (import.meta.env.VITE_SUPABASE_URL) {
          const ok = await deletePropertyFromSupabase(id);
          if (ok) setPropertiesState(await getProperties());
          else alert("Erro ao deletar do Supabase");
      } else {
          const updatedProps = properties.filter(p => p.id !== id);
          setPropertiesState(updatedProps);
          saveProperties(updatedProps);
      }
    }
  };

  const startEdit = (property: Property) => {
    setFormData(property);
    setEditingId(property.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', location: '', price: '', beds: 0, baths: 0, area: '', image: '', tag: '', type: 'sale', gallery: [] });
    setEditingId(null);
    setIsAdding(false);
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center">
      <form onSubmit={handleLogin} className="w-96 p-8 bg-[#0a0a0a] border border-white/10 flex flex-col gap-4">
        <h2 className="text-2xl text-white font-serif text-center mb-4">Acesso Restrito</h2>
        <input placeholder="Usuário (padrão: admin)" value={user} onChange={e => setUser(e.target.value)} className="p-3 bg-black text-white outline-none border border-white/10 focus:border-gold-500" required />
        <input type="password" placeholder="Senha (padrão: 1234)" value={pass} onChange={e => setPass(e.target.value)} className="p-3 bg-black text-white outline-none border border-white/10 focus:border-gold-500" required />
        {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
        <button type="submit" className="mt-2 p-3 bg-gold-500 text-black uppercase font-medium">Entrar</button>
        <Link to="/" className="text-neutral-500 text-sm text-center hover:text-white mt-4">Voltar</Link>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="bg-black border-b border-white/10 p-4 flex justify-between px-6">
        <h1 className="text-gold-500 font-serif text-xl">Painel / Fabiana Santos</h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => setIsSettingsOpen(true)} className="text-sm text-neutral-400 hover:text-white flex items-center gap-1"><Settings size={16}/> Configurações</button>
          <Link to="/" className="text-sm text-neutral-400 hover:text-white">Site</Link>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1"><LogOut size={16}/> Sair</button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        {isSettingsOpen && (
          <div className="mb-8 p-6 bg-[#0a0a0a] border border-white/10 flex flex-col gap-6">
            <h3 className="text-gold-500 font-serif">Configurações do Sistema</h3>
            <form onSubmit={handleSaveCredentials} className="flex gap-4 items-end">
              <div className="flex-1"><label className="text-xs text-neutral-500 block mb-2">Novo Usuário Admin</label><input required value={newUser} onChange={e=>setNewUser(e.target.value)} className="w-full p-2 bg-black border border-white/10 text-white" /></div>
              <div className="flex-1"><label className="text-xs text-neutral-500 block mb-2">Nova Senha Admin</label><input required type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} className="w-full p-2 bg-black border border-white/10 text-white" /></div>
              <button type="submit" className="p-2 px-6 bg-gold-500 text-black h-[42px] font-medium"><Save size={18}/></button>
            </form>
            
            <div className="border-t border-white/5 pt-6">
              <label className="text-sm text-neutral-400 block mb-2">Imagem de Fundo da Tela Inicial</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleHeroUpload} className="p-2 border border-white/10 bg-black text-sm flex-1" />
                {heroImg && (
                  <div className="flex items-center gap-4">
                    <img src={heroImg} alt="Hero preview" className="h-10 object-cover bg-neutral-900" />
                    <button onClick={handleRemoveHero} className="text-xs text-red-500 hover:text-red-400">Remover</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2 mb-6">Dica: Envie uma imagem de alta qualidade para o fundo principal do site.</p>
              
              <label className="text-sm text-neutral-400 block mb-2">Imagem da Seção Sobre</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleAboutUpload} className="p-2 border border-white/10 bg-black text-sm flex-1" />
                {aboutImg && (
                  <div className="flex items-center gap-4">
                    <img src={aboutImg} alt="About preview" className="h-10 object-cover bg-neutral-900" />
                    <button onClick={handleRemoveAbout} className="text-xs text-red-500 hover:text-red-400">Remover</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2 mb-6">Dica: Imagem para a seção lateral 'Sobre'.</p>

              <label className="text-sm text-neutral-400 block mb-2">Foto de Perfil (Para a seção Sobre)</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleProfileUpload} className="p-2 border border-white/10 bg-black text-sm flex-1" />
                {profileImg && (
                  <div className="flex items-center gap-4">
                    <img src={profileImg} alt="Profile preview" className="h-10 object-cover bg-neutral-900" />
                    <button onClick={handleRemoveProfile} className="text-xs text-red-500 hover:text-red-400">Remover</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2 mb-6">Dica: Sua foto que aparecerá na direita da tela sobreposta na imagem da seção 'Sobre'.</p>

              <label className="text-sm text-neutral-400 block mb-2">Imagem de Fundo do Contato</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleCtaUpload} className="p-2 border border-white/10 bg-black text-sm flex-1" />
                {ctaImg && (
                  <div className="flex items-center gap-4">
                    <img src={ctaImg} alt="CTA preview" className="h-10 object-cover bg-neutral-900" />
                    <button onClick={handleRemoveCta} className="text-xs text-red-500 hover:text-red-400">Remover</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2 mb-6">Dica: Imagem de fundo para a seção de Contato.</p>

              <label className="text-sm text-neutral-400 block mb-2">Logo do Rodapé</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleFooterLogoUpload} className="p-2 border border-white/10 bg-black text-sm flex-1" />
                {footerLogoImg && (
                  <div className="flex items-center gap-4">
                    <img src={footerLogoImg} alt="Footer preview" className="h-10 object-contain bg-neutral-900 px-2" />
                    <button onClick={handleRemoveFooterLogo} className="text-xs text-red-500 hover:text-red-400">Remover</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2 mb-6">Dica: Logo que aparece no final da página (rodape).</p>

              <label className="text-sm text-neutral-400 block mb-2">Logo para Marca D'água nas Fotos</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleWatermarkUpload} className="p-2 border border-white/10 bg-black text-sm flex-1" />
                {watermarkImg && (
                  <div className="flex items-center gap-4">
                    <img src={watermarkImg} alt="Watermark preview" className="h-10 object-contain bg-neutral-900 px-2" />
                    <button onClick={handleRemoveWatermark} className="text-xs text-red-500 hover:text-red-400">Remover</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2">Dica: Envie uma imagem com fundo transparente (PNG) ou branco. Será aplicada automaticamente nas novas fotos cadastradas.</p>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif">Imóveis</h2>
          {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-gold-500 text-black px-4 py-2 font-medium uppercase text-sm"><Plus size={16}/> Novo</button>}
        </div>
        {isAdding && (
          <form onSubmit={handleSaveProperty} className="bg-[#0a0a0a] p-6 border border-white/10 mb-8 grid grid-cols-2 gap-4">
            <input required placeholder="Título" value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} className="col-span-2 p-3 bg-black border border-white/10" />
            <input required placeholder="Localização" value={formData.location} onChange={e=>setFormData({...formData,location:e.target.value})} className="p-3 bg-black border border-white/10" />
            <input required placeholder="Preço" value={formData.price} onChange={e=>setFormData({...formData,price:e.target.value})} className="p-3 bg-black border border-white/10" />
            
            <div className="col-span-2 space-y-4">
              <div>
                <label className="text-xs text-neutral-500 mb-2 block">Descrição Completa</label>
                <textarea rows={4} placeholder="Descrição detalhada do imóvel" value={formData.description || ''} onChange={e=>setFormData({...formData,description:e.target.value})} className="w-full p-3 bg-black border border-white/10" />
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <div>
                <label className="text-xs text-neutral-500 mb-2 block">Imagem Principal</label>
                <input type="file" accept="image/*" onChange={handleMainImageUpload} className="p-2 border border-white/10 bg-black text-sm w-full" />
                {formData.image && <img src={formData.image} alt="Main" className="h-20 w-32 object-cover mt-2 border border-white/10" />}
              </div>
              
              <div>
                <label className="text-xs text-neutral-500 mb-2 block">Galeria de Fotos (Múltiplas)</label>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="p-2 border border-white/10 bg-black text-sm w-full" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.gallery || []).map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="Gallery item" className="h-20 w-32 object-cover border border-white/10" />
                      <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Quartos</label>
                <input required type="number" placeholder="Ex: 2" value={formData.beds === 0 ? 0 : formData.beds || ''} onChange={e=>setFormData({...formData,beds:Number(e.target.value)})} className="p-3 bg-black border border-white/10 w-full" />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Suítes</label>
                <input type="number" placeholder="Ex: 1" value={formData.baths === 0 ? 0 : formData.baths || ''} onChange={e=>setFormData({...formData,baths:Number(e.target.value)})} className="p-3 bg-black border border-white/10 w-full" />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Banheiros</label>
                <input type="number" placeholder="Ex: 2" value={formData.bathrooms === 0 ? 0 : formData.bathrooms || ''} onChange={e=>setFormData({...formData,bathrooms:Number(e.target.value)})} className="p-3 bg-black border border-white/10 w-full" />
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Vagas de Garagem</label>
                <input type="number" placeholder="Ex: 1" value={formData.garages === 0 ? 0 : formData.garages || ''} onChange={e=>setFormData({...formData,garages:Number(e.target.value)})} className="p-3 bg-black border border-white/10 w-full" />
              </div>
            </div>

            <div className="col-span-2 flex gap-6 text-sm text-neutral-400 my-2">
               <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" checked={formData.hasBBQ || false} onChange={e=>setFormData({...formData, hasBBQ: e.target.checked})} className="accent-gold-500 w-4 h-4 cursor-pointer" />
                  Churrasqueira
               </label>
               <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" checked={formData.hasPool || false} onChange={e=>setFormData({...formData, hasPool: e.target.checked})} className="accent-gold-500 w-4 h-4 cursor-pointer" />
                  Piscina
               </label>
               <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" checked={formData.hasLaundry || false} onChange={e=>setFormData({...formData, hasLaundry: e.target.checked})} className="accent-gold-500 w-4 h-4 cursor-pointer" />
                  Lavanderia
               </label>
            </div>

            <input required placeholder="Área" value={formData.area} onChange={e=>setFormData({...formData,area:e.target.value})} className="col-span-2 p-3 bg-black border border-white/10" />
            <input placeholder="Tag (Novo, Destaque)" value={formData.tag} onChange={e=>setFormData({...formData,tag:e.target.value})} className="p-3 bg-black border border-white/10" />
             <select value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value as 'sale'|'rental'})} className="p-3 bg-black border border-white/10 appearance-none">
              <option value="sale">Venda</option><option value="rental">Aluguel</option>
            </select>
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={resetForm} className="px-6 py-2 border border-white/20 text-neutral-400">Cancelar</button>
              <button type="submit" disabled={isUploading} className="px-6 py-2 bg-gold-500 text-black disabled:opacity-50">
                {isUploading ? 'Processando fotos...' : 'Salvar Imóvel'}
              </button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-2 gap-4">
          {properties.map(p => (
            <div key={p.id} className="flex gap-4 p-4 bg-[#0a0a0a] border border-white/10 items-center">
              <img src={p.image} className="w-24 h-24 object-cover" alt="" />
              <div className="flex-1 overflow-hidden">
                <h4 className="truncate font-serif">{p.title}</h4>
                <p className="text-gold-500 text-sm mt-1">{p.price}</p>
                <div className="flex gap-2 mt-4 text-xs">
                  <button onClick={() => startEdit(p)} className="flex items-center gap-1 text-neutral-400 hover:text-gold-500"><Edit size={14}/> Editar</button>
                  <button onClick={() => handleDeleteProperty(p.id)} className="flex items-center gap-1 text-neutral-400 hover:text-red-500"><Trash2 size={14}/> Excluir</button>
                </div>
              </div>
              <span className="text-xs self-start px-2 py-1 bg-black text-neutral-400 border border-white/10">{p.type === 'sale' ? 'Venda' : 'Aluguel'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
