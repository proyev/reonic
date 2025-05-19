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
  reset(): void;
}
