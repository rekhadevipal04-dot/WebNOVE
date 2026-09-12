/**
 * Founder & CEO Photo & Profile Service
 * Manages photo persistence (localStorage with fallback) and real-time updates.
 */

export const DEFAULT_FOUNDER_INFO = {
  name: 'Anand Pal',
  role: 'Founder & CEO',
  agency: 'WEBNOVA Digital Agency',
  email: 'webnova88@gmail.com',
  phone: '+91 9519832055',
  location: 'Mumbai, Maharashtra, India',
  bio: 'Strategic tech entrepreneur leading digital growth architectures, custom web engineering, and enterprise client transformation at WEBNOVA.',
  quote:
    'At WEBNOVA, our mission is to engineer high-converting, lightning-fast digital solutions that turn ambitious businesses into undisputed market leaders.',
  defaultPhoto: '/anand-pal-default.jpg',
};

const STORAGE_KEY = 'webnova_founder_photo_url';
const UPDATE_EVENT = 'webnova_founder_photo_updated';

export function getFounderPhoto(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
  }
  return DEFAULT_FOUNDER_INFO.defaultPhoto;
}

export function saveFounderPhoto(dataUrlOrPath: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, dataUrlOrPath);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: dataUrlOrPath }));

    // Persist to server disk if it is a base64 data URL
    if (dataUrlOrPath.startsWith('data:image/')) {
      fetch('/api/save-founder-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: dataUrlOrPath }),
      }).catch((err) => {
        console.warn('Server-side photo sync note:', err);
      });
    }
  }
}

export function resetFounderPhoto(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: DEFAULT_FOUNDER_INFO.defaultPhoto }));
  }
}

export function subscribeFounderPhoto(callback: (photoUrl: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    callback(customEvent.detail || getFounderPhoto());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getFounderPhoto());
    }
  });

  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
  };
}
