export type ChargingDemand = {
  probability: number;
  demand: number; // in km
};

export interface Chargepoint {
  id: string;
  isOccupied: boolean;
  chargePower: number; // in kW
  totalCharges: number;
  totalEnergyConsumption: number; // in kWh

  startCharging(demandKm: number): void;
  tick(): void; // process a tick of time
  reset(): void;
}

export type SimulationResult = {
  totalEnergyConsumed: number; // in kWh
  theoreticalMaxPowerDemand: number; // in kW
  actualMaxPowerDemand: number;
  concurrencyFactor: number; // ratio of actual max power demand to theoretical max power demand
};
