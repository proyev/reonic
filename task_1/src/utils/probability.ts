import { ARRIVAL_PROBABILITY_BY_HOUR } from "../constants";

export const getEVArrivalProbability = (hourIndex: number): number => {
  if (hourIndex < 0 || hourIndex > 23)
    throw new Error("Hour index must be between 0 and 23");

  return ARRIVAL_PROBABILITY_BY_HOUR[hourIndex];
};

export const doesEVArrive = (hourIndex: number): boolean => {
  const probability = getEVArrivalProbability(hourIndex);

  return Math.random() * 100 < probability;
};
