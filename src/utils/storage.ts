// Storage utility functions for localStorage operations
// Designed to be easily replaceable with backend API calls

const DEFAULT_NAMESPACE = 'erp_civi';

export const storage = {
  /**
   * Get item from localStorage
   * @param key Storage key
   * @param namespace Optional namespace, defaults to ERP_CIVI
   * @returns Parsed object or null
   */
  getItem<T>(key: string, namespace: string = DEFAULT_NAMESPACE): T | null {
    try {
      const fullKey = `${namespace}:${key}`;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param key Storage key
   * @param value Data to store
   * @param namespace Optional namespace
   */
  setItem<T>(key: string, value: T, namespace: string = DEFAULT_NAMESPACE): void {
    try {
      const fullKey = `${namespace}:${key}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  /**
   * Remove item from localStorage
   * @param key Storage key
   * @param namespace Optional namespace
   */
  removeItem(key: string, namespace: string = DEFAULT_NAMESPACE): void {
    try {
      const fullKey = `${namespace}:${key}`;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  /**
   * Clear all items in a namespace
   * @param namespace Optional namespace
   */
  clear(namespace: string = DEFAULT_NAMESPACE): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${namespace}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },

  /**
   * Get all items in a namespace (debugging)
   * @param namespace Optional namespace
   */
  getAllItems(namespace: string = DEFAULT_NAMESPACE): Record<string, any> {
    const items: Record<string, any> = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`${namespace}:`)) {
        const cleanKey = key.replace(`${namespace}:`, '');
        items[cleanKey] = this.getItem(cleanKey, namespace);
      }
    });
    return items;
  },
};

// Export for mockability - can be replaced with API service
export interface IDataService {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

export const dataService: IDataService = storage;
