import type { InkwellEntity, InkwellEntityType, InkwellNearestFromEntityTransformRequest, InkwellNearestRequest, InkwellEntitiesByIdsRequest } from './types';
export interface InkwellClientOptions {
    apiKey?: string;
    baseUrl?: string;
    fetchImpl?: typeof fetch;
}
export declare class InkwellClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly fetchImpl;
    constructor(options?: InkwellClientOptions);
    private headers;
    private doJson;
    getEntity(id: string): Promise<InkwellEntity>;
    getRandomEntity(types?: InkwellEntityType[]): Promise<InkwellEntity>;
    getEmbeddingByEntityId(entityId: string): Promise<{
        embedding: number[];
        entityId: string;
    }>;
    nearestByEmbedding(req: InkwellNearestRequest): Promise<InkwellEntity[]>;
    nearestFromEntityTransform(req: InkwellNearestFromEntityTransformRequest): Promise<InkwellEntity[]>;
    entitiesByIds(req: InkwellEntitiesByIdsRequest): Promise<InkwellEntity[]>;
}
export declare function createInkwellClient(options?: InkwellClientOptions): InkwellClient;
//# sourceMappingURL=client.d.ts.map