export function addFixedAdditions(subtotalUnits: bigint, taxUnits: bigint, tipUnits: bigint) {
  return { taxUnits, tipUnits, grandTotalUnits: subtotalUnits + taxUnits + tipUnits }
}

export function calculatePercentageAddition(subtotalUnits: bigint, percentage: bigint): bigint {
  const numerator = subtotalUnits * percentage
  const units = numerator / 100n
  const remainder = numerator % 100n

  return remainder * 2n >= 100n ? units + 1n : units
}
