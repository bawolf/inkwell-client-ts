# @bawolf/inkwell-client

Official Inkwell API client for JavaScript/TypeScript applications. This client provides a robust, type-safe interface to the Inkwell API with runtime validation and comprehensive error handling.

## Features

- 🚀 **Type-safe**: Full TypeScript support with runtime validation using Zod
- 🛡️ **Error Handling**: Comprehensive error handling with custom error types
- 📝 **Logging**: Built-in debug logging for development and troubleshooting
- 🔧 **Configurable**: Flexible configuration options for different environments
- 📦 **Framework Agnostic**: Works with any JavaScript/TypeScript framework
- ✅ **Validated**: Runtime schema validation ensures data integrity

## Installation

```bash
npm install @bawolf/inkwell-client
```

## Quick Start

```typescript
import { createInkwellClient } from '@bawolf/inkwell-client';

const client = createInkwellClient({
  apiKey: 'your-api-key-here',
});

// Get a specific entity
const entity = await client.getEntity('entity-123');
console.log(entity.type); // 'character', 'item', etc.

// Get a random character
const randomCharacter = await client.getRandomEntity(['character']);

// Find nearest matches (distances + entityIds, faithful to API)
const matches = await client.nearestByEmbedding({
  embedding: [0.1, 0.2, 0.3],
  types: ['character'],
  top: 5,
});
// Or resolve to full entities via convenience method
const entities = await client.nearestByEmbeddingEntities({
  embedding: [0.1, 0.2, 0.3],
  types: ['character'],
  top: 5,
});
```

## Configuration

```typescript
import { createInkwellClient } from '@bawolf/inkwell-client';

const client = createInkwellClient({
  apiKey: 'your-api-key', // Required for authenticated requests
  baseUrl: 'https://api.inkwell.ing/v1', // Optional: custom API endpoint
  timeout: 30000, // Optional: request timeout (default: 30s)
  axiosInstance: customAxios, // Optional: custom axios instance
});
```

## API Reference

### Client Methods

#### `getEntity(id: string): Promise<InkwellEntity>`

Get a specific entity by its ID.

```typescript
const entity = await client.getEntity('character-123');
if (entity.type === 'character') {
  console.log(entity.facing); // 'left' or 'right'
  console.log(entity.worldUrl); // Sprite sheet URL
}
```

#### `getRandomEntity(types?: InkwellEntityType[]): Promise<InkwellEntity>`

Get a random entity, optionally filtered by types.

```typescript
// Get any random entity
const anyEntity = await client.getRandomEntity();

// Get a random character
const character = await client.getRandomEntity(['character']);

// Get a random item or effect
const itemOrEffect = await client.getRandomEntity(['item', 'effect']);
```

#### `getEmbeddingByEntityId(entityId: string): Promise<{embedding: number[], entityId: string}>`

Get the embedding vector for a specific entity.

```typescript
const { embedding, entityId } =
  await client.getEmbeddingByEntityId('entity-123');
console.log(`Entity ${entityId} has ${embedding.length} dimensions`);
```

#### `nearestByEmbedding(req: InkwellNearestRequest): Promise<InkwellNearestMatchesPayload>`

Find nearest matches to a given embedding vector. Returns distances and `entityId` references (API-faithful response).

```typescript
const matches = await client.nearestByEmbedding({
  embedding: [0.1, 0.2, 0.3 /* ... */],
  types: ['character'],
  top: 5,
  metadata: {
    scenery: {
      width: 128,
      height: 128,
    },
  },
});
console.log(matches.matches[0].distance);
```

#### `nearestByEmbeddingEntities(req: InkwellNearestRequest): Promise<InkwellEntity[]>`

Convenience helper that resolves the match `entityId`s to full entities via `entitiesByIds`.

```typescript
const entities = await client.nearestByEmbeddingEntities({
  embedding: [0.1, 0.2, 0.3],
  types: ['character'],
  top: 5,
});
```

#### `nearestFromEntityTransform(req: InkwellNearestFromEntityTransformRequest): Promise<InkwellEntity[]>`

Find entities similar to a source entity but of a different type.

```typescript
const items = await client.nearestFromEntityTransform({
  entityId: 'character-123',
  targetType: 'item',
  top: 3,
});
```

