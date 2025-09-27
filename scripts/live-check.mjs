// Live API shape check: logs raw server payloads and parsed client outputs
// Usage:
//   INKWELL_API_KEY=sk-... [INKWELL_BASE_URL=...] [INKWELL_TYPES=item,character] [INKWELL_ENTITY_ID=...] [INKWELL_TOP=3] DEBUG=inkwell:client node scripts/live-check.mjs

import axios from 'axios';
import {
  InkwellClient,
  InkwellEntitySchema,
  InkwellNearestMatchesPayloadSchema,
} from '../dist/index.esm.js';

function parseTypes() {
  const raw = process.env.INKWELL_TYPES;
  if (!raw) return undefined;
  const arr = raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

function logHeader(title) {
  console.log(`\n=== ${title} ===`);
}

// Pretty-print with truncation for large arrays (e.g., embeddings)
function createReplacer(
  maxArray = Number(process.env.LIVE_CHECK_MAX_ARRAY || 16)
) {
  return function replacer(key, value) {
    if (Array.isArray(value)) {
      const isNumberArray =
        value.length && value.every(v => typeof v === 'number');
      const isEmbeddingKey = key === 'embedding';
      if ((isNumberArray || isEmbeddingKey) && value.length > maxArray) {
        return {
          __truncated__: true,
          length: value.length,
          head: value.slice(0, Math.floor(maxArray / 2)),
          tail: value.slice(-Math.floor(maxArray / 2)),
        };
      }
    }
    return value;
  };
}

function logJson(label, value) {
  const replacer = createReplacer();
  console.log(label + ':', JSON.stringify(value, replacer, 2));
}

async function main() {
  const apiKey = process.env.INKWELL_API_KEY;
  if (!apiKey) {
    console.error('Missing INKWELL_API_KEY');
    process.exit(1);
  }
  const baseUrl = process.env.INKWELL_BASE_URL || 'https://api.inkwell.ing/v1';
  const top = Number(process.env.INKWELL_TOP || 3);
  const envTypes = parseTypes();
  // Normalize types for raw (plural) vs client (singular)
  const singularValues = [
    'character',
    'item',
    'scenery',
    'tile',
    'effect',
    'scene',
  ];
  const pluralValues = [
    'characters',
    'items',
    'scenery',
    'tiles',
    'effects',
    'scenes',
  ];
  const singularToPlural = {
    character: 'characters',
    item: 'items',
    scenery: 'scenery',
    tile: 'tiles',
    effect: 'effects',
    scene: 'scenes',
  };
  const pluralToSingular = {
    characters: 'character',
    items: 'item',
    scenery: 'scenery',
    tiles: 'tile',
    effects: 'effect',
    scenes: 'scene',
  };
  const normalizeToPlural = t =>
    pluralValues.includes(t)
      ? t
      : singularValues.includes(t)
        ? singularToPlural[t]
        : t;
  const normalizeToSingular = t =>
    singularValues.includes(t)
      ? t
      : pluralValues.includes(t)
        ? pluralToSingular[t]
        : t;
  const rawTypes = envTypes ? envTypes.map(normalizeToPlural) : undefined;
  const clientTypes = envTypes ? envTypes.map(normalizeToSingular) : undefined;
  const envEntityId = process.env.INKWELL_ENTITY_ID;

  const raw = axios.create({
    baseURL: baseUrl,
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    timeout: 30000,
  });

  const client = new InkwellClient({ apiKey, baseUrl });

  try {
    let entityId = envEntityId;

    if (entityId) {
      logHeader(`GET /entity/${entityId} (raw)`);
      const r1 = await raw.get(`/entity/${encodeURIComponent(entityId)}`);
      logJson('raw.response', r1.data);

      logHeader('client.getEntity (parsed)');
      const c1 = await client.getEntity(entityId);
      logJson('client.entity', c1);
      InkwellEntitySchema.parse(c1);
    } else {
      logHeader('GET /entity/random (raw)');
      const r2 = await raw.get('/entity/random', {
        params: rawTypes ? { types: rawTypes.join(',') } : {},
      });
      logJson('raw.response', r2.data);

      logHeader('client.getRandomEntity (parsed)');
      const c2 = await client.getRandomEntity(clientTypes);
      logJson('client.randomEntity', c2);
      InkwellEntitySchema.parse(c2);
      entityId = c2.entityId;
    }

    logHeader(`GET /embedding/entity/${entityId} (raw)`);
    const r3 = await raw.get(
      `/embedding/entity/${encodeURIComponent(entityId)}`
    );
    logJson('raw.response', r3.data);

    logHeader('client.getEmbeddingByEntityId (parsed)');
    const c3 = await client.getEmbeddingByEntityId(entityId);
    logJson('client.embedding', c3);

    const embedding = c3.embedding;

    logHeader('POST /embedding/nearest (raw)');
    const nearestReq = {
      embedding,
      ...(clientTypes ? { types: clientTypes } : {}),
      top,
    };
    const r4 = await raw.post('/embedding/nearest', nearestReq);
    logJson('raw.response', r4.data);
    const r4Data =
      r4.data && r4.data.ok && 'data' in r4.data ? r4.data.data : r4.data;
    logJson('raw.unwrapped', r4Data);
    // Validate unwrapped against schema (will throw if mismatched)
    InkwellNearestMatchesPayloadSchema.parse(r4Data);

    logHeader('client.nearestByEmbedding (parsed)');
    const c4 = await client.nearestByEmbedding(nearestReq);
    logJson('client.nearestPayload', c4);

    const ids = (c4.matches || []).map(m => m?.entityId).filter(Boolean);
    if (!ids.length) {
      console.log(
        'No nearest matches; skipping entitiesByIds and transform checks.'
      );
      return;
    }

    logHeader('POST /entities/by-ids (raw)');
    const r5 = await raw.post('/entities/by-ids', { ids });
    logJson('raw.response', r5.data);
    const r5Data =
      r5.data && r5.data.ok && 'data' in r5.data ? r5.data.data : r5.data;
    logJson('raw.unwrapped', r5Data);
    const r5IsArray = Array.isArray(r5Data);
    const r5IsItems = !!(
      r5Data &&
      !Array.isArray(r5Data) &&
      typeof r5Data === 'object' &&
      Array.isArray(r5Data.items)
    );
    console.log('entitiesByIds shape:', {
      array: r5IsArray,
      itemsObject: r5IsItems,
    });

    logHeader('client.entitiesByIds (parsed)');
    const c5 = await client.entitiesByIds({ ids });
    logJson('client.entities', c5);

    // Optional: transform check using a plausible target type
    const targetType = (clientTypes && clientTypes[0]) || 'item';
    logHeader('POST /embedding/nearest-from-entity-transform (raw)');
    const r6 = await raw.post('/embedding/nearest-from-entity-transform', {
      entityId,
      targetType,
      count: 2,
    });
    logJson('raw.response', r6.data);

    logHeader('client.nearestFromEntityTransform (parsed)');
    const c6 = await client.nearestFromEntityTransform({
      entityId,
      targetType,
      count: 2,
    });
    logJson('client.transformEntities', c6);

    console.log('\nLive check completed successfully.');
  } catch (err) {
    console.error(
      'Live check failed:',
      err?.response?.data || err?.message || err
    );
    process.exit(2);
  }
}

main();
