import { z } from 'zod';
/**
 * Zod schemas for runtime validation
 */
/**
 * Available entity types in the Inkwell system
 */
export declare const INKWELL_ENTITY_TYPES: readonly ["character", "item", "scenery", "tile", "effect", "scene"];
/**
 * Author information schema
 */
export declare const InkwellAuthorSchema: z.ZodObject<{
    /** Unique author identifier */
    id: z.ZodString;
    /** Author's username */
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    username: string;
}, {
    id: string;
    username: string;
}>;
/**
 * Base entity schema shared by all Inkwell entities
 */
export declare const InkwellBaseEntitySchema: z.ZodObject<{
    /** Unique entity identifier */
    entityId: z.ZodString;
    /** Type of entity */
    type: z.ZodEnum<["character", "item", "scenery", "tile", "effect", "scene"]>;
    /** ISO timestamp when entity was created */
    createdAt: z.ZodString;
    /** Author who created the entity */
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    /** Short description/prompt for the entity */
    promptShort: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "character" | "item" | "scenery" | "tile" | "effect" | "scene";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    promptShort?: string | undefined;
}, {
    type: "character" | "item" | "scenery" | "tile" | "effect" | "scene";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    promptShort?: string | undefined;
}>;
/**
 * Character entity schema
 */
export declare const InkwellCharacterEntitySchema: z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"character">;
    portraitAssetId: z.ZodString;
    worldAssetId: z.ZodString;
    facing: z.ZodEnum<["left", "right"]>;
    portraitUrl: z.ZodString;
    worldUrl: z.ZodString;
    portraitDepthGreyUrl: z.ZodString;
    portraitDepthColorUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "character";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    portraitAssetId: string;
    worldAssetId: string;
    facing: "left" | "right";
    portraitUrl: string;
    worldUrl: string;
    portraitDepthGreyUrl: string;
    portraitDepthColorUrl: string;
    promptShort?: string | undefined;
}, {
    type: "character";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    portraitAssetId: string;
    worldAssetId: string;
    facing: "left" | "right";
    portraitUrl: string;
    worldUrl: string;
    portraitDepthGreyUrl: string;
    portraitDepthColorUrl: string;
    promptShort?: string | undefined;
}>;
/**
 * Scenery entity schema
 */
export declare const InkwellSceneryEntitySchema: z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"scenery">;
    worldAssetId: z.ZodOptional<z.ZodString>;
    worldAssetIdTransparent: z.ZodOptional<z.ZodString>;
    worldUrl: z.ZodOptional<z.ZodString>;
    worldUrlTransparent: z.ZodOptional<z.ZodString>;
    worldDepthGreyUrl: z.ZodOptional<z.ZodString>;
    worldDepthColorUrl: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        scenery: z.ZodOptional<z.ZodObject<{
            /** Width of the scenery asset */
            width: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<64>, z.ZodLiteral<128>]>, z.ZodLiteral<256>]>>;
            /** Height of the scenery asset */
            height: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<64>, z.ZodLiteral<128>]>, z.ZodLiteral<256>]>>;
        }, "strip", z.ZodTypeAny, {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        }, {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    }, {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "scenery";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    promptShort?: string | undefined;
    worldAssetId?: string | undefined;
    worldUrl?: string | undefined;
    worldAssetIdTransparent?: string | undefined;
    worldUrlTransparent?: string | undefined;
    worldDepthGreyUrl?: string | undefined;
    worldDepthColorUrl?: string | undefined;
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    } | undefined;
}, {
    type: "scenery";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    promptShort?: string | undefined;
    worldAssetId?: string | undefined;
    worldUrl?: string | undefined;
    worldAssetIdTransparent?: string | undefined;
    worldUrlTransparent?: string | undefined;
    worldDepthGreyUrl?: string | undefined;
    worldDepthColorUrl?: string | undefined;
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    } | undefined;
}>;
/**
 * Item entity schema
 */
export declare const InkwellItemEntitySchema: z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"item">;
    worldAssetId: z.ZodString;
    worldUrl: z.ZodString;
    worldAssetIdTransparent: z.ZodString;
    worldUrlTransparent: z.ZodString;
    inventoryAssetId: z.ZodString;
    inventoryAssetIdTransparent: z.ZodOptional<z.ZodString>;
    inventoryUrl: z.ZodString;
    inventoryUrlTransparent: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "item";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    worldAssetId: string;
    worldUrl: string;
    worldAssetIdTransparent: string;
    worldUrlTransparent: string;
    inventoryAssetId: string;
    inventoryUrl: string;
    inventoryUrlTransparent: string;
    promptShort?: string | undefined;
    inventoryAssetIdTransparent?: string | undefined;
}, {
    type: "item";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    worldAssetId: string;
    worldUrl: string;
    worldAssetIdTransparent: string;
    worldUrlTransparent: string;
    inventoryAssetId: string;
    inventoryUrl: string;
    inventoryUrlTransparent: string;
    promptShort?: string | undefined;
    inventoryAssetIdTransparent?: string | undefined;
}>;
/**
 * Tile entity schema
 */
