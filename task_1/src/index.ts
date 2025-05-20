import {
  DEFAULT_CHARGEPOINT_POWER,
  DEFAULT_NUM_CHARGEPOINTS,
} from "./constants.js";
import { Chargepoint } from "./models/chargepoint.js";
import { runSim } from "./simulation.js";

console.log("|======= EV Charging Simulation =======|");

console.log(
  `Task 1: simulating ${DEFAULT_NUM_CHARGEPOINTS} chargepoints with ${DEFAULT_CHARGEPOINT_POWER}kw for 1 year (365 days) \n`,
);

const chargepoints = Array.from(
  { length: DEFAULT_NUM_CHARGEPOINTS },
  () => new Chargepoint(),
);

const {
  totalEnergyConsumed,
  theoreticalMaxPowerDemand,
  actualMaxPowerDemand,
  concurrencyFactor,
} = runSim(chargepoints);

console.log("Simulation Results:");
console.log(`Total energy consumed: ${totalEnergyConsumed.toFixed(2)} kWh`);
console.log(
  `Theoretical maximum power demand: ${theoreticalMaxPowerDemand} kW`,
);
console.log(
  `Actual maximum power demand: ${actualMaxPowerDemand.toFixed(2)} kW`,
);
console.log(`Concurrency factor: ${concurrencyFactor}%`);
console.log("========================================");
