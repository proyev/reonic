import { describe, test, expect } from "@jest/globals";
import {
  getEVArrivalProbability,
  getEVChargingDemand,
} from "../utils/probability.js";
import { ARRIVAL_PROBABILITY_BY_HOUR, CHARGING_DEMAND } from "../constants.js";

describe("Probability Utilities", () => {
  describe("getEVArrivalProbability", () => {
    test("should return correct probability for valid hour indices", () => {
      expect(getEVArrivalProbability(0)).toBe(ARRIVAL_PROBABILITY_BY_HOUR[0]);
      expect(getEVArrivalProbability(12)).toBe(ARRIVAL_PROBABILITY_BY_HOUR[12]);
      expect(getEVArrivalProbability(23)).toBe(ARRIVAL_PROBABILITY_BY_HOUR[23]);
    });

    test("should throw error for invalid hour index", () => {
      expect(() => getEVArrivalProbability(-1)).toThrow();
      expect(() => getEVArrivalProbability(24)).toThrow();
    });
  });

  describe("getEVChargingDemand", () => {
    test("should return a valid demand value", () => {
      for (let i = 0; i < 100; i++) {
        const demand = getEVChargingDemand();

        const validDemands = CHARGING_DEMAND.map((item) => item.demand);
        expect(validDemands).toContain(demand);
      }
    });

    test("should statistically follow the probability distribution", () => {
      const sampleSize = 10000;
      const demandCounts: {
        [key: string]: number;
      } = {};

      CHARGING_DEMAND.forEach((item) => {
        demandCounts[item.demand] = 0;
      });

      for (let i = 0; i < sampleSize; i++) {
        const demand = getEVChargingDemand();
        demandCounts[demand]++;
      }

      CHARGING_DEMAND.forEach((item) => {
        const expectedCount = (item.probability / 100) * sampleSize;
        const actualCount = demandCounts[item.demand];

        expect(actualCount).toBeGreaterThanOrEqual(expectedCount * 0.7);
        expect(actualCount).toBeLessThanOrEqual(expectedCount * 1.3);
      });
    });
  });
});
