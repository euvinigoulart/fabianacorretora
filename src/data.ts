import { Property } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'Mansão Contemporânea no Jardim Europa',
    description: 'Mansão de alto padrão com acabamentos importados, living para 4 ambientes e pé direito duplo.',
    location: 'Jardim Europa, São Paulo',
    price: 'R$ 15.500.000',
    beds: 4,
    baths: 4,
    bathrooms: 6,
    garages: 4,
    hasPool: true,
    hasBBQ: true,
    hasLaundry: true,
    area: '850 m²',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490908592-d503c2bb5cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Exclusivo',
    type: 'sale'
  },
  {
    id: 2,
    title: 'Cobertura Duplex com Vista Panorâmica',
    description: 'Imóvel espetacular com terraço, piscina privativa e vista livre para o parque.',
    location: 'Itaim Bibi, São Paulo',
    price: 'R$ 8.900.000',
    beds: 3,
    baths: 3,
    bathrooms: 4,
    garages: 3,
    hasPool: true,
    hasBBQ: true,
    hasLaundry: true,
    area: '420 m²',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490908592-d503c2bb5cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Destaque',
    type: 'sale'
  },
  {
    id: 3,
    title: 'Casa de Condomínio Alto Padrão',
    description: 'Perfeito para a família, segurança 24h, amplos jardins e área de lazer completa no condomínio.',
    location: 'Alphaville, Barueri',
    price: 'R$ 12.000.000',
    beds: 5,
    baths: 5,
    bathrooms: 7,
    garages: 6,
    hasPool: true,
    hasBBQ: true,
    hasLaundry: true,
    area: '900 m²',
    image: 'https://images.unsplash.com/photo-1613490908592-d503c2bb5cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Novo',
    type: 'sale'
  },
  {
    id: 4,
    title: 'Apartamento Luxuoso Neoclássico',
    description: 'Clássico luxuoso, torre única, um por andar. Planta muito bem distribuída.',
    location: 'Vila Nova Conceição, São Paulo',
    price: 'R$ 10.200.000',
    beds: 4,
    baths: 4,
    bathrooms: 5,
    garages: 4,
    hasPool: false,
    hasBBQ: false,
    hasLaundry: true,
    area: '380 m²',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Mobiliado',
    type: 'sale'
  },
  {
    id: 5,
    title: 'Apartamento Decorado para Locação',
    description: 'Imóvel pronto para morar, rico em armários, decorado por arquitetos renomados.',
    location: 'Jardins, São Paulo',
    price: 'R$ 25.000 / mês',
    beds: 2,
    baths: 2,
    bathrooms: 3,
    garages: 2,
    hasPool: false,
    hasBBQ: false,
    hasLaundry: true,
    area: '180 m²',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'Mobíliado',
    type: 'rental'
  }
];