export declare const InkwellTileEntitySchema: z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"tile">;
    tileAssetId: z.ZodString;
    tileUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "tile";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    tileAssetId: string;
    tileUrl: string;
    promptShort?: string | undefined;
}, {
    type: "tile";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    tileAssetId: string;
    tileUrl: string;
    promptShort?: string | undefined;
}>;
/**
 * Effect entity schema
 */
export declare const InkwellEffectEntitySchema: z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"effect">;
    effectAssetId: z.ZodString;
    effectIconAssetId: z.ZodString;
    effectUrl: z.ZodString;
    effectIconUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "effect";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    effectAssetId: string;
    effectIconAssetId: string;
    effectUrl: string;
    effectIconUrl: string;
    promptShort?: string | undefined;
}, {
    type: "effect";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    effectAssetId: string;
    effectIconAssetId: string;
    effectUrl: string;
    effectIconUrl: string;
    promptShort?: string | undefined;
}>;
/**
 * Scene entity schema
 */
export declare const InkwellSceneEntitySchema: z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"scene">;
    sceneAssetId: z.ZodString;
    sceneUrl: z.ZodString;
    sceneDepthGreyUrl: z.ZodString;
    sceneDepthColorUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "scene";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    sceneAssetId: string;
    sceneUrl: string;
    sceneDepthGreyUrl: string;
    sceneDepthColorUrl: string;
    promptShort?: string | undefined;
}, {
    type: "scene";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    sceneAssetId: string;
    sceneUrl: string;
    sceneDepthGreyUrl: string;
    sceneDepthColorUrl: string;
    promptShort?: string | undefined;
}>;
/**
 * Union schema for all entity types
 */
export declare const InkwellEntitySchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"character">;
    portraitAssetId: z.ZodString;
    worldAssetId: z.ZodString;
    facing: z.ZodEnum<["left", "right"]>;
    portraitUrl: z.ZodString;
    worldUrl: z.ZodString;
    portraitDepthGreyUrl: z.ZodString;
    portraitDepthColorUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "character";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    portraitAssetId: string;
    worldAssetId: string;
    facing: "left" | "right";
    portraitUrl: string;
    worldUrl: string;
    portraitDepthGreyUrl: string;
    portraitDepthColorUrl: string;
    promptShort?: string | undefined;
}, {
    type: "character";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    portraitAssetId: string;
    worldAssetId: string;
    facing: "left" | "right";
    portraitUrl: string;
    worldUrl: string;
    portraitDepthGreyUrl: string;
    portraitDepthColorUrl: string;
    promptShort?: string | undefined;
}>, z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"item">;
    worldAssetId: z.ZodString;
    worldUrl: z.ZodString;
    worldAssetIdTransparent: z.ZodString;
    worldUrlTransparent: z.ZodString;
    inventoryAssetId: z.ZodString;
    inventoryAssetIdTransparent: z.ZodOptional<z.ZodString>;
    inventoryUrl: z.ZodString;
    inventoryUrlTransparent: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "item";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    worldAssetId: string;
    worldUrl: string;
    worldAssetIdTransparent: string;
    worldUrlTransparent: string;
    inventoryAssetId: string;
    inventoryUrl: string;
    inventoryUrlTransparent: string;
    promptShort?: string | undefined;
    inventoryAssetIdTransparent?: string | undefined;
}, {
    type: "item";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    worldAssetId: string;
    worldUrl: string;
    worldAssetIdTransparent: string;
    worldUrlTransparent: string;
    inventoryAssetId: string;
    inventoryUrl: string;
    inventoryUrlTransparent: string;
    promptShort?: string | undefined;
    inventoryAssetIdTransparent?: string | undefined;
}>, z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"scenery">;
    worldAssetId: z.ZodOptional<z.ZodString>;
    worldAssetIdTransparent: z.ZodOptional<z.ZodString>;
    worldUrl: z.ZodOptional<z.ZodString>;
    worldUrlTransparent: z.ZodOptional<z.ZodString>;
    worldDepthGreyUrl: z.ZodOptional<z.ZodString>;
    worldDepthColorUrl: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        scenery: z.ZodOptional<z.ZodObject<{
            /** Width of the scenery asset */
            width: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<64>, z.ZodLiteral<128>]>, z.ZodLiteral<256>]>>;
            /** Height of the scenery asset */
            height: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<64>, z.ZodLiteral<128>]>, z.ZodLiteral<256>]>>;
        }, "strip", z.ZodTypeAny, {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        }, {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    }, {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "scenery";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    promptShort?: string | undefined;
    worldAssetId?: string | undefined;
    worldUrl?: string | undefined;
    worldAssetIdTransparent?: string | undefined;
    worldUrlTransparent?: string | undefined;
    worldDepthGreyUrl?: string | undefined;
    worldDepthColorUrl?: string | undefined;
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    } | undefined;
}, {
    type: "scenery";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    promptShort?: string | undefined;
    worldAssetId?: string | undefined;
    worldUrl?: string | undefined;
    worldAssetIdTransparent?: string | undefined;
    worldUrlTransparent?: string | undefined;
    worldDepthGreyUrl?: string | undefined;
    worldDepthColorUrl?: string | undefined;
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    } | undefined;
}>, z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"tile">;
    tileAssetId: z.ZodString;
    tileUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "tile";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    tileAssetId: string;
    tileUrl: string;
    promptShort?: string | undefined;
}, {
    type: "tile";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    tileAssetId: string;
    tileUrl: string;
    promptShort?: string | undefined;
}>, z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"effect">;
    effectAssetId: z.ZodString;
    effectIconAssetId: z.ZodString;
    effectUrl: z.ZodString;
    effectIconUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "effect";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    effectAssetId: string;
    effectIconAssetId: string;
    effectUrl: string;
    effectIconUrl: string;
    promptShort?: string | undefined;
}, {
    type: "effect";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    effectAssetId: string;
    effectIconAssetId: string;
    effectUrl: string;
    effectIconUrl: string;
    promptShort?: string | undefined;
}>, z.ZodObject<{
    entityId: z.ZodString;
    createdAt: z.ZodString;
    author: z.ZodObject<{
        /** Unique author identifier */
        id: z.ZodString;
        /** Author's username */
        username: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        username: string;
    }, {
        id: string;
        username: string;
    }>;
    promptShort: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"scene">;
    sceneAssetId: z.ZodString;
    sceneUrl: z.ZodString;
    sceneDepthGreyUrl: z.ZodString;
    sceneDepthColorUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "scene";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    sceneAssetId: string;
    sceneUrl: string;
    sceneDepthGreyUrl: string;
    sceneDepthColorUrl: string;
    promptShort?: string | undefined;
}, {
    type: "scene";
    entityId: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
    sceneAssetId: string;
    sceneUrl: string;
    sceneDepthGreyUrl: string;
    sceneDepthColorUrl: string;
    promptShort?: string | undefined;
}>]>;
/**
 * Embedding response schema
 */
