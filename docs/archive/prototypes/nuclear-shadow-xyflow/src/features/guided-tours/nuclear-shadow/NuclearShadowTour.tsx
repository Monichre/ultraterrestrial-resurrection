'use client';

import { useEffect, useRef } from 'react';
import { TourFlowCanvas } from '../shared/components/TourFlowCanvas';
import { useTourStore } from '../shared/state/tour-store';
import { tourProgressRepository } from '../shared/persistence/tour-progress.repository';
import { serializeProgress } from '../shared/persistence/tour-progress.serializer';
import { nuclearShadowDefinition } from './nuclear-shadow.definition';
import { validateTourDefinition } from '../shared/graph/validate-tour-definition';

export function NuclearShadowTour() {
  const loadDefinition = useTourStore((state) => state.loadDefinition);
  const runtime = useTourStore((state) => state.runtime);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const validation = validateTourDefinition(nuclearShadowDefinition);
    if (!validation.valid) {
      throw new Error(`Invalid Nuclear Shadow definition:\n${validation.errors.join('\n')}`);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const persisted = tourProgressRepository.load(nuclearShadowDefinition.id);
    loadDefinition(nuclearShadowDefinition, persisted, reducedMotion);
  }, [loadDefinition]);

  useEffect(() => {
    if (!runtime?.hydrated) return;
    const progress = serializeProgress(runtime);
    if (progress) tourProgressRepository.save(progress);
  }, [runtime]);

  return <TourFlowCanvas definition={nuclearShadowDefinition} />;
}
