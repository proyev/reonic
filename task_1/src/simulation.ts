import { TIME_CONSTANTS } from "./constants";
import { Chargepoint, SimulationResult } from "./models/types";

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
          console.log(chargepoint, currentPowerDemand);
        }
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

  const concurrencyFactor = maxPowerDemand / theoreticalMaxPowerDemand;

  return {
    totalEnergyConsumed,
    theoreticalMaxPowerDemand,
    actualMaxPowerDemand: maxPowerDemand,
    concurrencyFactor,
  };
};
