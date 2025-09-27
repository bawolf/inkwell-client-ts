'use strict';

var zod = require('zod');
var axios = require('axios');
var pRetry = require('p-retry');
var debug = require('debug');

/**
 * Zod schemas for runtime validation
 */
/**
 * Available entity types in the Inkwell system
 */
const INKWELL_ENTITY_TYPES = [
    'character',
    'item',
    'scenery',
    'tile',
    'effect',
    'scene',
];
/**
 * Author information schema
 */
const InkwellAuthorSchema = zod.z.object({
    /** Unique author identifier */
    id: zod.z.string(),
    /** Author's username */
    username: zod.z.string(),
});
/**
 * Base entity schema shared by all Inkwell entities
 */
const InkwellBaseEntitySchema = zod.z.object({
    /** Unique entity identifier */
    entityId: zod.z.string(),
    /** Type of entity */
    type: zod.z.enum(INKWELL_ENTITY_TYPES),
    /** ISO timestamp when entity was created */
    createdAt: zod.z.string(),
    /** Author who created the entity */
    author: InkwellAuthorSchema,
    /** Short description/prompt for the entity */
    promptShort: zod.z.string().optional(),
});
/**
 * Character entity schema
 */
const InkwellCharacterEntitySchema = InkwellBaseEntitySchema.extend({
    type: zod.z.literal('character'),
    /** ID of the portrait asset */
    portraitAssetId: zod.z.string(),
    /** ID of the world asset (usually walking sprite sheet) */
    worldAssetId: zod.z.string(),
    /** Character facing direction */
    facing: zod.z.enum(['left', 'right']),
    /** URL to portrait image */
    portraitUrl: zod.z.string(),
    /** URL to world sprite sheet */
    worldUrl: zod.z.string(),
    /** URL to portrait depth map (greyscale) */
    portraitDepthGreyUrl: zod.z.string(),
    /** URL to portrait depth map (color) */
    portraitDepthColorUrl: zod.z.string(),
});
/**
 * Scenery entity schema
 */
const InkwellSceneryEntitySchema = InkwellBaseEntitySchema.extend({
    type: zod.z.literal('scenery'),
    /** ID of the opaque world asset */
    worldAssetId: zod.z.string().optional(),
    /** ID of the transparent world asset */
    worldAssetIdTransparent: zod.z.string().optional(),
    /** URL to opaque world image */
    worldUrl: zod.z.string().optional(),
    /** URL to transparent world image (preferred for compositing) */
    worldUrlTransparent: zod.z.string().optional(),
    /** URL to world depth map (greyscale) */
    worldDepthGreyUrl: zod.z.string().optional(),
    /** URL to world depth map (color) */
    worldDepthColorUrl: zod.z.string().optional(),
    /** Additional metadata about the scenery */
    metadata: zod.z.object({
        scenery: zod.z.object({
            /** Width of the scenery asset */
            width: zod.z.literal(64).or(zod.z.literal(128)).or(zod.z.literal(256)).optional(),
            /** Height of the scenery asset */
            height: zod.z.literal(64).or(zod.z.literal(128)).or(zod.z.literal(256)).optional(),
        }).optional(),
    }).optional(),
});
/**
 * Item entity schema
 */
const InkwellItemEntitySchema = InkwellBaseEntitySchema.extend({
    type: zod.z.literal('item'),
    /** ID of the world asset */
    worldAssetId: zod.z.string(),
    /** URL to world image */
    worldUrl: zod.z.string(),
    /** ID of the transparent world asset */
    worldAssetIdTransparent: zod.z.string(),
    /** URL to transparent world image */
    worldUrlTransparent: zod.z.string(),
    /** ID of the inventory asset */
    inventoryAssetId: zod.z.string(),
    /** ID of the transparent inventory asset */
    inventoryAssetIdTransparent: zod.z.string().optional(),
    /** URL to inventory image */
    inventoryUrl: zod.z.string(),
    /** URL to transparent inventory image */
    inventoryUrlTransparent: zod.z.string(),
});
/**
 * Tile entity schema
 */
