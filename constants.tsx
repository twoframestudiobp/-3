
import { Program, Founder } from './types';

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: '1',
    title: 'Néptánc Kicsiknek',
    description: 'Játékos mozgásfejlesztés népzenei alapokra, ahol a gyerekek megismerkedhetnek a hagyományokkal.',
    date: 'Minden kedd 16:30',
    imageUrl: 'https://picsum.photos/seed/dance1/600/400',
    category: 'Tánc'
  },
  {
    id: '2',
    title: 'Érzelmi Intelligencia Műhely',
    description: 'Biztonságos környezetben segítünk a gyermekeknek felismerni és kifejezni az érzelmeiket.',
    date: 'Minden csütörtök 17:00',
    imageUrl: 'https://picsum.photos/seed/emotion/600/400',
    category: 'Fejlesztés'
  },
  {
    id: '3',
    title: 'Kézműves Kuckó',
    description: 'Kreatív alkotó délután, ahol különféle technikákat próbálhatnak ki a gyerekek.',
    date: 'Havonta egyszer, szombat 10:00',
    imageUrl: 'https://picsum.photos/seed/art/600/400',
    category: 'Művészet'
  }
];

export const DEFAULT_FOUNDERS: { edina: Founder, zita: Founder } = {
  edina: {
    name: 'Suki Edina',
    role: 'Óvodapedagógus és néptáncpedagógus',
    description: 'Örömmel vezeti be a gyerekeket a mozgás, a tánc, a zene és a hagyományok világába. Foglalkozásai játékosak, vidámak, tele ritmussal és élményekkel.',
    phone: '+36 20 523 2799',
    image: 'https://picsum.photos/seed/edina/400/400'
  },
  zita: {
    name: 'Suki Zita',
    role: 'Óvodapedagógus, család- és gyermekvédelem szakos',
    description: 'Tudatosan figyel a gyermekek érzelmi szükségleteire. Hangsúlyt fektet arra, hogy minden gyermek egyéni tempóban bontakozhasson ki biztonságos környezetben.',
    phone: '+36 20 523 6466',
    image: 'https://picsum.photos/seed/zita/400/400'
  }
};

// Kept for backward compatibility in parts of the app that haven't been migrated to state yet
export const FOUNDERS = DEFAULT_FOUNDERS;