#### `entitiesByIds(req: InkwellEntitiesByIdsRequest): Promise<InkwellEntity[]>`

Get multiple entities by their IDs in a single request.

```typescript
const entities = await client.entitiesByIds({
  ids: ['entity-1', 'entity-2', 'entity-3'],
});
```

### Type Guards

The client includes type guard functions to help with type narrowing:

```typescript
import { isCharacter, isItem, isEffect } from '@bawolf/inkwell-client';

const entity = await client.getRandomEntity();

if (isCharacter(entity)) {
  // TypeScript knows this is a InkwellCharacterEntity
  console.log(entity.facing);
  console.log(entity.worldUrl);
} else if (isItem(entity)) {
  // TypeScript knows this is a InkwellItemEntity
  console.log(entity.inventoryUrl);
} else if (isEffect(entity)) {
  // TypeScript knows this is a InkwellEffectEntity
  console.log(entity.effectUrl);
}
```

### Error Handling

The client throws `InkwellError` instances for API errors:

```typescript
import { InkwellError } from '@bawolf/inkwell-client';

try {
  const entity = await client.getEntity('invalid-id');
} catch (error) {
  if (error instanceof InkwellError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Response:', error.response);
  }
}
```

### Debug Logging

Enable debug logging by setting the `DEBUG` environment variable:

```bash
DEBUG=inkwell:client node your-script.js
```

Or in your code:

```typescript
import debug from 'debug';
debug.enabled('inkwell:client');
```

## Smoke testing against the live API

You can quickly verify your setup against the live API using the bundled smoke script.

Prerequisites:

- Set `INKWELL_API_KEY` (required)
- Optional: `INKWELL_BASE_URL` to override the default endpoint
- Optional: `INKWELL_ENTITY_ID` to fetch a specific entity by ID
- Optional: filter random entity by type(s) using `INKWELL_TYPES` env var or `--types` CLI arg

Commands:

```bash
# Random entity (no filter)
INKWELL_API_KEY=your_key npm run smoke

# Random entity filtered by types (comma-separated)
INKWELL_API_KEY=your_key INKWELL_TYPES=character,tile npm run smoke

# Or use a CLI argument for types
INKWELL_API_KEY=your_key npm run smoke -- --types=character,tile

# Specific entity by ID
INKWELL_API_KEY=your_key INKWELL_ENTITY_ID=entity-123 npm run smoke

# Custom base URL (if needed)
INKWELL_API_KEY=your_key INKWELL_BASE_URL=https://api.inkwell.ing/v1 npm run smoke
```

What the smoke test does:

- Builds the library
- Creates an `InkwellClient` with your API key (and optional base URL)
- If `INKWELL_ENTITY_ID` is set, fetches that entity; otherwise fetches a random entity
- Fetches an embedding for the entity by ID, then fetches 3 nearest entities using `nearestByEmbeddingEntities`

## Advanced Usage

### Custom Axios Instance

You can provide a custom Axios instance for advanced configuration:

```typescript
import axios from 'axios';
import { createInkwellClient } from '@bawolf/inkwell-client';

const customAxios = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'MyApp/1.0',
  },
});

const client = createInkwellClient({
  apiKey: 'your-key',
  axiosInstance: customAxios,
});
```

### Environment Variables

You can configure the client using environment variables:

```bash
INKWELL_API_KEY=your-api-key
INKWELL_BASE_URL=https://api.inkwell.ing/v1
DEBUG=inkwell:client
```

```typescript
const client = createInkwellClient({
  apiKey: process.env.INKWELL_API_KEY,
  baseUrl: process.env.INKWELL_BASE_URL,
});
```

### React Integration

```typescript
import { useEffect, useState } from 'react';
import { createInkwellClient, InkwellEntity } from '@inkwell/client';

function EntityList() {
  const [entities, setEntities] = useState<InkwellEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = createInkwellClient({
      apiKey: process.env.REACT_APP_INKWELL_API_KEY
    });

    client.getRandomEntity(['character'])
      .then(entity => setEntities([entity]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {entities.map(entity => (
        <div key={entity.entityId}>
          <h3>{entity.promptShort}</h3>
          <p>Type: {entity.type}</p>
        </div>
      ))}
    </div>
  );
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Issue Tracker](https://github.com/bawolf/inkwell-client-ts/issues)
