import { v4 as uuidv4 } from "uuid";
import { Chargepoint as IChargepoint } from "./types.js";
import {
  DEFAULT_CHARGEPOINT_POWER,
  DEFAULT_EV_CONSUMPTION,
  TIME_CONSTANTS,
} from "../constants.js";

export class Chargepoint implements IChargepoint {
  private _id: string;
  private _isOccupied: boolean = false;
  private _remainingChargingTime: number = 0; // in ticks
  private _chargePower: number;
  private _totalCharges: number = 0;
  private _totalEnergyConsumption: number = 0;

  constructor(id = uuidv4(), chargePower = DEFAULT_CHARGEPOINT_POWER) {
    this._id = id;
    this._chargePower = chargePower;
  }

  get id(): string {
    return this._id;
  }

  get isOccupied(): boolean {
    return this._isOccupied;
  }

  get chargePower(): number {
    return this._chargePower;
  }

  get remainingChargingTime(): number {
    return this._remainingChargingTime;
  }

  get totalCharges(): number {
    return this._totalCharges;
  }

  get totalEnergyConsumption(): number {
    return this._totalEnergyConsumption;
  }

  getCurrentPowerConsumption(): number {
    return this._isOccupied ? this._chargePower : 0;
  }

  startCharging(demandKm: number): void {
    if (this._isOccupied || demandKm <= 0) return; // already occupied or invalid demand

    const energyDemand = (demandKm / 100) * DEFAULT_EV_CONSUMPTION; // in kWh
    const chargingDuration = energyDemand / this._chargePower; // in hours
    this._remainingChargingTime = Math.ceil(
      chargingDuration * TIME_CONSTANTS.TICKS_PER_HOUR,
    ); // convert to time demand in ticks

    this._isOccupied = true;
    this._totalCharges++;
  }

  tick(): void {
    if (!this._isOccupied) return; // not occupied, nothing to do

    const energyConsumed = this._chargePower / TIME_CONSTANTS.TICKS_PER_HOUR;
    this._totalEnergyConsumption += energyConsumed;

    this._remainingChargingTime--;
    if (this._remainingChargingTime <= 0) this._isOccupied = false; // charging complete
  }

  reset(): void {
    this._isOccupied = false;
    this._remainingChargingTime = 0;
    this._totalEnergyConsumption = 0;
    this._totalCharges = 0;
  }
}
