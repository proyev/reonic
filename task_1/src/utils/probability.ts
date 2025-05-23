import { ARRIVAL_PROBABILITY_BY_HOUR, CHARGING_DEMAND } from "../constants.js";

export const getEVArrivalProbability = (hourIndex: number): number => {
  if (hourIndex < 0 || hourIndex > 23)
    throw new Error("Hour index must be between 0 and 23");

  return ARRIVAL_PROBABILITY_BY_HOUR[hourIndex];
};

export const getEVChargingDemand = (): number => {
  let cumulativeProbability = 0;
  const rnd = Math.random() * 100;

  for (const { probability, demand } of CHARGING_DEMAND) {
    cumulativeProbability += probability;

    if (rnd <= cumulativeProbability) return demand;
  }

  return 0; // if no demand found
};
