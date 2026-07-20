import type { TourId } from '../types/tour-definition';
import type { PersistedTourProgress } from '../types/tour-runtime';

const keyFor = (tourId: TourId) => `ultraterrestrial:tour-progress:${tourId}`;

export const tourProgressRepository = {
  load(tourId: TourId): PersistedTourProgress | undefined {
    if (typeof window === 'undefined') return undefined;
    const raw = window.localStorage.getItem(keyFor(tourId));
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as PersistedTourProgress;
    } catch {
      return undefined;
    }
  },

  save(progress: PersistedTourProgress): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(keyFor(progress.tourId), JSON.stringify(progress));
  },

  clear(tourId: TourId): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(keyFor(tourId));
  },
};
