export function addFixedAdditions(subtotalUnits: bigint, taxUnits: bigint, tipUnits: bigint) {
  return { taxUnits, tipUnits, grandTotalUnits: subtotalUnits + taxUnits + tipUnits }
}
