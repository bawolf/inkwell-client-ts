import type { InkwellEntity } from './types';
export interface InkwellAssignmentEntry {
    entityId: string;
    entity: InkwellEntity;
}
export interface InkwellAssignmentMap {
    [role: string]: InkwellAssignmentEntry | undefined;
}
export declare function loadAssignments(): InkwellAssignmentMap;
export declare function saveAssignments(assignments: InkwellAssignmentMap): void;
export declare function unassignRole(role: string): InkwellAssignmentMap;
export declare function assignRoleEntity(role: string, entity: InkwellEntity): InkwellAssignmentMap;
//# sourceMappingURL=assignments.d.ts.map