const InkwellTileEntitySchema = InkwellBaseEntitySchema.extend({
    type: zod.z.literal('tile'),
    /** ID of the tile asset */
    tileAssetId: zod.z.string(),
    /** URL to tile image */
    tileUrl: zod.z.string(),
});
/**
 * Effect entity schema
 */
const InkwellEffectEntitySchema = InkwellBaseEntitySchema.extend({
    type: zod.z.literal('effect'),
    /** ID of the effect asset */
    effectAssetId: zod.z.string(),
    /** ID of the effect icon asset */
    effectIconAssetId: zod.z.string(),
    /** URL to effect animation/image */
    effectUrl: zod.z.string(),
    /** URL to effect icon */
    effectIconUrl: zod.z.string(),
});
/**
 * Scene entity schema
 */
const InkwellSceneEntitySchema = InkwellBaseEntitySchema.extend({
    type: zod.z.literal('scene'),
    /** ID of the scene asset */
    sceneAssetId: zod.z.string(),
    /** URL to scene image */
    sceneUrl: zod.z.string(),
    /** URL to scene depth map (greyscale) */
    sceneDepthGreyUrl: zod.z.string(),
    /** URL to scene depth map (color) */
    sceneDepthColorUrl: zod.z.string(),
});
/**
 * Union schema for all entity types
 */
