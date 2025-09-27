import { InkwellClient } from '../dist/index.esm.js';

function parseTypesFromEnvOrArgs() {
  const fromEnv = process.env.INKWELL_TYPES;
  let fromArgs = undefined;

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--types=')) {
      fromArgs = arg.substring('--types='.length);
      break;
    } else if (arg === '--types') {
      const idx = process.argv.indexOf('--types');
      if (idx !== -1 && process.argv[idx + 1]) {
        fromArgs = process.argv[idx + 1];
      }
      break;
    }
  }

  const raw = fromArgs ?? fromEnv;
  if (!raw) return undefined;

  const arr = raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

async function main() {
  const apiKey = process.env.INKWELL_API_KEY;
  if (!apiKey) {
    console.error('Missing INKWELL_API_KEY environment variable');
    process.exit(1);
  }

  const baseUrl = process.env.INKWELL_BASE_URL;
  const entityId = process.env.INKWELL_ENTITY_ID;
  const types = parseTypesFromEnvOrArgs();

  const client = new InkwellClient({ apiKey, ...(baseUrl ? { baseUrl } : {}) });

  try {
    if (entityId) {
      console.log(`Fetching entity by ID: ${entityId}`);
      const entity = await client.getEntity(entityId);
      console.log('Entity:', JSON.stringify(entity, null, 2));
    } else {
      if (types) {
        console.log(
          `Fetching random entity filtered by types: ${types.join(',')}`
        );
      } else {
        console.log('Fetching random entity (no type filter)...');
      }
      const entity = await client.getRandomEntity(types);
      console.log('Random entity:', JSON.stringify(entity, null, 2));

      console.log('Fetching embedding for random entity and then nearest...');
      try {
        const { embedding } = await client.getEmbeddingByEntityId(
          entity.entityId
        );
        const nearestEntities = await client.nearestByEmbeddingEntities({
          embedding,
          top: 3,
        });
        console.log(
          'Nearest entities:',
          JSON.stringify(nearestEntities, null, 2)
        );
      } catch (e) {
        console.log(
          'Could not fetch embedding or nearest entities:',
          e?.message || e
        );
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(2);
  }
}

main();
