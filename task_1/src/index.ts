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

// Main Task: Simulation Results

console.log("Simulation Results:");
console.log(`Total energy consumed: ${totalEnergyConsumed.toFixed(2)} kWh`);
console.log(
  `Theoretical maximum power demand: ${theoreticalMaxPowerDemand} kW`,
);
console.log(
  `Actual maximum power demand: ${actualMaxPowerDemand.toFixed(2)} kW`,
);
console.log(`Concurrency factor: ${concurrencyFactor.toFixed(2)}%`);
console.log("========================================");

// Bonus Task: Concurrency Factor Analysis

console.log("\n|======= Bonus Task: Concurrency Factor Analysis =======|");
console.log(
  "Running simulation for 1-30 chargepoints to analyze concurrency factor behavior\n",
);

console.log("Chargepoints | Max Power (kW) | Concurrency Factor (%)");
console.log("-------------|----------------|---------------------");

const concurrencyFactors = [];

// run sim for 1-30 chargepoints
for (let numChargepoints = 1; numChargepoints <= 30; numChargepoints++) {
  // create chargepoints
  const scenarioChargepoints = Array.from(
    { length: numChargepoints },
    () => new Chargepoint(),
  );

  const result = runSim(scenarioChargepoints);

  // store concurrency factor for analysis
  concurrencyFactors.push(result.concurrencyFactor);

  // display results in table format
  console.log(
    `${numChargepoints.toString().padStart(12)} | ` +
      `${result.actualMaxPowerDemand.toFixed(2).padStart(14)} | ` +
      `${result.concurrencyFactor.toFixed(2).padStart(20)}`,
  );
}

const minCF = Math.min(...concurrencyFactors);
const maxCF = Math.max(...concurrencyFactors);
const avgCF =
  concurrencyFactors.reduce((sum, cf) => sum + cf, 0) /
  concurrencyFactors.length;

console.log("\nConcurrency Factor Analysis:");
console.log(`Minimum: ${minCF.toFixed(2)}%`);
console.log(`Maximum: ${maxCF.toFixed(2)}%`);
console.log(`Average: ${avgCF.toFixed(2)}%`);

const firstHalfAvg =
  concurrencyFactors.slice(0, 15).reduce((sum, cf) => sum + cf, 0) / 15;
const secondHalfAvg =
  concurrencyFactors.slice(15).reduce((sum, cf) => sum + cf, 0) / 15;
const trend = secondHalfAvg > firstHalfAvg ? "increasing" : "decreasing";

console.log(
  `Trend: Concurrency factor tends to be ${trend} as the number of chargepoints increases`,
);
console.log("==========================================================");
