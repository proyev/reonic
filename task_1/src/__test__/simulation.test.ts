import { describe, test, expect, jest } from "@jest/globals";
import { runSim } from "../simulation.js";
import { Chargepoint } from "../models/chargepoint.js";

describe("Simulation", () => {
  test("should run with one chargepoint for one day", () => {
    const chargepoints = [new Chargepoint()];

    const result = runSim(chargepoints, 1); // Just run for 1 day

    expect(result).toBeDefined();
    expect(result.totalEnergyConsumed).toBeGreaterThanOrEqual(0);
    expect(result.theoreticalMaxPowerDemand).toBe(11); // One chargepoint * 11kW
    expect(result.actualMaxPowerDemand).toBeGreaterThanOrEqual(0);
    expect(result.actualMaxPowerDemand).toBeLessThanOrEqual(11);
    expect(result.concurrencyFactor).toBeGreaterThanOrEqual(0);
    expect(result.concurrencyFactor).toBeLessThanOrEqual(100);
  });

  test("should reset chargepoints before simulation", () => {
    const chargepoint = new Chargepoint();

    chargepoint.startCharging(100);
    chargepoint.tick();

    const resetSpy = jest.spyOn(chargepoint, "reset");

    runSim([chargepoint], 1);

    expect(resetSpy).toHaveBeenCalled();

    resetSpy.mockRestore();
  });

  test("should support multiple chargepoints", () => {
    const numChargepoints = 5;
    const chargepoints = Array.from(
      { length: numChargepoints },
      (_, i) => new Chargepoint(`cp-${i}`),
    );

    const result = runSim(chargepoints, 1);

    expect(result.theoreticalMaxPowerDemand).toBe(numChargepoints * 11);
  });
});
