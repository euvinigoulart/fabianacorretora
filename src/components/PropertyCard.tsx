import React, { useState } from 'react';
import { MapPin, BedDouble, Bath, SquareMenu as Square, ChevronLeft, ChevronRight, Car, Waves, Flame, WashingMachine, ShowerHead, Share2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  idx: number;
  key?: React.Key;
}

export default function PropertyCard({ property, idx }: PropertyCardProps) {
  const images = [property.image, ...(property.gallery || [])].slice(0, 6);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.location.href.split('#')[0] + `#property-${property.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Confira este imóvel: ${property.title}`,
          url: url,
        });
      } catch (err) {
        console.error("Erro ao compartilhar", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  const phoneNumber = property.type === 'rental' ? '5551992658959' : '5551994708494';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Olá, gostei do imóvel "${property.title}" e gostaria de mais informações.`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className="group relative flex flex-col"
      id={`property-${property.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-neutral-900 border border-white/5">
        <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 uppercase tracking-wider text-[10px] text-white">
          {property.tag}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`${property.title} - Foto ${currentImageIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-gold-500 hover:text-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-gold-500 hover:text-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? 'w-4 bg-gold-500' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  onClick={(e) => { e.preventDefault(); setCurrentImageIndex(i); }}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-80"></div>
      </div>

      <div className="flex flex-col gap-3 flex-grow">
        <div className="flex justify-between items-start">
          <p className="text-gold-500 text-xs font-medium tracking-[0.1em] uppercase flex items-center gap-1">
            <MapPin size={12} /> {property.location}
          </p>
          <p className="font-serif text-xl font-normal text-white">{property.price}</p>
        </div>
        
        <h3 className="text-2xl font-serif font-light text-white group-hover:text-gold-500 transition-colors">
          {property.title}
        </h3>

        {property.description && (
          <p className="text-sm text-neutral-500 line-clamp-2 mt-1 mb-2">
            {property.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-neutral-400 font-light mt-2 border-t border-white/5 pt-4">
          {property.beds > 0 && (
            <div className="flex items-center gap-1.5" title={`${property.beds} Quartos`}>
              <BedDouble size={16} className="text-gold-500" />
              <span>{property.beds}</span>
            </div>
          )}
          {property.baths > 0 && (
            <div className="flex items-center gap-1.5" title={`${property.baths} Suítes`}>
              <Bath size={16} className="text-gold-500" />
              <span>{property.baths}</span>
            </div>
          )}
          {!!property.bathrooms && property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5" title={`${property.bathrooms} Banheiros`}>
              <ShowerHead size={16} className="text-gold-500" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {!!property.garages && property.garages > 0 && (
            <div className="flex items-center gap-1.5" title={`${property.garages} Vagas`}>
              <Car size={16} className="text-gold-500" />
              <span>{property.garages}</span>
            </div>
          )}
          {property.hasPool && (
            <div className="flex items-center gap-1.5" title="Piscina">
              <Waves size={16} className="text-gold-500" />
            </div>
          )}
          {property.hasBBQ && (
            <div className="flex items-center gap-1.5" title="Churrasqueira">
              <Flame size={16} className="text-gold-500" />
            </div>
          )}
          {property.hasLaundry && (
            <div className="flex items-center gap-1.5" title="Lavanderia">
              <WashingMachine size={16} className="text-gold-500" />
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto" title="Área">
            <Square size={16} className="text-gold-500" />
            <span>{property.area}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-gold-500 text-black py-2.5 px-4 text-sm font-medium hover:bg-gold-400 transition-colors"
          >
            <MessageCircle size={18} />
            Enviar Mensagem
          </a>
          <button
            onClick={handleShare}
            className="flex items-center justify-center p-2.5 bg-neutral-900 border border-white/10 text-white hover:text-gold-500 hover:border-gold-500 transition-colors"
            title="Compartilhar"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
