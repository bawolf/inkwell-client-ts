/**
 * Inkwell public API types based on shared docs and samples
 */

/**
 * Available entity types in the Inkwell system
 */
export const INKWELL_ENTITY_TYPES = [
  'character',
  'item',
  'scenery',
  'tile',
  'effect',
  'scene',
] as const;

/**
 * Type representing all possible Inkwell entity types
 */
export type InkwellEntityType = (typeof INKWELL_ENTITY_TYPES)[number];

/**
 * Author information for Inkwell entities
 */
export interface InkwellAuthor {
  /** Unique author identifier */
  id: string;
  /** Author's username */
  username: string;
}

/**
 * Base properties shared by all Inkwell entities
 */
export interface InkwellBaseEntity {
  /** Unique entity identifier */
  entityId: string;
  /** Type of entity */
  type: InkwellEntityType;
  /** ISO timestamp when entity was created */
  createdAt: string;
  /** Author who created the entity */
  author: InkwellAuthor;
  /** Short description/prompt for the entity */
  promptShort?: string;
}

/**
 * Character entity with portrait and world assets
 */
export interface InkwellCharacterEntity extends InkwellBaseEntity {
  type: 'character';
  /** ID of the portrait asset */
  portraitAssetId: string;
  /** ID of the world asset (usually walking sprite sheet) */
  worldAssetId: string;
  /** Character facing direction */
  facing: 'left' | 'right';
  /** URL to portrait image */
  portraitUrl: string;
  /** URL to world sprite sheet */
  worldUrl: string;
  /** URL to portrait depth map (greyscale) */
  portraitDepthGreyUrl: string;
  /** URL to portrait depth map (color) */
  portraitDepthColorUrl: string;
}

/**
 * Scenery entity for background elements
 */
export interface InkwellSceneryEntity extends InkwellBaseEntity {
  type: 'scenery';
  /** ID of the opaque world asset */
  worldAssetId?: string;
  /** ID of the transparent world asset */
  worldAssetIdTransparent?: string;
  /** URL to opaque world image */
  worldUrl?: string;
  /** URL to transparent world image (preferred for compositing) */
  worldUrlTransparent?: string;
  /** URL to world depth map (greyscale) */
  worldDepthGreyUrl?: string;
  /** URL to world depth map (color) */
  worldDepthColorUrl?: string;
  /** Additional metadata about the scenery */
  metadata?: {
    scenery?: {
      /** Width of the scenery asset */
      width?: 64 | 128 | 256;
      /** Height of the scenery asset */
      height?: 64 | 128 | 256;
    };
  };
}

/**
 * Item entity for collectible objects
 */
export interface InkwellItemEntity extends InkwellBaseEntity {
  type: 'item';
  /** ID of the world asset */
  worldAssetId: string;
  /** URL to world image */
  worldUrl: string;
  /** ID of the transparent world asset */
  worldAssetIdTransparent: string;
  /** URL to transparent world image */
  worldUrlTransparent: string;
  /** ID of the inventory asset */
  inventoryAssetId: string;
  /** ID of the transparent inventory asset */
  inventoryAssetIdTransparent?: string;
  /** URL to inventory image */
  inventoryUrl: string;
  /** URL to transparent inventory image */
  inventoryUrlTransparent: string;
}

/**
 * Tile entity for level geometry
 */
export interface InkwellTileEntity extends InkwellBaseEntity {
  type: 'tile';
  /** ID of the tile asset */
  tileAssetId: string;
  /** URL to tile image */
  tileUrl: string;
}

/**
 * Effect entity for visual effects
 */
export interface InkwellEffectEntity extends InkwellBaseEntity {
  type: 'effect';
  /** ID of the effect asset */
  effectAssetId: string;
  /** ID of the effect icon asset */
  effectIconAssetId: string;
  /** URL to effect animation/image */
  effectUrl: string;
  /** URL to effect icon */
  effectIconUrl: string;
}

/**
 * Scene entity for background scenes
 */
export interface InkwellSceneEntity extends InkwellBaseEntity {
  type: 'scene';
  /** ID of the scene asset */
  sceneAssetId: string;
  /** URL to scene image */
  sceneUrl: string;
  /** URL to scene depth map (greyscale) */
  sceneDepthGreyUrl: string;
  /** URL to scene depth map (color) */
  sceneDepthColorUrl: string;
}

/**
 * Union type of all possible Inkwell entities
 */
export type InkwellEntity =
  | InkwellCharacterEntity
  | InkwellItemEntity
  | InkwellSceneryEntity
  | InkwellTileEntity
  | InkwellEffectEntity
  | InkwellSceneEntity;

/**
 * Response containing embedding data for an entity
 */
export interface InkwellEmbeddingResponse {
  /** Entity ID */
  entityId: string;
  /** Embedding vector */
  embedding: number[];
}

/**
 * Request parameters for finding nearest entities by embedding
 */
export interface InkwellNearestRequest {
  /** Embedding vector to search with */
  embedding: number[];
  /** Optional entity types to filter by */
  types?: Array<Exclude<InkwellEntityType, never>>;
  /** Number of results to return (default: 1) */
  top?: number;
  /** Optional metadata filters */
  metadata?: {
    scenery?: {
      /** Filter by scenery width */
      width?: 64 | 128 | 256;
      /** Filter by scenery height */
      height?: 64 | 128 | 256;
    };
  };
}

/**
 * Request parameters for finding nearest entities from entity transform
 */
export interface InkwellNearestFromEntityTransformRequest {
  /** Source entity ID */
  entityId: string;
  /** Target entity type to transform to */
  targetType: InkwellEntityType;
  /** Number of results to return (default: 1) */
  count?: number;
}

/**
 * Request parameters for getting multiple entities by IDs
 */
export interface InkwellEntitiesByIdsRequest {
  /** Array of entity IDs to fetch */
  ids: string[];
}

/**
 * Type guard to check if an entity is a character
 * @param e - Entity to check
 * @returns True if entity is a character
 */
export function isCharacter(e: InkwellEntity): e is InkwellCharacterEntity {
  return e.type === 'character';
}

/**
 * Type guard to check if an entity is an effect
 * @param e - Entity to check
 * @returns True if entity is an effect
 */
export function isEffect(e: InkwellEntity): e is InkwellEffectEntity {
  return e.type === 'effect';
}

/**
 * Type guard to check if an entity is an item
 * @param e - Entity to check
 * @returns True if entity is an item
 */
export function isItem(e: InkwellEntity): e is InkwellItemEntity {
  return e.type === 'item';
}

/**
 * Type guard to check if an entity is scenery
 * @param e - Entity to check
 * @returns True if entity is scenery
 */
export function isScenery(e: InkwellEntity): e is InkwellSceneryEntity {
  return e.type === 'scenery';
}

/**
 * Type guard to check if an entity is a tile
 * @param e - Entity to check
 * @returns True if entity is a tile
 */
export function isTiles(e: InkwellEntity): e is InkwellTileEntity {
  return e.type === 'tile';
}

/**
 * Type guard to check if an entity is a scene
 * @param e - Entity to check
 * @returns True if entity is a scene
 */
export function isScene(e: InkwellEntity): e is InkwellSceneEntity {
  return e.type === 'scene';
}