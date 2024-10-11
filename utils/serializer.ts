/**
 * Supported data types for serialization.
 * @typedef {object | string | number | boolean | null} Serializable
 *
 * Available compression algorithms.
 * @typedef {'gzip' | 'brotli'} CompressionAlgorithm
 *
 * Supported serialization formats.
 * @typedef {'json' | 'msgpack' | 'bson' | 'xml'} SerializationFormat
 */

/**
 * DataSerializer class provides methods for serializing and deserializing data.
 * It supports multiple formats (JSON, BSON, XML, MessagePack) and optional compression (gzip, brotli).
 */

import {
  gzipSync, brotliCompressSync, gunzipSync, brotliDecompressSync,
} from 'zlib';
import * as msgpack from 'msgpack-lite';
import { BSON } from 'bson';
import { parseStringPromise, Builder } from 'xml2js';
import { Buffer } from 'buffer';

type Serializable = object | string | number | boolean | null;
type CompressionAlgorithm = 'gzip' | 'brotli';
type SerializationFormat = 'json' | 'msgpack' | 'bson' | 'xml';

export default class DataSerializer {
  /**
   * Serializes data into a specified format and optionally compresses it.
   *
   * @function serialize
   * @memberOf DataSerializer
   *
   * @param {Serializable} data - The data to serialize.
   * @param {SerializationFormat} format - The format to serialize the data to.
   * @param {boolean | CompressionAlgorithm} [compress=false] - Optional compression algorithm (gzip or brotli).
   *
   * @returns {Buffer | string} The serialized (and optionally compressed) data.
   */
  static serialize<T extends Serializable, F extends SerializationFormat>(
    data: T,
    format: F,
    compress: boolean | CompressionAlgorithm = false,
  ): Buffer | string {
    let serializedData: Buffer | string;

    if (format === 'msgpack') {
      serializedData = msgpack.encode(data);
    } else if (format === 'bson' && typeof data === 'object' && data !== null) {
      serializedData = Buffer.from(BSON.serialize(data));
    } else if (format === 'xml') {
      const builder = new Builder();
      serializedData = builder.buildObject(data);
    } else if (format === 'json') {
      serializedData = JSON.stringify(data);
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    if (typeof compress === 'string') {
      if (compress === 'gzip') {
        return gzipSync(serializedData);
      } if (compress === 'brotli') {
        return brotliCompressSync(serializedData);
      }
      throw new Error(`Unsupported compression algorithm: ${compress}`);
    } else if (compress) {
      return gzipSync(serializedData);
    }

    return serializedData;
  }
  /**
   * Deserializes and decompresses data from a specified format back into its original form.
   *
   * @function deserialize
   * @memberOf DataSerializer
   *
   * @param {Buffer | string} data - The data to deserialize.
   * @param {SerializationFormat} format - The format of the data to deserialize.
   * @param {boolean | CompressionAlgorithm} [decompress=false] - Optional decompression algorithm (gzip or brotli).
   *
   * @returns {Promise<Serializable>} The deserialized data in its original form.
   */

  static async deserialize<T extends Serializable, F extends SerializationFormat>(
    data: Buffer | string,
    format: F,
    decompress: boolean | CompressionAlgorithm = false,
  ): Promise<T> {
    let decompressedData: Buffer | string = data;

    if (typeof decompress === 'string') {
      if (decompress === 'gzip') {
        decompressedData = gunzipSync(data as Buffer).toString();
      } else if (decompress === 'brotli') {
        decompressedData = brotliDecompressSync(data as Buffer).toString();
      } else {
        throw new Error(`Unsupported decompression algorithm: ${decompress}`);
      }
    } else if (decompress) {
      decompressedData = gunzipSync(data as Buffer).toString();
    }

    if (format === 'msgpack' && Buffer.isBuffer(decompressedData)) {
      return msgpack.decode(Buffer.from(decompressedData));
    } if (format === 'bson' && Buffer.isBuffer(decompressedData)) {
      return BSON.deserialize(Buffer.from(decompressedData)) as unknown as T;
    } if (format === 'xml' && typeof decompressedData === 'string') {
      return (await parseStringPromise(decompressedData)) as T;
    } if (format === 'json' && typeof decompressedData === 'string') {
      return JSON.parse(decompressedData);
    }
    throw new Error('Invalid data or format');
  }
}
