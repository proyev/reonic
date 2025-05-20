import { ChargingDemand } from "./models/types.js";

export const DEFAULT_CHARGEPOINT_POWER = 11; // default charging power in kW
export const DEFAULT_NUM_CHARGEPOINTS = 20;

export const DEFAULT_EV_CONSUMPTION = 18; // kWh per 100 km

export const TIME_CONSTANTS = {
  MINUTES_PER_TICK: 15,
  HOURS_PER_DAY: 24,
  DAYS_PER_YEAR: 365,
  TICKS_PER_HOUR: 60 / 15,
  TICKS_PER_DAY: 24 * (60 / 15),
  TICKS_PER_YEAR: 365 * 24 * (60 / 15),
};

// probability of arrival by hour of day, index corresponds to hour (0-23)
export const ARRIVAL_PROBABILITY_BY_HOUR: number[] = [
  0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 2.83, 2.83, 5.66, 5.66, 5.66,
  7.55, 7.55, 7.55, 10.38, 10.38, 10.38, 4.72, 4.72, 4.72, 0.94, 0.94,
];

export const CHARGING_DEMAND: ChargingDemand[] = [
  {
    probability: 34.31,
    demand: 0,
  },
  {
    probability: 4.9,
    demand: 5,
  },
  {
    probability: 9.8,
    demand: 10,
  },
  {
    probability: 11.76,
    demand: 20,
  },
  {
    probability: 8.82,
    demand: 30,
  },
  {
    probability: 11.76,
    demand: 50,
  },
  {
    probability: 10.78,
    demand: 100,
  },
  {
    probability: 4.9,
    demand: 200,
  },
  {
    probability: 2.94,
    demand: 300,
  },
];
