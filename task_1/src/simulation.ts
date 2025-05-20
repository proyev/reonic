import { TIME_CONSTANTS } from "./constants.js";
import { Chargepoint } from "./models/chargepoint.js";
import { SimulationResult } from "./models/types.js";
import {
  getEVArrivalProbability,
  getEVChargingDemand,
} from "./utils/probability.js";

export const runSim = (
  chargepoints: Chargepoint[],
  simDuration = TIME_CONSTANTS.DAYS_PER_YEAR, // in days
): SimulationResult => {
  let maxPowerDemand = 0;
  chargepoints.forEach((chargepoint) => chargepoint.reset()); // reset all the values before sim run

  // each day
  for (let day = 0; day < simDuration; day++) {
    // each hour of day
    for (let hour = 0; hour < TIME_CONSTANTS.HOURS_PER_DAY; hour++) {
      // each tick of hour
      for (let tick = 0; tick < TIME_CONSTANTS.TICKS_PER_HOUR; tick++) {
        let currentPowerDemand = 0;

        // process each chargepoint
        for (const chargepoint of chargepoints) {
          // if chargepoint is empty, check for new EV arrival
          if (!chargepoint.isOccupied) {
            // EV arrival probability for this tick
            const intervalProbability =
              getEVArrivalProbability(hour) / TIME_CONSTANTS.TICKS_PER_HOUR;

            // if EV arrives during this tick
            if (Math.random() * 100 < intervalProbability) {
              const demand = getEVChargingDemand();

              if (demand > 0) chargepoint.startCharging(demand);
            }
          }

          currentPowerDemand += chargepoint.getCurrentPowerConsumption();

          // process the chargepoint for this tick
          chargepoint.tick();
        }

        if (currentPowerDemand > maxPowerDemand)
          maxPowerDemand = currentPowerDemand;
      }
    }
  }

  const totalEnergyConsumed = chargepoints.reduce(
    (sum, chargepoint) => sum + chargepoint.totalEnergyConsumption,
    0,
  );

  const theoreticalMaxPowerDemand = chargepoints.reduce(
    (sum, chargepoint) => sum + chargepoint.chargePower,
    0,
  );

  const concurrencyFactor = (maxPowerDemand / theoreticalMaxPowerDemand) * 100;

  return {
    totalEnergyConsumed,
    theoreticalMaxPowerDemand,
    actualMaxPowerDemand: maxPowerDemand,
    concurrencyFactor,
  };
};