const InkwellEntitySchema = zod.z.discriminatedUnion('type', [
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
const InkwellEmbeddingResponseSchema = zod.z.object({
    /** Entity ID */
    entityId: zod.z.string(),
    /** Embedding vector */
    embedding: zod.z.array(zod.z.number()),
});
/**
 * Nearest request schema
 */
const InkwellNearestRequestSchema = zod.z.object({
    /** Embedding vector to search with */
    embedding: zod.z.array(zod.z.number()),
    /** Optional entity types to filter by */
    types: zod.z.array(zod.z.enum(INKWELL_ENTITY_TYPES)).optional(),
    /** Number of results to return (default: 1) */
    top: zod.z.number().optional(),
    /** Optional metadata filters */
    metadata: zod.z.object({
        scenery: zod.z.object({
            /** Filter by scenery width */
            width: zod.z.literal(64).or(zod.z.literal(128)).or(zod.z.literal(256)).optional(),
            /** Filter by scenery height */
            height: zod.z.literal(64).or(zod.z.literal(128)).or(zod.z.literal(256)).optional(),
        }).optional(),
    }).optional(),
});
/**
 * Nearest from entity transform request schema
 */
const InkwellNearestFromEntityTransformRequestSchema = zod.z.object({
    /** Source entity ID */
    entityId: zod.z.string(),
    /** Target entity type to transform to */
    targetType: zod.z.enum(INKWELL_ENTITY_TYPES),
    /** Number of results to return (default: 1) */
    count: zod.z.number().optional(),
});
/**
 * Entities by IDs request schema
 */
const InkwellEntitiesByIdsRequestSchema = zod.z.object({
    /** Array of entity IDs to fetch */
    ids: zod.z.array(zod.z.string()),
});
/**
 * Type guard functions
 */
function isCharacter(e) {
    return e.type === 'character';
}
function isEffect(e) {
    return e.type === 'effect';
}
function isItem(e) {
    return e.type === 'item';
}
function isScenery(e) {
    return e.type === 'scenery';
}
function isTiles(e) {
    return e.type === 'tile';
}
function isScene(e) {
    return e.type === 'scene';
}

const log = debug('inkwell:client');
const DEFAULT_BASE_URL = 'https://api.inkwell.ing/v1';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRY_ATTEMPTS = 3;
/**
 * Custom error class for Inkwell API errors
 */
class InkwellError extends Error {
    constructor(message, status, statusText, response) {
        super(message);
        this.name = 'InkwellError';
        this.status = status;
        this.statusText = statusText;
        this.response = response;
    }
}
/**
 * Official Inkwell API client for JavaScript/TypeScript
 *
 * @example
 * ```typescript
 * import { createInkwellClient } from '@inkwell/client';
 *
 * const client = createInkwellClient({
 *   apiKey: 'your-api-key-here'
 * });
 *
 * const entity = await client.getEntity('entity-id');
 * ```
 */
class InkwellClient {
    constructor(options = {}) {
        this.retryAttempts = options.retryAttempts ?? DEFAULT_RETRY_ATTEMPTS;
        // Create axios instance
        this.axiosInstance = options.axiosInstance ?? axios.create({
            baseURL: options.baseUrl ?? DEFAULT_BASE_URL,
            timeout: options.timeout ?? DEFAULT_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                ...(options.apiKey && { 'x-api-key': options.apiKey }),
            },
        });
        // Add request/response interceptors
        this.setupInterceptors();
        log('InkwellClient initialized with baseURL:', this.axiosInstance.defaults.baseURL);
    }
    setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use((config) => {
            log('Making request:', config.method?.toUpperCase(), config.url);
            return config;
        }, (error) => {
            log('Request error:', error);
            return Promise.reject(error);
        });
        // Response interceptor
        this.axiosInstance.interceptors.response.use((response) => {
            log('Response received:', response.status, response.config.url);
            return response;
        }, (error) => {
            log('Response error:', error.response?.status, error.message);
            return Promise.reject(error);
        });
    }
    async makeRequest(config, schema) {
        return pRetry(async () => {
            try {
                const response = await this.axiosInstance.request(config);
                // Handle Inkwell API response format
                let data = response.data;
                if (data && typeof data === 'object' && 'ok' in data && 'data' in data) {
                    data = data.data;
                }
                // Validate response with schema if provided
                if (schema) {
                    return schema.parse(data);
                }
                return data;
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    const statusText = error.response?.statusText;
                    const responseData = error.response?.data;
                    throw new InkwellError(`Inkwell API request failed: ${status} ${statusText}`, status, statusText, responseData);
                }
                throw error;
            }
        }, {
            retries: this.retryAttempts,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 10000,
            onFailedAttempt: (error) => {
                log(`Attempt ${error.attemptNumber} failed:`, error.message);
            },
        });
    }
    /**
     * Get a specific entity by ID
     *
     * @param id - The entity ID
     * @returns Promise resolving to the entity
     * @throws {InkwellError} When the request fails
     *
     * @example
     * ```typescript
     * const entity = await client.getEntity('entity-123');
     * console.log(entity.type); // 'character', 'item', etc.
     * ```
     */
    getEntity(id) {
        return this.makeRequest({
            method: 'GET',
            url: `/entity/${encodeURIComponent(id)}`,
        }, InkwellEntitySchema);
    }
    /**
     * Get a random entity, optionally filtered by types
     *
     * @param types - Optional array of entity types to filter by
     * @returns Promise resolving to a random entity
     * @throws {InkwellError} When the request fails
     *
     * @example
     * ```typescript
     * const randomCharacter = await client.getRandomEntity(['character']);
     * const anyRandomEntity = await client.getRandomEntity();
     * ```
     */
    getRandomEntity(types) {
        const params = types && types.length ? { types: types.join(',') } : {};
        return this.makeRequest({
            method: 'GET',
            url: '/entity/random',
            params,
        }, InkwellEntitySchema);
    }
    /**
     * Get embedding vector for a specific entity
     *
     * @param entityId - The entity ID
     * @returns Promise resolving to embedding data
     * @throws {InkwellError} When the request fails
     *
     * @example
     * ```typescript
     * const embedding = await client.getEmbeddingByEntityId('entity-123');
     * console.log(embedding.embedding); // [0.1, 0.2, 0.3, ...]
     * ```
     */
    getEmbeddingByEntityId(entityId) {
        const EmbeddingResponseSchema = zod.z.object({
            embedding: zod.z.array(zod.z.number()),
            entityId: zod.z.string(),
        });
        return this.makeRequest({
            method: 'GET',
            url: `/embedding/entity/${encodeURIComponent(entityId)}`,
        }, EmbeddingResponseSchema);
    }
    /**
     * Find nearest entities by embedding vector
     *
     * @param req - The nearest request parameters
     * @returns Promise resolving to array of nearest entities
     * @throws {InkwellError} When the request fails
     *
     * @example
     * ```typescript
     * const nearest = await client.nearestByEmbedding({
     *   embedding: [0.1, 0.2, 0.3],
     *   types: ['character'],
     *   top: 5
     * });
     * ```
     */
    nearestByEmbedding(req) {
        return this.makeRequest({
            method: 'POST',
            url: '/embedding/nearest',
            data: req,
        }, zod.z.array(InkwellEntitySchema));
    }
    /**
     * Find nearest entities from entity transform
     *
     * @param req - The transform request parameters
     * @returns Promise resolving to array of nearest entities
     * @throws {InkwellError} When the request fails
     *
     * @example
     * ```typescript
     * const transformed = await client.nearestFromEntityTransform({
     *   entityId: 'character-123',
     *   targetType: 'item',
     *   count: 3
     * });
     * ```
     */
    nearestFromEntityTransform(req) {
        return this.makeRequest({
            method: 'POST',
            url: '/embedding/nearest-from-entity-transform',
            data: req,
        }, zod.z.array(InkwellEntitySchema));
    }
    /**
     * Get multiple entities by their IDs
     *
     * @param req - The request containing entity IDs
     * @returns Promise resolving to array of entities
     * @throws {InkwellError} When the request fails
     *
     * @example
     * ```typescript
     * const entities = await client.entitiesByIds({
     *   ids: ['entity-1', 'entity-2', 'entity-3']
     * });
     * ```
     */
    async entitiesByIds(req) {
        const response = await this.makeRequest({
            method: 'POST',
            url: '/entities/by-ids',
            data: req,
        }, zod.z.object({ items: zod.z.array(InkwellEntitySchema) }));
        return response.items;
    }
}
/**
 * Create a new InkwellClient instance
 *
 * @param options - Configuration options for the client
 * @returns New InkwellClient instance
 *
 * @example
 * ```typescript
 * const client = createInkwellClient({
 *   apiKey: 'your-api-key',
 *   timeout: 10000,
 *   retryAttempts: 2
 * });
 * ```
 */
