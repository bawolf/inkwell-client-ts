import axios from 'axios';
import { z } from 'zod';
import pRetry from 'p-retry';
import debug from 'debug';
import { InkwellEntitySchema, } from './types';
const log = debug('inkwell:client');
const DEFAULT_BASE_URL = 'https://api.inkwell.ing/v1';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRY_ATTEMPTS = 3;
/**
 * Custom error class for Inkwell API errors
 */
export class InkwellError extends Error {
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
export class InkwellClient {
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
        const EmbeddingResponseSchema = z.object({
            embedding: z.array(z.number()),
            entityId: z.string(),
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
        }, z.array(InkwellEntitySchema));
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
        }, z.array(InkwellEntitySchema));
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
        }, z.object({ items: z.array(InkwellEntitySchema) }));
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
export function createInkwellClient(options) {
    return new InkwellClient(options);
}
//# sourceMappingURL=client.js.map