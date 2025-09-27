# @inkwell/client

Official Inkwell API client for JavaScript/TypeScript applications. This client provides a robust, type-safe interface to the Inkwell API with built-in retry logic, request/response validation, and comprehensive error handling.

## Features

- 🚀 **Type-safe**: Full TypeScript support with runtime validation using Zod
- 🔄 **Retry Logic**: Automatic retry with exponential backoff for failed requests
- 🛡️ **Error Handling**: Comprehensive error handling with custom error types
- 📝 **Logging**: Built-in debug logging for development and troubleshooting
- 🔧 **Configurable**: Flexible configuration options for different environments
- 📦 **Framework Agnostic**: Works with any JavaScript/TypeScript framework
- ✅ **Validated**: Runtime schema validation ensures data integrity

## Installation

```bash
npm install @inkwell/client
```

## Quick Start

```typescript
import { createInkwellClient } from '@inkwell/client';

const client = createInkwellClient({
  apiKey: 'your-api-key-here'
});

// Get a specific entity
const entity = await client.getEntity('entity-123');
console.log(entity.type); // 'character', 'item', etc.

// Get a random character
const randomCharacter = await client.getRandomEntity(['character']);

// Find similar entities
const similar = await client.nearestByEmbedding({
  embedding: [0.1, 0.2, 0.3],
  types: ['character'],
  top: 5
});
```

## Configuration

```typescript
import { createInkwellClient } from '@inkwell/client';

const client = createInkwellClient({
  apiKey: 'your-api-key',           // Required for authenticated requests
  baseUrl: 'https://api.inkwell.ing/v1', // Optional: custom API endpoint
  timeout: 30000,                   // Optional: request timeout (default: 30s)
  retryAttempts: 3,                 // Optional: retry attempts (default: 3)
  axiosInstance: customAxios        // Optional: custom axios instance
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
const { embedding, entityId } = await client.getEmbeddingByEntityId('entity-123');
console.log(`Entity ${entityId} has ${embedding.length} dimensions`);
```

#### `nearestByEmbedding(req: InkwellNearestRequest): Promise<InkwellEntity[]>`

Find entities similar to a given embedding vector.

```typescript
const similar = await client.nearestByEmbedding({
  embedding: [0.1, 0.2, 0.3, /* ... */],
  types: ['character'],
  top: 5,
  metadata: {
    scenery: {
      width: 128,
      height: 128
    }
  }
});
```

#### `nearestFromEntityTransform(req: InkwellNearestFromEntityTransformRequest): Promise<InkwellEntity[]>`

Find entities similar to a source entity but of a different type.

```typescript
const items = await client.nearestFromEntityTransform({
  entityId: 'character-123',
  targetType: 'item',
  count: 3
});
```

#### `entitiesByIds(req: InkwellEntitiesByIdsRequest): Promise<InkwellEntity[]>`

Get multiple entities by their IDs in a single request.

```typescript
const entities = await client.entitiesByIds({
  ids: ['entity-1', 'entity-2', 'entity-3']
});
```

### Type Guards

The client includes type guard functions to help with type narrowing:

```typescript
import { isCharacter, isItem, isEffect } from '@inkwell/client';

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
import { InkwellError } from '@inkwell/client';

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

## Advanced Usage

### Custom Axios Instance

You can provide a custom Axios instance for advanced configuration:

```typescript
import axios from 'axios';
import { createInkwellClient } from '@inkwell/client';

const customAxios = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'MyApp/1.0'
  }
});

const client = createInkwellClient({
  apiKey: 'your-key',
  axiosInstance: customAxios
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
  baseUrl: process.env.INKWELL_BASE_URL
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

- 📖 [Documentation](https://docs.inkwell.ing)
- 🐛 [Issue Tracker](https://github.com/inkwell/client/issues)
- 💬 [Discord Community](https://discord.gg/inkwell)