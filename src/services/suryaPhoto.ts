/**
 * Co-Founder & Director Surya Pal Photo & Profile Service
 * Manages photo persistence (localStorage with fallback) and real-time updates.
 */

import { SURYA_PAL_PHOTO_DATA_URL } from '../data/suryaPalPhoto.ts';

export const DEFAULT_SURYA_INFO = {
  name: 'Surya Pal',
  fullName: 'Suryapartap Pal',
  role: 'Co-Founder & Executive Director',
  agency: 'WEBNOVA Digital Agency',
  email: 'webnova88@gmail.com',
  phone: '+91 9519832055',
  location: 'Mumbai, Maharashtra, India',
  bio: 'Strategic director and product architect leading high-performance e-commerce engines, web solutions, and operational excellence at WEBNOVA.',
  quote:
    'At WEBNOVA, engineering excellence and client trust are at the heart of everything we build. We architect scalable digital assets that empower businesses to scale relentlessly in the modern digital economy.',
  defaultPhoto: SURYA_PAL_PHOTO_DATA_URL,
};

const STORAGE_KEY = 'webnova_surya_photo_url';
const UPDATE_EVENT = 'webnova_surya_photo_updated';

export function getSuryaPhoto(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved.startsWith('data:image/') || saved.startsWith('http') || saved.startsWith('/'))) {
      return saved;
    }
  }
  return DEFAULT_SURYA_INFO.defaultPhoto;
}

export function saveSuryaPhoto(dataUrlOrPath: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, dataUrlOrPath);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: dataUrlOrPath }));
  }
}

export function resetSuryaPhoto(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: DEFAULT_SURYA_INFO.defaultPhoto }));
  }
}

export function subscribeSuryaPhoto(callback: (photoUrl: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    callback(customEvent.detail || getSuryaPhoto());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getSuryaPhoto());
    }
  });

  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
  };
}
