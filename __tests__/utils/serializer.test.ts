import DataSerializer from '../../utils/serializer';

describe('DataSerializer', () => {
  test('serializes and deserializes JSON', async () => {
    const jsonData = { name: 'Alice', age: 30 };
    const serialized = DataSerializer.serialize(jsonData, 'json');
    expect(serialized).toBe(JSON.stringify(jsonData));

    const deserialized = await DataSerializer.deserialize(serialized as string, 'json');
    expect(deserialized).toEqual(jsonData);
  });

  test('serializes and deserializes MessagePack', async () => {
    const msgData = { role: 'Admin', active: true };
    const serialized = DataSerializer.serialize(msgData, 'msgpack');
    expect(Buffer.isBuffer(serialized)).toBe(true);

    const deserialized = await DataSerializer.deserialize(serialized as Buffer, 'msgpack');
    expect(deserialized).toEqual(msgData);
  });

  test('serializes and deserializes BSON', async () => {
    const bsonData = { user: 'Bob', age: 40 };
    const serialized = DataSerializer.serialize(bsonData, 'bson');
    expect(Buffer.isBuffer(serialized)).toBe(true);

    const deserialized = await DataSerializer.deserialize(serialized as Buffer, 'bson');
    expect(deserialized).toEqual(bsonData);
  });

  test('serializes and deserializes XML', async () => {
    type UserXmlData = {
      user: {
        name: [string];
        age: [string];
      };
    };
    const xmlData = { user: { name: 'Carol', age: 25 } };
    const serialized = DataSerializer.serialize(xmlData, 'xml');
    expect(typeof serialized).toBe('string');

    const deserialized = (await DataSerializer.deserialize(serialized as string, 'xml')) as UserXmlData;

    const normalized = {
      user: {
        name: deserialized.user.name[0],
        age: parseInt(deserialized.user.age[0], 10),
      },
    };
    expect(normalized).toEqual(xmlData);
  });

  test('serializes and deserializes JSON with gzip compression', async () => {
    const jsonData = { name: 'Alice', age: 30 };
    const serialized = DataSerializer.serialize(jsonData, 'json', 'gzip');
    expect(Buffer.isBuffer(serialized)).toBe(true);

    const deserialized = await DataSerializer.deserialize(serialized as Buffer, 'json', 'gzip');
    expect(deserialized).toEqual(jsonData);
  });

  test('serializes and deserializes JSON with brotli compression', async () => {
    const jsonData = { name: 'Bob', age: 40 };
    const serialized = DataSerializer.serialize(jsonData, 'json', 'brotli');
    expect(Buffer.isBuffer(serialized)).toBe(true);

    const deserialized = await DataSerializer.deserialize(serialized as Buffer, 'json', 'brotli');
    expect(deserialized).toEqual(jsonData);
  });

  test('throws error for unsupported format', () => {
    expect(() => {
      DataSerializer.serialize({ test: 'data' }, 'unsupported' as never);
    }).toThrow('Unsupported format: unsupported');
  });

  test('throws error for invalid data type in deserialize', async () => {
    const invalidData = Buffer.from('not-json');
    await expect(DataSerializer.deserialize(invalidData, 'json')).rejects.toThrow('Invalid data or format');
  });

  test('throws error on unknown compression algorithm', () => {
    expect(() => {
      DataSerializer.serialize({ test: 'data' }, 'json', 'unknown' as never);
    }).toThrow();
  });

  test('handles invalid decompression algorithm gracefully', async () => {
    const jsonData = { name: 'Alice', age: 30 };
    const serialized = DataSerializer.serialize(jsonData, 'json', 'gzip');
    await expect(DataSerializer.deserialize(serialized as Buffer, 'json', 'unknown' as never)).rejects.toThrow(
      'Unsupported decompression algorithm: unknown',
    );
  });
});
