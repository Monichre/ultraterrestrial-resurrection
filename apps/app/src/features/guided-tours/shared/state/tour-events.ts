import type {
  EvidenceId,
  EvidenceReference,
  EvidenceThreshold,
  WaypointId,
} from '../types/tour-definition';
import type { PersistedTourProgress } from '../types/tour-runtime';

export type TourEvent =
  | { type: 'TOUR_HYDRATED'; progress?: PersistedTourProgress }
  | { type: 'OVERVIEW_COMPLETED' }
  | { type: 'WAYPOINT_ARRIVAL_STARTED'; waypointId: WaypointId }
  | { type: 'WAYPOINT_ARRIVAL_COMPLETED'; waypointId: WaypointId }
  | { type: 'NARRATION_COMPLETED'; waypointId: WaypointId }
  | {
      type: 'EVIDENCE_OPENED';
      waypointId: WaypointId;
      evidenceId: EvidenceId;
      role: EvidenceReference['role'];
    }
  | { type: 'RESIDUE_ACKNOWLEDGED'; waypointId: WaypointId }
  | { type: 'NEXT_REQUESTED' }
  | {
      type: 'DEPARTURE_COMPLETED';
      from: WaypointId;
      to: WaypointId;
      transitionToken: string;
    }
  | { type: 'VISITED_WAYPOINT_REQUESTED'; waypointId: WaypointId }
  | { type: 'EVIDENCE_THRESHOLD_CHANGED'; value: EvidenceThreshold }
  | { type: 'HYPOTHESIS_LENS_CHANGED'; lens: string | null }
  | { type: 'EVIDENCE_DRAWER_OPENED'; evidenceId: EvidenceId }
  | { type: 'EVIDENCE_DRAWER_CLOSED' }
  | { type: 'USER_VIEWPORT_INTERACTION_STARTED' }
  | { type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' }
  | { type: 'REDUCED_MOTION_CHANGED'; value: boolean }
  | { type: 'TOUR_PAUSED' }
  | { type: 'TOUR_RESUMED' }
  | { type: 'TOUR_RESET' }
  | { type: 'TOUR_FAILED'; code: string; message: string };
