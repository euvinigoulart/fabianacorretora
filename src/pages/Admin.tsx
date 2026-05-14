import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit, Save, Settings } from 'lucide-react';
import { Property } from '../types';
import { subscribeToProperties, saveProperty, deletePropertyFromDb, subscribeToSettings, saveSetting, removeSetting } from '../store';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [authError, setAuthError] = useState('');

  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    // Check local session
    if (sessionStorage.getItem('aurum_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const unsubProps = subscribeToProperties(setPropertiesState);
      const unsubSettings = subscribeToSettings((settings) => {
        setWatermarkImg(settings.watermarkImage || '');
        setHeroImg(settings.heroImage || '');
        setAboutImg(settings.aboutImage || '');
        setCtaImg(settings.ctaImage || '');
        setFooterLogoImg(settings.footerLogo || '');
        setProfileImg(settings.profileImage || '');
      });
      return () => {
        unsubProps();
        unsubSettings();
      };
    }
  }, [isAuthenticated]);

  const handleWatermarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, false);
        await saveSetting('watermarkImage', resized);
        alert("Marca d'água atualizada com sucesso!");
      } catch(e: any) {
        alert("Erro ao salvar imagem. Verifique o limite de dados.");
      }
    }
  };

  const handleRemoveWatermark = async () => {
    await removeSetting('watermarkImage');
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, false);
        await saveSetting('heroImage', resized);
        alert("Imagem de fundo da tela inicial atualizada com sucesso!");
      } catch(e: any) {
        alert("Erro ao salvar imagem. Verifique o limite de dados.");
      }
    }
  };

  const handleRemoveHero = async () => {
    await removeSetting('heroImage');
  };

  const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, false);
        await saveSetting('aboutImage', resized);
        alert("Imagem da seção Sobre atualizada com sucesso!");
      } catch(e: any) {
        alert("Erro ao salvar imagem. Verifique o limite de dados.");
      }
    }
  };

  const handleRemoveAbout = async () => {
    await removeSetting('aboutImage');
  };

  const handleCtaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, false);
        await saveSetting('ctaImage', resized);
        alert("Imagem de fundo do Contato atualizada com sucesso!");
      } catch(e: any) {
        alert("Erro ao salvar imagem. Verifique o limite de dados.");
      }
    }
  };

  const handleRemoveCta = async () => {
    await removeSetting('ctaImage');
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, false);
        await saveSetting('footerLogo', resized);
        alert("Logo do rodapé atualizada com sucesso!");
      } catch(e: any) {
        alert("Erro ao salvar imagem. Verifique o limite de dados.");
      }
    }
  };

  const handleRemoveFooterLogo = async () => {
    await removeSetting('footerLogo');
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, false);
        await saveSetting('profileImage', resized);
        alert("Foto de perfil atualizada com sucesso!");
      } catch(e: any) {
        alert("Erro ao salvar imagem. Verifique o limite de dados.");
      }
    }
  };

  const handleRemoveProfile = async () => {
    await removeSetting('profileImage');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pass })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('aurum_admin_auth', 'true');
        setAuthError('');
      } else {
        const errJson = await res.json().catch(() => null);
        setAuthError(errJson?.error || 'Email ou senha incorretos.');
      }
    } catch (e) {
      setAuthError('Erro ao fazer login. Tente novamente.');
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aurum_admin_auth');
  };

  const resizeImage = (file: File, applyWatermark: boolean = true): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 400;
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

          const watermarkData = watermarkImg;
          const outputFormat = 'image/webp';
          const quality = 0.3;

          if (applyWatermark && watermarkData && ctx) {
            const wmImg = new Image();
            wmImg.onload = () => {
              ctx.globalAlpha = 0.6;
              const wmWidth = width * 0.25; // 25% of image width
              const wmHeight = wmImg.height * (wmWidth / wmImg.width);
              const padding = 20;
              ctx.drawImage(wmImg, width - wmWidth - padding, height - wmHeight - padding, wmWidth, wmHeight);
              ctx.globalAlpha = 1.0;
              resolve(canvas.toDataURL(outputFormat, quality));
            };
            wmImg.onerror = () => {
              resolve(canvas.toDataURL(outputFormat, quality));
            };
            wmImg.src = watermarkData;
          } else {
            resolve(canvas.toDataURL(outputFormat, quality));
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
      setFormData({ ...formData, image: resized });
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);

    const newGallery: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const resized = await resizeImage(files[i]);
      newGallery.push(resized);
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
    
    setIsUploading(true);
    let propToSave = { ...formData };
    if (!editingId) {
      propToSave.id = Date.now().toString();
    }
    
    const success = await saveProperty(propToSave);
    if (success) {
      resetForm();
    }
    setIsUploading(false);
  };

  const handleDeleteProperty = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      await deletePropertyFromDb(id);
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
        <div className="bg-white/5 border border-white/10 p-3 rounded text-sm text-neutral-400 mb-2 text-center">
          Credenciais padrão:<br/>
          Login: <strong className="text-white">admin</strong><br/>
          Senha: <strong className="text-white">1234</strong>
        </div>
        <input type="text" placeholder="Login" value={email} onChange={e => setEmail(e.target.value)} className="p-3 bg-black text-white outline-none border border-white/10 focus:border-gold-500" required />
        <input type="password" placeholder="Senha" value={pass} onChange={e => setPass(e.target.value)} className="p-3 bg-black text-white outline-none border border-white/10 focus:border-gold-500" required />
        {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
        <button type="submit" className="mt-2 p-3 bg-gold-500 text-black uppercase font-medium">Acessar Sistema</button>
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
            <div className="pt-6">
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
              <button type="submit" disabled={isUploading} className="px-6 py-2 bg-gold-500 text-black font-medium disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-gold-400 transition-colors">
                {isUploading ? 'Processando fotos...' : <><Save size={18} /> Salvar Imóvel</>}
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
