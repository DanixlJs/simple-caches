/**
 * CacheTTL is a custom Map-like class that supports TTL (Time To Live) functionality.
 * It allows items to be stored with an expiration time and automatically removes expired items.
 *
 * @template K - The type of the key
 * @template V - The type of the value
 */
export class CacheTTL extends Map {
    interval;
    expirationTimes;
    expirationInterval;
    /**
     * Starts the expiration interval if it's not already active.
     * It checks periodically if any items have expired and removes them from the cache.
     */
    startExpirationInterval() {
        if (this.expirationInterval === undefined && this.expirationTimes.size > 0 && this.interval > 0) {
            this.expirationInterval = setInterval(() => {
                const now = Date.now();
                this.expirationTimes.forEach((ttl, key) => {
                    if (now > ttl) {
                        this.expirationTimes.delete(key);
                        super.delete(key);
                    }
                });
                if (this.expirationTimes.size === 0) {
                    clearInterval(this.expirationInterval);
                    this.expirationInterval = undefined;
                }
            }, this.interval);
        }
    }
    /**
     * Constructs a CacheTTL instance with an optional expiration interval.
     * If a non-zero interval is provided, the expiration check will run periodically.
     *
     * @param interval - The interval (in milliseconds) for checking expired items.
     */
    constructor(interval = 0) {
        super();
        this.interval = interval;
        this.expirationTimes = new Map();
        this.expirationInterval = undefined;
        if (this.interval > 0) {
            this.startExpirationInterval();
        }
    }
    /**
     * Sets a value in the cache with an optional TTL (Time To Live).
     * The item will expire after the specified TTL and be automatically removed.
     *
     * @param key - The key of the item to set.
     * @param data - The value associated with the key.
     * @param ttl - The time-to-live (TTL) for the item in milliseconds. Defaults to the interval.
     * @returns The CacheTTL instance.
     */
    set(key, data, ttl = this.interval) {
        super.set(key, data);
        const expirationTime = Date.now() + ttl;
        this.expirationTimes.set(key, expirationTime);
        this.startExpirationInterval();
        return this;
    }
    /**
     * Gets a value from the cache. If the item has expired, it is removed from the cache.
     *
     * @param key - The key of the item to retrieve.
     * @returns The value associated with the key or `undefined` if the item has expired.
     */
    get(key) {
        const expirationTime = this.expirationTimes.get(key);
        if (expirationTime && Date.now() > expirationTime) {
            this.expirationTimes.delete(key);
            super.delete(key);
            return undefined;
        }
        return super.get(key);
    }
    /**
     * Deletes a value from the cache.
     *
     * @param key - The key of the item to delete.
     * @returns `true` if the item was deleted, `false` otherwise.
     */
    delete(key) {
        this.expirationTimes.delete(key);
        return super.delete(key);
    }
    /**
     * Clears the entire cache, including expiration times.
     */
    clear() {
        this.expirationTimes.clear();
        super.clear();
    }
}
/**
 * CacheLRU is a custom Map-like class that implements a Least Recently Used (LRU) cache.
 * It automatically evicts the least recently accessed item when the cache reaches its capacity.
 *
 * @template K - The type of the key.
 * @template V - The type of the value.
 */
export class CacheLRU extends Map {
    capacity;
    /**
     * Constructs a CacheLRU instance with a specified capacity.
     * Once the cache reaches the given capacity, the least recently used item will be evicted when adding new items.
     *
     * @param capacity - The maximum number of items the cache can hold before eviction. Defaults to 100.
     */
    constructor(capacity = 100) {
        super();
        this.capacity = capacity;
    }
    /**
     * Retrieves a value from the cache. If the item exists, it is moved to the end to mark it as the most recently used.
     * If the item does not exist, it returns `undefined`.
     *
     * @param key - The key of the item to retrieve.
     * @returns The value associated with the key or `undefined` if the item does not exist in the cache.
     */
    get(key) {
        if (!super.has(key)) {
            return undefined;
        }
        const value = super.get(key);
        super.delete(key);
        super.set(key, value);
        return value;
    }
    /**
     * Sets a value in the cache. If the cache exceeds its capacity, the least recently used item will be removed.
     *
     * @param key - The key of the item to set.
     * @param value - The value associated with the key.
     * @returns The CacheLRU instance.
     */
    set(key, value) {
        if (super.size >= this.capacity) {
            super.delete(super.keys().next().value);
        }
        super.set(key, value);
        return this;
    }
}
