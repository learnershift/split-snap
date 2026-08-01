export type DraftInputs = {
  monetaryLabel: string
  precision: number
  participants: string[]
  preTaxTotalUnits: bigint
}

type StoredDraft = {
  schemaVersion: 1
  inputs: Omit<DraftInputs, 'preTaxTotalUnits'> & { preTaxTotalUnits: string }
}

export function serializeDraft(inputs: DraftInputs): string {
  const draft: StoredDraft = {
    schemaVersion: 1,
    inputs: { ...inputs, preTaxTotalUnits: inputs.preTaxTotalUnits.toString() },
  }

  return JSON.stringify(draft)
}

export function restoreDraft(bytes: string): { ok: true; inputs: DraftInputs } {
  const draft = JSON.parse(bytes) as StoredDraft
  return {
    ok: true,
    inputs: { ...draft.inputs, preTaxTotalUnits: BigInt(draft.inputs.preTaxTotalUnits) },
  }
}
