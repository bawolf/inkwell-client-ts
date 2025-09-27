import { AxiosInstance } from 'axios';
import type { InkwellEntity, InkwellEntityType, InkwellNearestFromEntityTransformRequest, InkwellNearestRequest, InkwellEntitiesByIdsRequest } from './types';
/**
 * Configuration options for the InkwellClient
 */
export interface InkwellClientOptions {
    /** API key for authentication */
    apiKey?: string;
    /** Base URL for the Inkwell API */
    baseUrl?: string;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Number of retry attempts for failed requests */
    retryAttempts?: number;
    /** Custom axios instance */
    axiosInstance?: AxiosInstance;
}
/**
 * Custom error class for Inkwell API errors
 */
export declare class InkwellError extends Error {
    readonly status?: number;
    readonly statusText?: string;
    readonly response?: any;
    constructor(message: string, status?: number, statusText?: string, response?: any);
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
export declare class InkwellClient {
    private readonly axiosInstance;
    private readonly retryAttempts;
    constructor(options?: InkwellClientOptions);
    private setupInterceptors;
    private makeRequest;
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
    getEntity(id: string): Promise<InkwellEntity>;
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
    getRandomEntity(types?: InkwellEntityType[]): Promise<InkwellEntity>;
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
    getEmbeddingByEntityId(entityId: string): Promise<{
        embedding: number[];
        entityId: string;
    }>;
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
    nearestByEmbedding(req: InkwellNearestRequest): Promise<InkwellEntity[]>;
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
    nearestFromEntityTransform(req: InkwellNearestFromEntityTransformRequest): Promise<InkwellEntity[]>;
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
    entitiesByIds(req: InkwellEntitiesByIdsRequest): Promise<InkwellEntity[]>;
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
export declare function createInkwellClient(options?: InkwellClientOptions): InkwellClient;
//# sourceMappingURL=client.d.ts.map