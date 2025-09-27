import { InkwellClient, createInkwellClient, InkwellError } from '../client';
import axios from 'axios';
import { InkwellEntity, InkwellEntityType } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InkwellClient', () => {
  let client: InkwellClient;
  const mockApiKey = 'test-api-key';
  const mockBaseUrl = 'https://api.test.com/v1';

  beforeEach(() => {
    jest.clearAllMocks();

    // Ensure isAxiosError exists as a jest fn with a safe default (false)
    mockedAxios.isAxiosError = jest.fn().mockReturnValue(false) as any;

    // Mock axios.create to return a mock instance
    const mockAxiosInstance = {
      request: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      defaults: {
        headers: {
          common: {},
        },
      },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    client = new InkwellClient({
      apiKey: mockApiKey,
      baseUrl: mockBaseUrl,
    });
  });

  describe('initialization', () => {
    it('should create client with default options', () => {
      const defaultClient = new InkwellClient();
      expect(defaultClient).toBeInstanceOf(InkwellClient);
    });

    it('should create client with custom options', () => {
      const customClient = new InkwellClient({
        apiKey: 'custom-key',
        baseUrl: 'https://custom.api.com',
        timeout: 5000,
      });
      expect(customClient).toBeInstanceOf(InkwellClient);
    });

    it('should use createInkwellClient factory function', () => {
      const factoryClient = createInkwellClient({
        apiKey: 'factory-key',
      });
      expect(factoryClient).toBeInstanceOf(InkwellClient);
    });
  });

  describe('getEntity', () => {
    const mockEntity: InkwellEntity = {
      entityId: 'test-entity-1',
      type: 'character',
      createdAt: '2023-01-01T00:00:00Z',
      author: {
        id: 'author-1',
        username: 'test-author',
      },
      promptShort: 'A test character',
      portraitAssetId: 'portrait-1',
      worldAssetId: 'world-1',
      facing: 'right',
      portraitUrl: 'https://example.com/portrait.png',
      worldUrl: 'https://example.com/world.png',
      portraitDepthGreyUrl: 'https://example.com/portrait-depth-grey.png',
      portraitDepthColorUrl: 'https://example.com/portrait-depth-color.png',
    };

    it('should get entity by ID successfully', async () => {
      const mockResponse = {
        data: mockEntity,
        status: 200,
        statusText: 'OK',
      };

      // Mock the axios instance's request method
      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.getEntity('test-entity-1');

      expect(result).toEqual(mockEntity);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/entity/test-entity-1',
      });
    });

    it('should throw InkwellError when request fails', async () => {
      const mockError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Entity not found' },
        },
      } as any;

      // Make axios.isAxiosError return true for this case
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockRejectedValue(mockError);

      try {
        await client.getEntity('nonexistent');
        fail('Expected method to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(InkwellError);
      }
    });
  });

  describe('getRandomEntity', () => {
    const mockEntity: InkwellEntity = {
      entityId: 'random-entity-1',
      type: 'item',
      createdAt: '2023-01-01T00:00:00Z',
      author: {
        id: 'author-1',
        username: 'test-author',
      },
      promptShort: 'A random item',
      worldAssetId: 'world-1',
      worldUrl: 'https://example.com/world.png',
      worldAssetIdTransparent: 'world-transparent-1',
      worldUrlTransparent: 'https://example.com/world-transparent.png',
      inventoryAssetId: 'inventory-1',
      inventoryUrl: 'https://example.com/inventory.png',
      inventoryUrlTransparent: 'https://example.com/inventory-transparent.png',
    };

    it('should get random entity without type filter', async () => {
      const mockResponse = {
        data: mockEntity,
        status: 200,
        statusText: 'OK',
      };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.getRandomEntity();

      expect(result).toEqual(mockEntity);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/entity/random',
        params: {},
      });
    });

    it('should get random entity with type filter', async () => {
      const mockResponse = {
        data: mockEntity,
        status: 200,
        statusText: 'OK',
      };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.getRandomEntity(['character', 'item']);

      expect(result).toEqual(mockEntity);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/entity/random',
        params: { types: 'characters,items' },
      });
    });
  });

  describe('entitiesByIds', () => {
    const mockEntities: InkwellEntity[] = [
      {
        entityId: 'entity-1',
        type: 'character',
        createdAt: '2023-01-01T00:00:00Z',
        author: {
          id: 'author-1',
          username: 'test-author',
        },
        promptShort: 'First entity',
        portraitAssetId: 'portrait-1',
        worldAssetId: 'world-1',
        facing: 'right',
        portraitUrl: 'https://example.com/portrait1.png',
        worldUrl: 'https://example.com/world1.png',
        portraitDepthGreyUrl: 'https://example.com/portrait1-depth-grey.png',
        portraitDepthColorUrl: 'https://example.com/portrait1-depth-color.png',
      },
      {
        entityId: 'entity-2',
        type: 'item',
        createdAt: '2023-01-01T00:00:00Z',
        author: {
          id: 'author-1',
          username: 'test-author',
        },
        promptShort: 'Second entity',
        worldAssetId: 'world-2',
        worldUrl: 'https://example.com/world2.png',
        worldAssetIdTransparent: 'world-transparent-2',
        worldUrlTransparent: 'https://example.com/world2-transparent.png',
        inventoryAssetId: 'inventory-2',
        inventoryUrl: 'https://example.com/inventory2.png',
        inventoryUrlTransparent:
          'https://example.com/inventory2-transparent.png',
      },
    ];

    it('should get multiple entities by IDs', async () => {
      const mockResponse = {
        data: { items: mockEntities },
        status: 200,
        statusText: 'OK',
      };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.entitiesByIds({
        ids: ['entity-1', 'entity-2'],
      });

      expect(result).toEqual(mockEntities);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/entities/by-ids',
        data: { ids: ['entity-1', 'entity-2'] },
      });
    });

    it('should handle object-shaped { items } response', async () => {
      const mockResponse = {
        data: { items: mockEntities },
        status: 200,
        statusText: 'OK',
      };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.entitiesByIds({
        ids: ['entity-1', 'entity-2'],
      });

      expect(result).toEqual(mockEntities);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/entities/by-ids',
        data: { ids: ['entity-1', 'entity-2'] },
      });
    });
  });

  describe('nearestByEmbedding', () => {
    const mockEntities: InkwellEntity[] = [
      {
        entityId: 'nearest-1',
        type: 'character',
        createdAt: '2023-01-01T00:00:00Z',
        author: {
          id: 'author-1',
          username: 'test-author',
        },
        promptShort: 'A nearby character',
        portraitAssetId: 'portrait-1',
        worldAssetId: 'world-1',
        facing: 'right',
        portraitUrl: 'https://example.com/portrait.png',
        worldUrl: 'https://example.com/world.png',
        portraitDepthGreyUrl: 'https://example.com/portrait-depth-grey.png',
        portraitDepthColorUrl: 'https://example.com/portrait-depth-color.png',
      },
    ];

    it('should return matches payload (faithful to API)', async () => {
      const matchesPayload = {
        model: 'test-model',
        top: 1,
        filters: ['character'],
        metadataApplied: true,
        matches: [{ entityId: 'nearest-1', distance: 0.123 }],
      };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValueOnce({
        data: matchesPayload,
        status: 200,
        statusText: 'OK',
      });

      const result = await client.nearestByEmbedding({
        embedding: [0.1, 0.2, 0.3],
        top: 1,
        types: ['character'],
      });

      expect(result).toEqual(matchesPayload);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/embedding/nearest',
        data: { embedding: [0.1, 0.2, 0.3], top: 1, types: ['character'] },
      });
    });

    it('nearestByEmbeddingEntities should resolve entities from matches payload', async () => {
      const matchesPayload = {
        matches: [{ entityId: 'nearest-1', distance: 0.123 }],
      };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValueOnce({
        data: matchesPayload,
        status: 200,
        statusText: 'OK',
      });
      mockAxiosInstance.request.mockResolvedValueOnce({
        data: { items: mockEntities },
        status: 200,
        statusText: 'OK',
      });

      const result = await client.nearestByEmbeddingEntities({
        embedding: [0.1, 0.2, 0.3],
      });

      expect(result).toEqual(mockEntities);
      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(1, {
        method: 'POST',
        url: '/embedding/nearest',
        data: { embedding: [0.1, 0.2, 0.3] },
      });
      expect(mockAxiosInstance.request).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: '/entities/by-ids',
        data: { ids: ['nearest-1'] },
      });
    });

    it('nearestByEmbeddingEntities should return empty array when matches is empty', async () => {
      const matchesPayload = { matches: [] };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValueOnce({
        data: matchesPayload,
        status: 200,
        statusText: 'OK',
      });

      const result = await client.nearestByEmbeddingEntities({
        embedding: [0.1, 0.2, 0.3],
      });

      expect(result).toEqual([]);
    });
  });

  describe('nearestFromEntityTransform', () => {
    const mockEntities: InkwellEntity[] = [
      {
        entityId: 'transformed-1',
        type: 'item',
        createdAt: '2023-01-01T00:00:00Z',
        author: {
          id: 'author-1',
          username: 'test-author',
        },
        promptShort: 'An item from transform',
        worldAssetId: 'world-1',
        worldUrl: 'https://example.com/world.png',
        worldAssetIdTransparent: 'world-transparent-1',
        worldUrlTransparent: 'https://example.com/world-transparent.png',
        inventoryAssetId: 'inventory-1',
        inventoryUrl: 'https://example.com/inventory.png',
        inventoryUrlTransparent:
          'https://example.com/inventory-transparent.png',
      },
    ];

    it('should find nearest entities from entity transform', async () => {
      const mockResponse = {
        data: { items: mockEntities },
        status: 200,
        statusText: 'OK',
      };

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.nearestFromEntityTransform({
        entityId: 'source-entity',
        targetType: 'item',
        count: 3,
      });

      expect(result).toEqual(mockEntities);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/embedding/nearest-from-entity-transform',
        data: {
          entityId: 'source-entity',
          targetType: 'item',
          count: 3,
        },
      });
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockRejectedValue(new Error('Network error'));

      await expect(client.getEntity('test')).rejects.toThrow();
    });

    it('should handle API errors with status codes', async () => {
      const mockError = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Server error' },
        },
      } as any;

      // Make axios.isAxiosError return true for this case
      (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(
        true
      );

      const mockAxiosInstance = mockedAxios.create() as any;
      mockAxiosInstance.request.mockRejectedValue(mockError);

      try {
        await client.getEntity('test');
        fail('Expected method to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(InkwellError);
        expect((error as InkwellError).status).toBe(500);
        expect((error as InkwellError).statusText).toBe(
          'Internal Server Error'
        );
      }
    });
  });
});
