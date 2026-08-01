export type Rational = { numerator: bigint; denominator: bigint }

function greatestCommonDivisor(left: bigint, right: bigint): bigint {
  while (right !== 0n) {
    ;[left, right] = [right, left % right]
  }

  return left
}

export function normalizeRational(numerator: bigint, denominator: bigint): Rational {
  if (denominator === 0n) {
    throw new RangeError('Rational denominator must not be zero')
  }

  const sign = denominator < 0n ? -1n : 1n
  const normalizedNumerator = numerator * sign
  const normalizedDenominator = denominator * sign
  const divisor = greatestCommonDivisor(normalizedNumerator, normalizedDenominator)

  return {
    numerator: normalizedNumerator / divisor,
    denominator: normalizedDenominator / divisor,
  }
}
