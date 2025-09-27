import type { InkwellEntity } from './types';

export interface InkwellAssignmentEntry {
  entityId: string;
  entity: InkwellEntity;
}

export interface InkwellAssignmentMap {
  // map role -> assigned entity object only
  [role: string]: InkwellAssignmentEntry | undefined;
}

const STORAGE_KEY = 'inkwell.assignments.v1';

export function loadAssignments(): InkwellAssignmentMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const cleaned: InkwellAssignmentMap = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (v && typeof v === 'object' && 'entityId' in v && 'entity' in v) {
          cleaned[k] = v as InkwellAssignmentEntry;
        }
      }
      return cleaned;
    }
  } catch {}
  return {};
}

export function saveAssignments(assignments: InkwellAssignmentMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch {}
}

export function unassignRole(role: string): InkwellAssignmentMap {
  const current = loadAssignments();
  delete current[role];
  saveAssignments(current);
  return current;
}

export function assignRoleEntity(
  role: string,
  entity: InkwellEntity
): InkwellAssignmentMap {
  const current = loadAssignments();
  current[role] = { entityId: entity.entityId, entity };
  saveAssignments(current);
  return current;
}
