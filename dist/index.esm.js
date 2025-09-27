// Inkwell public API types based on shared docs and samples
const INKWELL_ENTITY_TYPES = [
    'character',
    'item',
    'scenery',
    'tile',
    'effect',
    'scene',
];
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

const DEFAULT_BASE_URL = 'https://api.inkwell.ing/v1';
class InkwellClient {
    constructor(options = {}) {
        this.apiKey = options.apiKey;
        this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
        // Ensure fetch is correctly bound to the global (Window) to avoid Illegal invocation
        const boundGlobalFetch = (() => {
            const g = typeof window !== 'undefined'
                ? window
                : typeof globalThis !== 'undefined'
                    ? globalThis
                    : undefined;
            if (g && typeof g.fetch === 'function')
                return g.fetch.bind(g);
            if (typeof fetch === 'function')
                return fetch.bind(undefined);
            return undefined;
        })();
        this.fetchImpl = options.fetchImpl ?? boundGlobalFetch;
    }
    headers() {
        const headers = {};
        if (this.apiKey)
            headers['x-api-key'] = this.apiKey;
        return headers;
    }
    async doJson(path, init) {
        const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
            ...init,
            headers: {
                ...(init?.headers || {}),
                ...this.headers(),
            },
        });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Inkwell ${path} failed: ${res.status} ${res.statusText} ${text}`);
        }
        const json = await res.json();
        if (json && typeof json === 'object' && 'ok' in json && 'data' in json) {
            return json.data;
        }
        return json;
    }
    getEntity(id) {
        return this.doJson(`/entity/${encodeURIComponent(id)}`);
    }
    getRandomEntity(types) {
        const qs = types && types.length ? `?types=${types.join(',')}` : '';
        return this.doJson(`/entity/random${qs}`);
    }
    getEmbeddingByEntityId(entityId) {
        return this.doJson(`/embedding/entity/${encodeURIComponent(entityId)}`);
    }
    nearestByEmbedding(req) {
        return this.doJson(`/embedding/nearest`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(req),
        });
    }
    nearestFromEntityTransform(req) {
        return this.doJson(`/embedding/nearest-from-entity-transform`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(req),
        });
    }
    async entitiesByIds(req) {
        const response = await this.doJson(`/entities/by-ids`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(req),
        });
        return response?.items;
    }
}
function createInkwellClient(options) {
    return new InkwellClient(options);
}

const STORAGE_KEY = 'inkwell.assignments.v1';
function loadAssignments() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return {};
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            const cleaned = {};
            for (const [k, v] of Object.entries(parsed)) {
                if (v && typeof v === 'object' && 'entityId' in v && 'entity' in v) {
                    cleaned[k] = v;
                }
            }
            return cleaned;
        }
    }
    catch { }
    return {};
}
function saveAssignments(assignments) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
    catch { }
}
function unassignRole(role) {
    const current = loadAssignments();
    delete current[role];
    saveAssignments(current);
    return current;
}
function assignRoleEntity(role, entity) {
    const current = loadAssignments();
    current[role] = { entityId: entity.entityId, entity };
    saveAssignments(current);
    return current;
}

export { INKWELL_ENTITY_TYPES, InkwellClient, assignRoleEntity, createInkwellClient, isCharacter, isEffect, isItem, isScene, isScenery, isTiles, loadAssignments, saveAssignments, unassignRole };
//# sourceMappingURL=index.esm.js.map