function createInkwellClient(options) {
    return new InkwellClient(options);
}

exports.INKWELL_ENTITY_TYPES = INKWELL_ENTITY_TYPES;
exports.InkwellAuthorSchema = InkwellAuthorSchema;
exports.InkwellBaseEntitySchema = InkwellBaseEntitySchema;
exports.InkwellCharacterEntitySchema = InkwellCharacterEntitySchema;
exports.InkwellClient = InkwellClient;
exports.InkwellEffectEntitySchema = InkwellEffectEntitySchema;
exports.InkwellEmbeddingResponseSchema = InkwellEmbeddingResponseSchema;
exports.InkwellEntitiesByIdsRequestSchema = InkwellEntitiesByIdsRequestSchema;
exports.InkwellEntitySchema = InkwellEntitySchema;
exports.InkwellError = InkwellError;
exports.InkwellItemEntitySchema = InkwellItemEntitySchema;
exports.InkwellNearestFromEntityTransformRequestSchema = InkwellNearestFromEntityTransformRequestSchema;
exports.InkwellNearestRequestSchema = InkwellNearestRequestSchema;
exports.InkwellSceneEntitySchema = InkwellSceneEntitySchema;
exports.InkwellSceneryEntitySchema = InkwellSceneryEntitySchema;
exports.InkwellTileEntitySchema = InkwellTileEntitySchema;
exports.createInkwellClient = createInkwellClient;
exports.isCharacter = isCharacter;
exports.isEffect = isEffect;
exports.isItem = isItem;
exports.isScene = isScene;
exports.isScenery = isScenery;
exports.isTiles = isTiles;
//# sourceMappingURL=index.js.map
