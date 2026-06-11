import { type Property, MOCK_PROPERTIES } from '../data/properties';

/**
 * simulated API service with controlled delays representing realistic server interactions
 */
export const api = {
  /**
   * Fetches all properties asynchronously
   */
  getProperties: (): Promise<Property[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PROPERTIES);
      }, 350); // 350ms delay
    });
  },

  /**
   * Fetches a single property by its ID
   */
  getPropertyById: (id: string): Promise<Property | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_PROPERTIES.find((p) => p.id === id);
        resolve(found);
      }, 250); // 250ms delay
    });
  },
};
