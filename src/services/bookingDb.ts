export interface BookingRecord {
  id: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  appointmentDate: string; // e.g. "2026-09-15"
  appointmentTime: string; // e.g. "10:00 AM"
  service: string; // e.g. "Custom Website Development"
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'webnova_bookings_store';
const SYNC_EVENT_NAME = 'webnova_bookings_updated';

/**
 * Load saved bookings from persistent local store
 */
export function getLocalBookings(): BookingRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: BookingRecord[] = JSON.parse(saved);
      return parsed.filter((b) => !b.id.startsWith('mock-'));
    }
  } catch (e) {
    console.error('Failed to parse stored bookings', e);
  }
  return [];
}

/**
 * Save bookings to persistent local store and broadcast change
 */
export function saveLocalBookings(bookings: BookingRecord[]) {
  try {
    const cleanList = bookings.filter((b) => !b.id.startsWith('mock-'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));

    // Dispatch cross-component and cross-tab update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: cleanList }));
    }
  } catch (e) {
    console.error('Failed to save bookings store', e);
  }
}

/**
 * Subscribe to bookings with real-time reactive sync across components & tabs
 */
export function subscribeToBookings(
  onUpdate: (bookings: BookingRecord[]) => void,
  _onError?: (err: any) => void
): () => void {
  // Immediately supply current state
  const initial = getLocalBookings();
  onUpdate(initial);

  const handleCustomSync = (event: Event) => {
    const customEvent = event as CustomEvent<BookingRecord[]>;
    if (customEvent.detail) {
      onUpdate(customEvent.detail);
    } else {
      onUpdate(getLocalBookings());
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onUpdate(getLocalBookings());
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(SYNC_EVENT_NAME, handleCustomSync);
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(SYNC_EVENT_NAME, handleCustomSync);
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
}

/**
 * Save new booking into local database store
 */
export async function createBookingInDb(
  bookingData: Omit<BookingRecord, 'id' | 'createdAt' | 'status'> & {
    status?: 'pending' | 'confirmed' | 'cancelled';
  }
): Promise<BookingRecord> {
  const newRecord: BookingRecord = {
    ...bookingData,
    id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: bookingData.status || 'pending',
    createdAt: new Date().toISOString(),
  };

  const existing = getLocalBookings();
  const updated = [newRecord, ...existing.filter((b) => b.id !== newRecord.id)];
  saveLocalBookings(updated);

  return newRecord;
}

/**
 * Update booking status (accept/confirm or reject/cancel)
 */
export async function updateBookingStatusInDb(
  bookingId: string,
  newStatus: 'confirmed' | 'cancelled' | 'pending',
  rejectionReason?: string
): Promise<void> {
  const updatedAt = new Date().toISOString();
  const existing = getLocalBookings();

  const updated = existing.map((b) =>
    b.id === bookingId
      ? {
          ...b,
          status: newStatus,
          rejectionReason: newStatus === 'cancelled' ? rejectionReason || b.rejectionReason : undefined,
          updatedAt,
        }
      : b
  );

  saveLocalBookings(updated);
}
