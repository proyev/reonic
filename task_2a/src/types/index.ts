export type SimulationParams = {
  numChargePoints: number;
  arrivalProbabilityMultiplier: number; // percentage
  evConsumption: number; // kWh/100km
  chargePower: number; // kW
};

export type DataPoint = {
  timestamp: Date;
  powerConsumption: number; // kW
  numActiveChargePoints: number;
};

export type SimulationResult = {
  totalEnergyConsumed: number; // kWh
  actualMaxPowerDemand: number; // kW
  theoreticalMaxPowerDemand: number; // kW
  concurrencyFactor: number; // percentage
  dataPoints: DataPoint[];
};

export type TimeframeOption = "day" | "week" | "month" | "year";
