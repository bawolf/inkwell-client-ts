import { z } from 'zod';

/**
 * Zod schemas for runtime validation
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
 * Author information schema
 */
export const InkwellAuthorSchema = z.object({
  /** Unique author identifier */
  id: z.string(),
  /** Author's username */
  username: z.string(),
});

/**
 * Base entity schema shared by all Inkwell entities
 */
export const InkwellBaseEntitySchema = z.object({
  /** Unique entity identifier */
  entityId: z.string(),
  /** Type of entity */
  type: z.enum(INKWELL_ENTITY_TYPES),
  /** ISO timestamp when entity was created */
  createdAt: z.string(),
  /** Author who created the entity */
  author: InkwellAuthorSchema,
  /** Short description/prompt for the entity */
  promptShort: z.string().optional(),
});

/**
 * Character entity schema
 */
export const InkwellCharacterEntitySchema = InkwellBaseEntitySchema.extend({
  type: z.literal('character'),
  /** ID of the portrait asset */
  portraitAssetId: z.string(),
  /** ID of the world asset (usually walking sprite sheet) */
  worldAssetId: z.string(),
  /** Character facing direction */
  facing: z.enum(['left', 'right']),
  /** URL to portrait image */
  portraitUrl: z.string(),
  /** URL to world sprite sheet */
  worldUrl: z.string(),
  /** URL to portrait depth map (greyscale) */
  portraitDepthGreyUrl: z.string(),
  /** URL to portrait depth map (color) */
  portraitDepthColorUrl: z.string(),
});

/**
 * Scenery entity schema
 */
