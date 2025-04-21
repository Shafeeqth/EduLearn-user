/**
 * Interface representing a cache service for storing and retrieving data.
 */
export interface ICacheService {
  /**
   * Retrieves a value from the cache by its key.
   *
   * @template T - The type of the value to retrieve.
   * @param key - The key associated with the cached value.
   * @returns A promise that resolves to the cached value of type `T`, or `null` if the key does not exist.
   */
  getValue<T>(key: string): Promise<T | null>;

  /**
   * Stores a value in the cache with an optional time-to-live (TTL).
   *
   * @template T - The type of the value to store.
   * @param key - The key to associate with the value.
   * @param value - The value to store in the cache.
   * @returns A promise that resolves when the value has been stored.
   */
  setValue<T>(key: string, value: T): Promise<void>;

  /**
   * Deletes a value from the cache by its key.
   *
   * @param key - The key associated with the value to delete.
   * @returns A promise that resolves when the value has been removed.
   */
  delete(key: string): Promise<void>;
}
