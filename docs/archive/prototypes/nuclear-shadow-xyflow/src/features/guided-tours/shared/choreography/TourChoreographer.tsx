'use client';

import type { TourDefinition } from '../types/tour-definition';
import { useTourChoreographer } from './use-tour-choreographer';

export function TourChoreographer({ definition }: { definition: TourDefinition }) {
  useTourChoreographer(definition);
  return null;
}
