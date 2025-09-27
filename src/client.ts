import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { z } from 'zod';
import pRetry from 'p-retry';
import debug from 'debug';
import type {
  InkwellEntity,
  InkwellEntityType,
  InkwellNearestFromEntityTransformRequest,
  InkwellNearestRequest,
  InkwellEntitiesByIdsRequest,
} from './types';

const log = debug('inkwell:client');

const DEFAULT_BASE_URL = 'https://api.inkwell.ing/v1';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRY_ATTEMPTS = 3;

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
export class InkwellError extends Error {
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly response?: any;

  constructor(message: string, status?: number, statusText?: string, response?: any) {
    super(message);
    this.name = 'InkwellError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

// Zod schemas for runtime validation
const InkwellAuthorSchema = z.object({
  id: z.string(),
  username: z.string(),
});

const InkwellBaseEntitySchema = z.object({
  entityId: z.string(),
  type: z.enum(['character', 'item', 'scenery', 'tile', 'effect', 'scene']),
  createdAt: z.string(),
  author: InkwellAuthorSchema,
  promptShort: z.string().optional(),
});

const InkwellCharacterEntitySchema = InkwellBaseEntitySchema.extend({
  type: z.literal('character'),
  portraitAssetId: z.string(),
  worldAssetId: z.string(),
  facing: z.enum(['left', 'right']),
  portraitUrl: z.string(),
  worldUrl: z.string(),
  portraitDepthGreyUrl: z.string(),
  portraitDepthColorUrl: z.string(),
});

const InkwellEntitySchema: z.ZodType<InkwellEntity> = z.discriminatedUnion('type', [
  InkwellCharacterEntitySchema,
  InkwellBaseEntitySchema.extend({
    type: z.literal('item'),
    worldAssetId: z.string(),
    worldUrl: z.string(),
    worldAssetIdTransparent: z.string(),
    worldUrlTransparent: z.string(),
    inventoryAssetId: z.string(),
    inventoryAssetIdTransparent: z.string().optional(),
    inventoryUrl: z.string(),
    inventoryUrlTransparent: z.string(),
  }),
  InkwellBaseEntitySchema.extend({
    type: z.literal('scenery'),
    worldAssetId: z.string().optional(),
    worldAssetIdTransparent: z.string().optional(),
    worldUrl: z.string().optional(),
    worldUrlTransparent: z.string().optional(),
    worldDepthGreyUrl: z.string().optional(),
    worldDepthColorUrl: z.string().optional(),
    metadata: z.object({
      scenery: z.object({
        width: z.enum([64, 128, 256]).optional(),
        height: z.enum([64, 128, 256]).optional(),
      }).optional(),
    }).optional(),
  }),
  InkwellBaseEntitySchema.extend({
    type: z.literal('tile'),
    tileAssetId: z.string(),
    tileUrl: z.string(),
  }),
  InkwellBaseEntitySchema.extend({
    type: z.literal('effect'),
    effectAssetId: z.string(),
    effectIconAssetId: z.string(),
    effectUrl: z.string(),
    effectIconUrl: z.string(),
  }),
  InkwellBaseEntitySchema.extend({
    type: z.literal('scene'),
    sceneAssetId: z.string(),
    sceneUrl: z.string(),
    sceneDepthGreyUrl: z.string(),
    sceneDepthColorUrl: z.string(),
  }),
]);

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
  private readonly axiosInstance: AxiosInstance;
  private readonly retryAttempts: number;

  constructor(options: InkwellClientOptions = {}) {
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

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        log('Making request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        log('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        log('Response received:', response.status, response.config.url);
        return response;
      },
      (error) => {
        log('Response error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  private async makeRequest<T>(
    config: AxiosRequestConfig,
    schema?: z.ZodType<T>
  ): Promise<T> {
    return pRetry(
      async () => {
        try {
          const response: AxiosResponse = await this.axiosInstance.request(config);
          
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
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const statusText = error.response?.statusText;
            const responseData = error.response?.data;
            
            throw new InkwellError(
              `Inkwell API request failed: ${status} ${statusText}`,
              status,
              statusText,
              responseData
            );
          }
          throw error;
        }
      },
      {
        retries: this.retryAttempts,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 10000,
        onFailedAttempt: (error) => {
          log(`Attempt ${error.attemptNumber} failed:`, error.message);
        },
      }
    );
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
  getEntity(id: string): Promise<InkwellEntity> {
    return this.makeRequest(
      {
        method: 'GET',
        url: `/entity/${encodeURIComponent(id)}`,
      },
      InkwellEntitySchema
    );
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
  getRandomEntity(types?: InkwellEntityType[]): Promise<InkwellEntity> {
    const params = types && types.length ? { types: types.join(',') } : {};
    
    return this.makeRequest(
      {
        method: 'GET',
        url: '/entity/random',
        params,
      },
      InkwellEntitySchema
    );
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
  getEmbeddingByEntityId(
    entityId: string
  ): Promise<{ embedding: number[]; entityId: string }> {
    const EmbeddingResponseSchema = z.object({
      embedding: z.array(z.number()),
      entityId: z.string(),
    });

    return this.makeRequest(
      {
        method: 'GET',
        url: `/embedding/entity/${encodeURIComponent(entityId)}`,
      },
      EmbeddingResponseSchema
    );
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
  nearestByEmbedding(req: InkwellNearestRequest): Promise<InkwellEntity[]> {
    return this.makeRequest(
      {
        method: 'POST',
        url: '/embedding/nearest',
        data: req,
      },
      z.array(InkwellEntitySchema)
    );
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
  nearestFromEntityTransform(
    req: InkwellNearestFromEntityTransformRequest
  ): Promise<InkwellEntity[]> {
    return this.makeRequest(
      {
        method: 'POST',
        url: '/embedding/nearest-from-entity-transform',
        data: req,
      },
      z.array(InkwellEntitySchema)
    );
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
  async entitiesByIds(req: InkwellEntitiesByIdsRequest): Promise<InkwellEntity[]> {
    const response = await this.makeRequest<{ items: InkwellEntity[] }>(
      {
        method: 'POST',
        url: '/entities/by-ids',
        data: req,
      },
      z.object({ items: z.array(InkwellEntitySchema) })
    );
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
export function createInkwellClient(options?: InkwellClientOptions): InkwellClient {
  return new InkwellClient(options);
}