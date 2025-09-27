// Main exports
export * from './types';
export * from './client';
export * from './assignments';

// Re-export commonly used items for convenience
export { InkwellClient, createInkwellClient } from './client';
export type { InkwellClientOptions } from './client';
export type { InkwellAssignmentEntry, InkwellAssignmentMap } from './assignments';
