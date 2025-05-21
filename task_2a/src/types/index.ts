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

// TODO - make it extension of prev task type
export type SimulationResult = {
  totalEnergyConsumed: number; // kWh
  actualMaxPowerDemand: number; // kW
  theoreticalMaxPowerDemand: number; // kW
  concurrencyFactor: number; // percentage
  dataPoints: DataPoint[];
};
