export declare const INKWELL_ENTITY_TYPES: readonly ["character", "item", "scenery", "tile", "effect", "scene"];
export type InkwellEntityType = (typeof INKWELL_ENTITY_TYPES)[number];
export interface InkwellAuthor {
    id: string;
    username: string;
}
export interface InkwellBaseEntity {
    entityId: string;
    type: InkwellEntityType;
    createdAt: string;
    author: InkwellAuthor;
    promptShort?: string;
}
export interface InkwellCharacterEntity extends InkwellBaseEntity {
    type: 'character';
    portraitAssetId: string;
    worldAssetId: string;
    facing: 'left' | 'right';
    portraitUrl: string;
    worldUrl: string;
    portraitDepthGreyUrl: string;
    portraitDepthColorUrl: string;
}
export interface InkwellSceneryEntity extends InkwellBaseEntity {
    type: 'scenery';
    worldAssetId?: string;
    worldAssetIdTransparent?: string;
    worldUrl?: string;
    worldUrlTransparent?: string;
    worldDepthGreyUrl?: string;
    worldDepthColorUrl?: string;
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256;
            height?: 64 | 128 | 256;
        };
    };
}
export interface InkwellItemEntity extends InkwellBaseEntity {
    type: 'item';
    worldAssetId: string;
    worldUrl: string;
    worldAssetIdTransparent: string;
    worldUrlTransparent: string;
    inventoryAssetId: string;
    inventoryAssetIdTransparent?: string;
    inventoryUrl: string;
    inventoryUrlTransparent: string;
}
export interface InkwellTileEntity extends InkwellBaseEntity {
    type: 'tile';
    tileAssetId: string;
    tileUrl: string;
}
export interface InkwellEffectEntity extends InkwellBaseEntity {
    type: 'effect';
    effectAssetId: string;
    effectIconAssetId: string;
    effectUrl: string;
    effectIconUrl: string;
}
export interface InkwellSceneEntity extends InkwellBaseEntity {
    type: 'scene';
    sceneAssetId: string;
    sceneUrl: string;
    sceneDepthGreyUrl: string;
    sceneDepthColorUrl: string;
}
export type InkwellEntity = InkwellCharacterEntity | InkwellItemEntity | InkwellSceneryEntity | InkwellTileEntity | InkwellEffectEntity | InkwellSceneEntity;
export interface InkwellEmbeddingResponse {
    entityId: string;
    embedding: number[];
}
export interface InkwellNearestRequest {
    embedding: number[];
    types?: Array<Exclude<InkwellEntityType, never>>;
    top?: number;
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256;
            height?: 64 | 128 | 256;
        };
    };
}
export interface InkwellNearestFromEntityTransformRequest {
    entityId: string;
    targetType: InkwellEntityType;
    count?: number;
}
export interface InkwellEntitiesByIdsRequest {
    ids: string[];
}
export declare function isCharacter(e: InkwellEntity): e is InkwellCharacterEntity;
export declare function isEffect(e: InkwellEntity): e is InkwellEffectEntity;
export declare function isItem(e: InkwellEntity): e is InkwellItemEntity;
export declare function isScenery(e: InkwellEntity): e is InkwellSceneryEntity;
export declare function isTiles(e: InkwellEntity): e is InkwellTileEntity;
export declare function isScene(e: InkwellEntity): e is InkwellSceneEntity;
//# sourceMappingURL=types.d.ts.map