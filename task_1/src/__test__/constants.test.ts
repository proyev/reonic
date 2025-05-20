import { describe, test, expect } from "@jest/globals";
import {
  TIME_CONSTANTS,
  ARRIVAL_PROBABILITY_BY_HOUR,
  CHARGING_DEMAND,
} from "../constants.js";

describe("Constants", () => {
  test("TIME_CONSTANTS should have correct values", () => {
    expect(TIME_CONSTANTS.MINUTES_PER_TICK).toBe(15);
    expect(TIME_CONSTANTS.HOURS_PER_DAY).toBe(24);
    expect(TIME_CONSTANTS.TICKS_PER_HOUR).toBe(4); // 60 / 15
    expect(TIME_CONSTANTS.TICKS_PER_DAY).toBe(96); // 24 * 4
    expect(TIME_CONSTANTS.DAYS_PER_YEAR).toBe(365);
    expect(TIME_CONSTANTS.TICKS_PER_YEAR).toBe(35040); // 365 * 96
  });

  test("ARRIVAL_PROBABILITY_BY_HOUR should have 24 values", () => {
    expect(ARRIVAL_PROBABILITY_BY_HOUR.length).toBe(24);
  });

  test("ARRIVAL_PROBABILITY_BY_HOUR should sum to approximately 100%", () => {
    const sum = ARRIVAL_PROBABILITY_BY_HOUR.reduce((acc, val) => acc + val, 0);
    expect(Math.round(sum)).toBeCloseTo(100);
  });

  test("CHARGING_DEMAND probabilities should sum to approximately 100%", () => {
    const sum = CHARGING_DEMAND.reduce(
      (acc, item) => acc + item.probability,
      0,
    );
    expect(Math.round(sum)).toBeCloseTo(100);
  });
});
