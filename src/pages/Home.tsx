import React, { useState, useEffect } from 'react';
import { Search, MapPin, BedDouble, Bath, SquareMenu as Square, Menu, X, Phone, Mail, Instagram, Facebook, ArrowRight, Home as HomeIcon, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProperties } from '../store';
import { Property } from '../types';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [heroImg, setHeroImg] = useState<string>('');
  const [aboutImg, setAboutImg] = useState<string>('');
  const [ctaImg, setCtaImg] = useState<string>('');
  const [footerLogoImg, setFooterLogoImg] = useState<string>('');
  const [profileImg, setProfileImg] = useState<string>('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const carouselTexts = [
    "Até 100% de financiamento",
    "Condições facilitadas",
    "Oportunidade real para sair do aluguel"
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % carouselTexts.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    setProperties(getProperties());
    setHeroImg(localStorage.getItem('aurum_hero_image') || '');
    setAboutImg(localStorage.getItem('aurum_about_image') || '');
    setCtaImg(localStorage.getItem('aurum_cta_image') || '');
    setFooterLogoImg(localStorage.getItem('aurum_footer_logo') || '');
    setProfileImg(localStorage.getItem('aurum_profile_image') || '');
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const salesProperties = properties.filter(p => p.type === 'sale');
  const rentalProperties = properties.filter(p => p.type === 'rental');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-gold-500 selection:text-black">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 border-b border-white/5 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-gold-500">
              <HomeIcon size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[22px] tracking-wide font-medium text-neutral-300 leading-none mb-1">Fabiana Santos</span>
              <span className="text-gold-500 text-[11px] tracking-wider uppercase font-medium leading-none">Corretora de Imóveis • CRECI 56.515</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium tracking-wider uppercase hover:text-gold-500 transition-colors">Início</a>
            <a href="#venda" className="text-sm font-medium tracking-wider uppercase hover:text-gold-500 transition-colors">À Venda</a>
            <a href="#aluguel" className="text-sm font-medium tracking-wider uppercase hover:text-gold-500 transition-colors">Aluguel</a>
            <a href="#sobre" className="text-sm font-medium tracking-wider uppercase hover:text-gold-500 transition-colors">Fabiana Santos</a>
            <a href="https://wa.me/5551994708494" target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black text-sm uppercase tracking-wider transition-all duration-300">
              Fale Conosco
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white hover:text-gold-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif">Início</a>
              <a href="#venda" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif">À Venda</a>
              <a href="#aluguel" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif">Aluguel</a>
              <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif">Fabiana Santos</a>
              <a href="https://wa.me/5551994708494" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-gold-500">Fale no WhatsApp</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"}
            alt="Luxury Home"
            className="w-full h-full object-cover scale-105 animate-[slow-zoom_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl"
          >
            <p className="text-gold-500 uppercase tracking-[0.3em] text-sm mb-6 font-medium">Seu sonho da casa própria começa aqui!</p>
            <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.1] mb-8 text-white">
              O imóvel ideal, com a <br/> <span className="font-serif italic text-gold-500">confiança que você merece!</span>
            </h1>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/10 p-2 md:p-3 flex flex-col md:flex-row gap-3 rounded-lg"
          >
            <div className="flex-1 flex items-center bg-black/50 px-4 py-3 md:py-0 border border-white/5 disabled focus-within:border-gold-500 transition-colors">
              <MapPin className="text-gold-500 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Buscar por bairro, condomínio ou referência..."
                className="w-full bg-transparent text-white placeholder-neutral-500 outline-none text-sm font-light h-10 md:h-12"
              />
            </div>
            <button className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-3 md:py-0 h-10 md:h-12 font-medium uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2">
              <Search size={18} />
              <span>Buscar</span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Featured Properties - Sale */}
      <section id="venda" className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
               <p className="text-gold-500 uppercase tracking-[0.2em] text-xs font-semibold mb-3">Curadoria Exclusiva</p>
               <h2 className="font-serif text-4xl md:text-5xl font-light">Imóveis à Venda</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {salesProperties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties - Rental */}
      <section id="aluguel" className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
               <p className="text-gold-500 uppercase tracking-[0.2em] text-xs font-semibold mb-3">Longa Duração</p>
               <h2 className="font-serif text-4xl md:text-5xl font-light">Imóveis para Alocação</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {rentalProperties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} idx={idx} />
            ))}
            {rentalProperties.length === 0 && (
              <p className="text-neutral-500 font-light text-center col-span-2 py-12">Nenhum imóvel para locação disponível no momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative w-11/12 sm:w-10/12 md:w-3/4 lg:w-4/5 xl:w-[85%] mx-auto lg:mr-auto lg:ml-0">
              <div className="aspect-[3/4] overflow-hidden border border-white/10">
                <img
                  src={aboutImg || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                  alt="Modern Architecture"
                  className="w-full h-full object-cover"
                 />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-gold-500 uppercase tracking-[0.2em] text-xs font-semibold mb-4">Fabiana Santos</p>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 leading-[1.2]">
                Especialista em realizar o sonho do seu primeiro <span className="italic text-gold-500">imóvel.</span>
              </h2>
              <p className="text-neutral-400 font-light text-lg mb-6 leading-relaxed">
                Com 16 anos de atuação consolidada no mercado imobiliário, minha missão é transformar o sonho da casa própria em realidade através de um atendimento humano, simples e sem complicações. Mais do que intermediar vendas, dedico-me a oferecer uma orientação completa, especialmente dentro do programa Minha Casa Minha Vida, garantindo que cada cliente encontre o imóvel que se encaixa perfeitamente na sua realidade financeira.
              </p>
              <p className="text-neutral-400 font-light text-lg pb-10 leading-relaxed">
                Minha trajetória é marcada pelo compromisso de estar ao lado do comprador em cada etapa: desde a ajuda com financiamento, documentação e aprovação de crédito, até o momento mais esperado — a entrega das chaves. Aqui, seu objetivo é tratado com o respeito e a seriedade que ele merece, unindo eficiência e segurança para que você dê o seu primeiro passo com total confiança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Text Carousel */}
      <section className="bg-gold-500 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative flex justify-center items-center h-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTextIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-2xl md:text-3xl text-black font-medium absolute text-center w-full"
            >
              {carouselTexts[currentTextIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* Services/Highlights */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3 flex flex-col justify-center">
               <h2 className="text-gold-500 uppercase tracking-[0.2em] text-sm font-medium mb-6">Porque escolher a Fabiana Santos?</h2>
               <p className="font-serif text-3xl md:text-4xl text-white font-light leading-snug">
                 Aqui seu sonho é tratado com respeito e compromisso.
               </p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 "Atendimento simples, humano e sem complicação",
                "Orientação completa para o seu financiamento imobiliário",
                 "Ajuda com financiamento, documentação e aprovação de crédito",
                 "Imóveis dentro da sua realidade financeira",
                 "Acompanhamento do início até a entrega das chaves"
               ].map((item, idx) => (
                 <div key={idx} className="flex items-start gap-4 p-6 border border-white/5 bg-black hover:border-gold-500/20 transition-colors">
                   <div className="w-8 h-8 rounded-full border border-gold-500/50 flex items-center justify-center text-gold-500 shrink-0">
                     <span className="text-sm font-serif">{idx + 1}</span>
                   </div>
                   <p className="text-neutral-300 font-light text-sm leading-relaxed pt-1">{item}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contato" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={ctaImg || "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} alt="Interior" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-8">
            Seu sonho da casa própria <br className="hidden md:block"/> começa <span className="italic text-gold-500">aqui!</span>
          </h2>
          <p className="text-neutral-300 mb-12 font-light text-lg">
            Você sabia que com uma renda a partir de R$ 2.100,00 você já pode <br className="hidden md:block"/>
            conquistar sua casa ou apartamento com condições facilitadas de financiamento?
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="https://wa.me/5551994708494" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-colors uppercase tracking-wider text-sm font-medium">
              <MessageCircle size={18} /> Fale no WhatsApp
            </a>
            <a href="mailto:falimasa@hotmail.com" className="flex items-center justify-center gap-3 px-8 py-4 bg-gold-500 text-black border border-gold-500 hover:bg-gold-600 hover:border-gold-600 transition-colors uppercase tracking-wider text-sm font-medium">
              <Mail size={18} /> Enviar Mensagem
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] py-16 border-t border-white/5 text-sm font-light">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
             <div className="flex items-center gap-3 cursor-pointer mb-6">
                <div className="text-gold-500">
                  <HomeIcon size={24} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-lg tracking-wide font-medium text-neutral-300 leading-none mb-1">Fabiana Santos</span>
                  <span className="text-gold-500 text-[9px] tracking-wider uppercase font-medium leading-none">Corretora de Imóveis • CRECI 56.515</span>
                </div>
              </div>
            <p className="text-neutral-500 mb-6 leading-relaxed">
              Seu imóvel ideal, com a confiança que você merece.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/corretorafabi/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-gold-500 hover:border-gold-500 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/FabianaSantoslopes?locale=pt_BR" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-gold-500 hover:border-gold-500 transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white uppercase tracking-widest font-semibold text-xs mb-6">Menu</h4>
            <ul className="flex flex-col gap-4 text-neutral-500">
              <li><a href="#" className="hover:text-gold-500 transition-colors">Início</a></li>
              <li><a href="#venda" className="hover:text-gold-500 transition-colors">À Venda</a></li>
              <li><a href="#aluguel" className="hover:text-gold-500 transition-colors">Aluguel</a></li>
              <li><a href="#sobre" className="hover:text-gold-500 transition-colors">Sobre a Fabiana</a></li>
              <li><a href="#contato" className="hover:text-gold-500 transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white uppercase tracking-widest font-semibold text-xs mb-6">Exclusivos</h4>
            <ul className="flex flex-col gap-4 text-neutral-500">
              <li><a href="#" className="hover:text-gold-500 transition-colors">Lançamentos</a></li>
              <li><a href="#" className="hover:text-gold-500 transition-colors">Coberturas</a></li>
              <li><a href="#" className="hover:text-gold-500 transition-colors">Casas em Condomínio</a></li>
              <li><a href="#" className="hover:text-gold-500 transition-colors">Off-market</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-widest font-semibold text-xs mb-6">Contato</h4>
            <ul className="flex flex-col gap-4 text-neutral-500">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-500 mt-1 shrink-0" />
                <span>Rua Herminio Machado, 601<br/>Jardim Algarve – Alvorada / RS<br/>CNPJ: 62.026.766/0001-00</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} className="text-gold-500 shrink-0" />
                <a href="https://wa.me/5551994708494" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">+55 51 99470-8494</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <span>falimasa@hotmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-neutral-600 text-xs">
          <div className="flex flex-col items-center md:items-start gap-4">
             {footerLogoImg && <img src={footerLogoImg} alt="Logo Rodapé" className="h-8 object-contain brightness-0 invert opacity-50 hover:opacity-100 transition-opacity" />}
             <p>© 2026 Fabiana Santos Corretora. CRECI 56.515. Todos os direitos reservados. | <Link to="/admin" className="hover:text-gold-500 transition-colors">Área Restrita</Link></p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5551994708494"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircle size={32} />
      </motion.a>
    </div>
  );
}
