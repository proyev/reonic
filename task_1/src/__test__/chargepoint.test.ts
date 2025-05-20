import { describe, test, expect, beforeEach } from "@jest/globals";
import { Chargepoint } from "../models/chargepoint.js";
import { DEFAULT_CHARGEPOINT_POWER, TIME_CONSTANTS } from "../constants.js";

describe("Chargepoint", () => {
  let chargepoint: Chargepoint;

  beforeEach(() => {
    chargepoint = new Chargepoint("test-id", DEFAULT_CHARGEPOINT_POWER);
  });

  test("should initialize with correct values", () => {
    expect(chargepoint.id).toBe("test-id");
    expect(chargepoint.chargePower).toBe(DEFAULT_CHARGEPOINT_POWER);
    expect(chargepoint.isOccupied).toBe(false);
    expect(chargepoint.totalEnergyConsumption).toBe(0);
    expect(chargepoint.totalCharges).toBe(0);
    expect(chargepoint.getCurrentPowerConsumption()).toBe(0);
  });

  test("should not start charging with invalid demand", () => {
    chargepoint.startCharging(0);
    expect(chargepoint.isOccupied).toBe(false);
    expect(chargepoint.totalCharges).toBe(0);
  });

  test("should start charging with valid demand", () => {
    chargepoint.startCharging(100);
    expect(chargepoint.isOccupied).toBe(true);
    expect(chargepoint.totalCharges).toBe(1);
    expect(chargepoint.getCurrentPowerConsumption()).toBe(
      DEFAULT_CHARGEPOINT_POWER,
    );
  });

  test("should calculate correct charging time", () => {
    chargepoint.startCharging(100);
    expect(chargepoint.remainingChargingTime).toBe(7);
  });

  test("should consume energy during tick", () => {
    chargepoint.startCharging(100);
    const initialEnergy = chargepoint.totalEnergyConsumption;
    chargepoint.tick();

    const expectedEnergyConsumed =
      DEFAULT_CHARGEPOINT_POWER * (TIME_CONSTANTS.MINUTES_PER_TICK / 60);
    expect(chargepoint.totalEnergyConsumption).toBeCloseTo(
      initialEnergy + expectedEnergyConsumed,
    );
  });

  test("should decrement remaining time during tick", () => {
    chargepoint.startCharging(100);
    const initialTime = chargepoint.remainingChargingTime;
    chargepoint.tick();
    expect(chargepoint.remainingChargingTime).toBe(initialTime - 1);
  });

  test("should finish charging when remaining time reaches zero", () => {
    chargepoint.startCharging(5);
    expect(chargepoint.remainingChargingTime).toBe(1);

    chargepoint.tick();
    expect(chargepoint.isOccupied).toBe(false);
    expect(chargepoint.getCurrentPowerConsumption()).toBe(0);
  });

  test("should reset all values", () => {
    chargepoint.startCharging(100);
    chargepoint.tick();

    chargepoint.reset();
    expect(chargepoint.isOccupied).toBe(false);
    expect(chargepoint.remainingChargingTime).toBe(0);
    expect(chargepoint.totalCharges).toBe(0);
    expect(chargepoint.totalEnergyConsumption).toBe(0);
  });
});