export declare const InkwellEmbeddingResponseSchema: z.ZodObject<{
    /** Entity ID */
    entityId: z.ZodString;
    /** Embedding vector */
    embedding: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    entityId: string;
    embedding: number[];
}, {
    entityId: string;
    embedding: number[];
}>;
/**
 * Nearest request schema
 */
export declare const InkwellNearestRequestSchema: z.ZodObject<{
    /** Embedding vector to search with */
    embedding: z.ZodArray<z.ZodNumber, "many">;
    /** Optional entity types to filter by */
    types: z.ZodOptional<z.ZodArray<z.ZodEnum<["character", "item", "scenery", "tile", "effect", "scene"]>, "many">>;
    /** Number of results to return (default: 1) */
    top: z.ZodOptional<z.ZodNumber>;
    /** Optional metadata filters */
    metadata: z.ZodOptional<z.ZodObject<{
        scenery: z.ZodOptional<z.ZodObject<{
            /** Filter by scenery width */
            width: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<64>, z.ZodLiteral<128>]>, z.ZodLiteral<256>]>>;
            /** Filter by scenery height */
            height: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<64>, z.ZodLiteral<128>]>, z.ZodLiteral<256>]>>;
        }, "strip", z.ZodTypeAny, {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        }, {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    }, {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    embedding: number[];
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    } | undefined;
    types?: ("character" | "item" | "scenery" | "tile" | "effect" | "scene")[] | undefined;
    top?: number | undefined;
}, {
    embedding: number[];
    metadata?: {
        scenery?: {
            width?: 64 | 128 | 256 | undefined;
            height?: 64 | 128 | 256 | undefined;
        } | undefined;
    } | undefined;
    types?: ("character" | "item" | "scenery" | "tile" | "effect" | "scene")[] | undefined;
    top?: number | undefined;
}>;
/**
 * Nearest from entity transform request schema
 */
export declare const InkwellNearestFromEntityTransformRequestSchema: z.ZodObject<{
    /** Source entity ID */
    entityId: z.ZodString;
    /** Target entity type to transform to */
    targetType: z.ZodEnum<["character", "item", "scenery", "tile", "effect", "scene"]>;
    /** Number of results to return (default: 1) */
    count: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    entityId: string;
    targetType: "character" | "item" | "scenery" | "tile" | "effect" | "scene";
    count?: number | undefined;
}, {
    entityId: string;
    targetType: "character" | "item" | "scenery" | "tile" | "effect" | "scene";
    count?: number | undefined;
}>;
/**
 * Entities by IDs request schema
 */
