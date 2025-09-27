import * as InkwellClient from '../index';

describe('Main exports', () => {
  it('should export InkwellClient class', () => {
    expect(InkwellClient.InkwellClient).toBeDefined();
    expect(typeof InkwellClient.InkwellClient).toBe('function');
  });

  it('should export createInkwellClient function', () => {
    expect(InkwellClient.createInkwellClient).toBeDefined();
    expect(typeof InkwellClient.createInkwellClient).toBe('function');
  });

  it('should export InkwellError class', () => {
    expect(InkwellClient.InkwellError).toBeDefined();
    expect(typeof InkwellClient.InkwellError).toBe('function');
  });

  it('should export InkwellClientOptions type', () => {
    // TypeScript types are not available at runtime, but we can check if the interface exists
    // by checking if we can create a client with options
    const client = InkwellClient.createInkwellClient({
      apiKey: 'test-key',
      baseUrl: 'https://test.com',
      timeout: 5000,
    });
    expect(client).toBeInstanceOf(InkwellClient.InkwellClient);
  });

  it('should export all type definitions', () => {
    // These are TypeScript types, so we can't test them at runtime
    // But we can verify the module exports something
    expect(Object.keys(InkwellClient).length).toBeGreaterThan(0);
  });

  it('should create client instance using factory function', () => {
    const client = InkwellClient.createInkwellClient();
    expect(client).toBeInstanceOf(InkwellClient.InkwellClient);
  });

  it('should create client instance using constructor', () => {
    const client = new InkwellClient.InkwellClient();
    expect(client).toBeInstanceOf(InkwellClient.InkwellClient);
  });
});
