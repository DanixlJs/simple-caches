/**
 * CacheTTL is a custom Map-like class that supports TTL (Time To Live) functionality.
 * It allows items to be stored with an expiration time and automatically removes expired items.
 *
 * @template K - The type of the key
 * @template V - The type of the value
 */
export declare class CacheTTL<K, V> extends Map<K, V> {
    private interval;
    private expirationTimes;
    private expirationInterval;
    /**
     * Starts the expiration interval if it's not already active.
     * It checks periodically if any items have expired and removes them from the cache.
     */
    private startExpirationInterval;
    /**
     * Constructs a CacheTTL instance with an optional expiration interval.
     * If a non-zero interval is provided, the expiration check will run periodically.
     *
     * @param interval - The interval (in milliseconds) for checking expired items.
     */
    constructor(interval?: number);
    /**
     * Sets a value in the cache with an optional TTL (Time To Live).
     * The item will expire after the specified TTL and be automatically removed.
     *
     * @param key - The key of the item to set.
     * @param data - The value associated with the key.
     * @param ttl - The time-to-live (TTL) for the item in milliseconds. Defaults to the interval.
     * @returns The CacheTTL instance.
     */
    set(key: K, data: V, ttl?: number): this;
    /**
     * Gets a value from the cache. If the item has expired, it is removed from the cache.
     *
     * @param key - The key of the item to retrieve.
     * @returns The value associated with the key or `undefined` if the item has expired.
     */
    get(key: K): V | undefined;
    /**
     * Deletes a value from the cache.
     *
     * @param key - The key of the item to delete.
     * @returns `true` if the item was deleted, `false` otherwise.
     */
    delete(key: K): boolean;
    /**
     * Clears the entire cache, including expiration times.
     */
    clear(): void;
}
/**
 * CacheLRU is a custom Map-like class that implements a Least Recently Used (LRU) cache.
 * It automatically evicts the least recently accessed item when the cache reaches its capacity.
 *
 * @template K - The type of the key.
 * @template V - The type of the value.
 */
export declare class CacheLRU<K, V> extends Map<K, V> {
    private capacity;
    /**
     * Constructs a CacheLRU instance with a specified capacity.
     * Once the cache reaches the given capacity, the least recently used item will be evicted when adding new items.
     *
     * @param capacity - The maximum number of items the cache can hold before eviction. Defaults to 100.
     */
    constructor(capacity?: number);
    /**
     * Retrieves a value from the cache. If the item exists, it is moved to the end to mark it as the most recently used.
     * If the item does not exist, it returns `undefined`.
     *
     * @param key - The key of the item to retrieve.
     * @returns The value associated with the key or `undefined` if the item does not exist in the cache.
     */
    get(key: K): V | undefined;
    /**
     * Sets a value in the cache. If the cache exceeds its capacity, the least recently used item will be removed.
     *
     * @param key - The key of the item to set.
     * @param value - The value associated with the key.
     * @returns The CacheLRU instance.
     */
    set(key: K, value: V): this;
}