export declare const InkwellEntitiesByIdsRequestSchema: z.ZodObject<{
    /** Array of entity IDs to fetch */
    ids: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    ids: string[];
}, {
    ids: string[];
}>;
/**
 * TypeScript types inferred from Zod schemas
 */
export type InkwellEntityType = z.infer<typeof InkwellBaseEntitySchema>['type'];
export type InkwellAuthor = z.infer<typeof InkwellAuthorSchema>;
export type InkwellBaseEntity = z.infer<typeof InkwellBaseEntitySchema>;
export type InkwellCharacterEntity = z.infer<typeof InkwellCharacterEntitySchema>;
export type InkwellSceneryEntity = z.infer<typeof InkwellSceneryEntitySchema>;
export type InkwellItemEntity = z.infer<typeof InkwellItemEntitySchema>;
export type InkwellTileEntity = z.infer<typeof InkwellTileEntitySchema>;
export type InkwellEffectEntity = z.infer<typeof InkwellEffectEntitySchema>;
export type InkwellSceneEntity = z.infer<typeof InkwellSceneEntitySchema>;
export type InkwellEntity = z.infer<typeof InkwellEntitySchema>;
export type InkwellEmbeddingResponse = z.infer<typeof InkwellEmbeddingResponseSchema>;
export type InkwellNearestRequest = z.infer<typeof InkwellNearestRequestSchema>;
export type InkwellNearestFromEntityTransformRequest = z.infer<typeof InkwellNearestFromEntityTransformRequestSchema>;
export type InkwellEntitiesByIdsRequest = z.infer<typeof InkwellEntitiesByIdsRequestSchema>;
/**
 * Nearest matches payload (alternative response shape for /embedding/nearest)
 */
export declare const InkwellNearestMatchSchema: z.ZodObject<{
    /** Entity ID for the matched item */
    entityId: z.ZodString;
    /** Vector distance between query and entity */
    distance: z.ZodNumber;
    /** Optional embedding vector for the match if provided by the server */
    embedding: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    entityId: string;
    distance: number;
    embedding?: number[] | undefined;
}, {
    entityId: string;
    distance: number;
    embedding?: number[] | undefined;
}>;
export declare const InkwellNearestMatchesPayloadSchema: z.ZodObject<{
    /** Optional model used for the search */
    model: z.ZodOptional<z.ZodString>;
    /** Requested top K */
    top: z.ZodOptional<z.ZodNumber>;
    /** Echoed filters from the request */
    filters: z.ZodOptional<z.ZodArray<z.ZodEnum<["character", "item", "scenery", "tile", "effect", "scene"]>, "many">>;
    /** Whether metadata filters were applied server-side */
    metadataApplied: z.ZodOptional<z.ZodBoolean>;
    /** Array of nearest match references */
    matches: z.ZodArray<z.ZodObject<{
        /** Entity ID for the matched item */
        entityId: z.ZodString;
        /** Vector distance between query and entity */
        distance: z.ZodNumber;
        /** Optional embedding vector for the match if provided by the server */
        embedding: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    }, "strip", z.ZodTypeAny, {
        entityId: string;
        distance: number;
        embedding?: number[] | undefined;
    }, {
        entityId: string;
        distance: number;
        embedding?: number[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    matches: {
        entityId: string;
        distance: number;
        embedding?: number[] | undefined;
    }[];
    top?: number | undefined;
    model?: string | undefined;
    filters?: ("character" | "item" | "scenery" | "tile" | "effect" | "scene")[] | undefined;
    metadataApplied?: boolean | undefined;
}, {
    matches: {
        entityId: string;
        distance: number;
        embedding?: number[] | undefined;
    }[];
    top?: number | undefined;
    model?: string | undefined;
    filters?: ("character" | "item" | "scenery" | "tile" | "effect" | "scene")[] | undefined;
    metadataApplied?: boolean | undefined;
}>;
export type InkwellNearestMatch = z.infer<typeof InkwellNearestMatchSchema>;
export type InkwellNearestMatchesPayload = z.infer<typeof InkwellNearestMatchesPayloadSchema>;
/**
 * Type guard functions
 */
export declare function isCharacter(e: InkwellEntity): e is InkwellCharacterEntity;
export declare function isEffect(e: InkwellEntity): e is InkwellEffectEntity;
export declare function isItem(e: InkwellEntity): e is InkwellItemEntity;
export declare function isScenery(e: InkwellEntity): e is InkwellSceneryEntity;
export declare function isTiles(e: InkwellEntity): e is InkwellTileEntity;
export declare function isScene(e: InkwellEntity): e is InkwellSceneEntity;
//# sourceMappingURL=types.d.ts.map