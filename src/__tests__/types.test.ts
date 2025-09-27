import {
  InkwellEntitySchema,
  InkwellNearestRequestSchema,
  InkwellNearestFromEntityTransformRequestSchema,
  InkwellEntitiesByIdsRequestSchema,
  InkwellEmbeddingResponseSchema,
} from '../types';

describe('Type Schemas', () => {
  describe('InkwellEntitySchema', () => {
    const validEntity = {
      entityId: 'test-entity',
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

    it('should validate a valid entity', () => {
      const result = InkwellEntitySchema.safeParse(validEntity);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validEntity);
      }
    });

    it('should reject entity with missing required fields', () => {
      const invalidEntity = { ...validEntity };
      delete invalidEntity.entityId;

      const result = InkwellEntitySchema.safeParse(invalidEntity);
      expect(result.success).toBe(false);
    });

    it('should reject entity with invalid type', () => {
      const invalidEntity = { ...validEntity, type: 'invalid-type' };

      const result = InkwellEntitySchema.safeParse(invalidEntity);
      expect(result.success).toBe(false);
    });

    it('should reject entity with invalid facing direction', () => {
      const invalidEntity = { ...validEntity, facing: 'invalid-direction' };

      const result = InkwellEntitySchema.safeParse(invalidEntity);
      expect(result.success).toBe(false);
    });
  });

  describe('InkwellNearestRequestSchema', () => {
    const validRequest = {
      embedding: [0.1, 0.2, 0.3],
      top: 5,
      types: ['character', 'item'],
    };

    it('should validate a valid nearest request', () => {
      const result = InkwellNearestRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should validate request without optional fields', () => {
      const minimalRequest = {
        embedding: [0.1, 0.2, 0.3],
      };

      const result = InkwellNearestRequestSchema.safeParse(minimalRequest);
      expect(result.success).toBe(true);
    });

    it('should reject request with invalid embedding', () => {
      const invalidRequest = { ...validRequest, embedding: 'not-an-array' };

      const result = InkwellNearestRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('InkwellNearestFromEntityTransformRequestSchema', () => {
    const validRequest = {
      entityId: 'source-entity',
      targetType: 'item',
      count: 3,
    };

    it('should validate a valid transform request', () => {
      const result =
        InkwellNearestFromEntityTransformRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject request with missing entityId', () => {
      const invalidRequest = { ...validRequest };
      delete invalidRequest.entityId;

      const result =
        InkwellNearestFromEntityTransformRequestSchema.safeParse(
          invalidRequest
        );
      expect(result.success).toBe(false);
    });

    it('should reject request with invalid targetType', () => {
      const invalidRequest = { ...validRequest, targetType: 'invalid-type' };

      const result =
        InkwellNearestFromEntityTransformRequestSchema.safeParse(
          invalidRequest
        );
      expect(result.success).toBe(false);
    });
  });

  describe('InkwellEntitiesByIdsRequestSchema', () => {
    const validRequest = {
      ids: ['entity-1', 'entity-2', 'entity-3'],
    };

    it('should validate a valid entities by IDs request', () => {
      const result = InkwellEntitiesByIdsRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject request with non-string IDs', () => {
      const invalidRequest = { ids: [123, 456] };

      const result =
        InkwellEntitiesByIdsRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('InkwellEmbeddingResponseSchema', () => {
    const validResponse = {
      entityId: 'test-entity',
      embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
    };

    it('should validate a valid embedding response', () => {
      const result = InkwellEmbeddingResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject response with invalid embedding format', () => {
      const invalidResponse = { embedding: 'not-an-array' };

      const result = InkwellEmbeddingResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });
});