export const InkwellSceneryEntitySchema = InkwellBaseEntitySchema.extend({
  type: z.literal('scenery'),
  /** ID of the opaque world asset */
  worldAssetId: z.string().optional(),
  /** ID of the transparent world asset */
  worldAssetIdTransparent: z.string().optional(),
  /** URL to opaque world image */
  worldUrl: z.string().optional(),
  /** URL to transparent world image (preferred for compositing) */
  worldUrlTransparent: z.string().optional(),
  /** URL to world depth map (greyscale) */
  worldDepthGreyUrl: z.string().optional(),
  /** URL to world depth map (color) */
  worldDepthColorUrl: z.string().optional(),
  /** Additional metadata about the scenery */
  metadata: z
    .object({
      scenery: z
        .object({
          /** Width of the scenery asset */
          width: z.literal(64).or(z.literal(128)).or(z.literal(256)).optional(),
          /** Height of the scenery asset */
          height: z
            .literal(64)
            .or(z.literal(128))
            .or(z.literal(256))
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Item entity schema
 */
export const InkwellItemEntitySchema = InkwellBaseEntitySchema.extend({
  type: z.literal('item'),
  /** ID of the world asset */
  worldAssetId: z.string(),
  /** URL to world image */
  worldUrl: z.string(),
  /** ID of the transparent world asset */
  worldAssetIdTransparent: z.string(),
  /** URL to transparent world image */
  worldUrlTransparent: z.string(),
  /** ID of the inventory asset */
  inventoryAssetId: z.string(),
  /** ID of the transparent inventory asset */
  inventoryAssetIdTransparent: z.string().optional(),
  /** URL to inventory image */
  inventoryUrl: z.string(),
  /** URL to transparent inventory image */
  inventoryUrlTransparent: z.string(),
});

/**
 * Tile entity schema
 */
export const InkwellTileEntitySchema = InkwellBaseEntitySchema.extend({
  type: z.literal('tile'),
  /** ID of the tile asset */
  tileAssetId: z.string(),
  /** URL to tile image */
  tileUrl: z.string(),
});

/**
 * Effect entity schema
 */
export const InkwellEffectEntitySchema = InkwellBaseEntitySchema.extend({
  type: z.literal('effect'),
  /** ID of the effect asset */
  effectAssetId: z.string(),
  /** ID of the effect icon asset */
  effectIconAssetId: z.string(),
  /** URL to effect animation/image */
  effectUrl: z.string(),
  /** URL to effect icon */
  effectIconUrl: z.string(),
});

/**
 * Scene entity schema
 */
export const InkwellSceneEntitySchema = InkwellBaseEntitySchema.extend({
  type: z.literal('scene'),
  /** ID of the scene asset */
  sceneAssetId: z.string(),
  /** URL to scene image */
  sceneUrl: z.string(),
  /** URL to scene depth map (greyscale) */
  sceneDepthGreyUrl: z.string(),
  /** URL to scene depth map (color) */
  sceneDepthColorUrl: z.string(),
});

/**
 * Union schema for all entity types
 */
export const InkwellEntitySchema = z.discriminatedUnion('type', [
  InkwellCharacterEntitySchema,
  InkwellItemEntitySchema,
  InkwellSceneryEntitySchema,
  InkwellTileEntitySchema,
  InkwellEffectEntitySchema,
  InkwellSceneEntitySchema,
]);

/**
 * Embedding response schema
 */
export const InkwellEmbeddingResponseSchema = z.object({
  /** Entity ID */
  entityId: z.string(),
  /** Embedding vector */
  embedding: z.array(z.number()),
});

/**
 * Nearest request schema
 */
export const InkwellNearestRequestSchema = z.object({
  /** Embedding vector to search with */
  embedding: z.array(z.number()),
  /** Optional entity types to filter by */
  types: z.array(z.enum(INKWELL_ENTITY_TYPES)).optional(),
  /** Number of results to return (default: 1) */
  top: z.number().optional(),
  /** Optional metadata filters */
  metadata: z
    .object({
      scenery: z
        .object({
          /** Filter by scenery width */
          width: z.literal(64).or(z.literal(128)).or(z.literal(256)).optional(),
          /** Filter by scenery height */
          height: z
            .literal(64)
            .or(z.literal(128))
            .or(z.literal(256))
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Nearest from entity transform request schema
 */
export const InkwellNearestFromEntityTransformRequestSchema = z.object({
  /** Source entity ID */
  entityId: z.string(),
  /** Target entity type to transform to */
  targetType: z.enum(INKWELL_ENTITY_TYPES),
  /** Number of results to return (default: 1) */
  count: z.number().optional(),
});

/**
 * Entities by IDs request schema
 */
export const InkwellEntitiesByIdsRequestSchema = z.object({
  /** Array of entity IDs to fetch */
  ids: z.array(z.string()),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type InkwellEntityType = z.infer<typeof InkwellBaseEntitySchema>['type'];
export type InkwellAuthor = z.infer<typeof InkwellAuthorSchema>;
export type InkwellBaseEntity = z.infer<typeof InkwellBaseEntitySchema>;
export type InkwellCharacterEntity = z.infer<
  typeof InkwellCharacterEntitySchema
>;
export type InkwellSceneryEntity = z.infer<typeof InkwellSceneryEntitySchema>;
export type InkwellItemEntity = z.infer<typeof InkwellItemEntitySchema>;
export type InkwellTileEntity = z.infer<typeof InkwellTileEntitySchema>;
export type InkwellEffectEntity = z.infer<typeof InkwellEffectEntitySchema>;
export type InkwellSceneEntity = z.infer<typeof InkwellSceneEntitySchema>;
export type InkwellEntity = z.infer<typeof InkwellEntitySchema>;
export type InkwellEmbeddingResponse = z.infer<
  typeof InkwellEmbeddingResponseSchema
>;
export type InkwellNearestRequest = z.infer<typeof InkwellNearestRequestSchema>;
export type InkwellNearestFromEntityTransformRequest = z.infer<
  typeof InkwellNearestFromEntityTransformRequestSchema
>;
export type InkwellEntitiesByIdsRequest = z.infer<
  typeof InkwellEntitiesByIdsRequestSchema
>;

/**
 * Type guard functions
 */
export function isCharacter(e: InkwellEntity): e is InkwellCharacterEntity {
  return e.type === 'character';
}

export function isEffect(e: InkwellEntity): e is InkwellEffectEntity {
  return e.type === 'effect';
}

export function isItem(e: InkwellEntity): e is InkwellItemEntity {
  return e.type === 'item';
}

export function isScenery(e: InkwellEntity): e is InkwellSceneryEntity {
  return e.type === 'scenery';
}

export function isTiles(e: InkwellEntity): e is InkwellTileEntity {
  return e.type === 'tile';
}

export function isScene(e: InkwellEntity): e is InkwellSceneEntity {
  return e.type === 'scene';
}
