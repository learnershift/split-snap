export type DraftInputs = {
  monetaryLabel: string
  precision: number
  participants: string[]
  preTaxTotalUnits: bigint
  mode?: string
  payerId?: string
  taxPercentage?: string
  fixedTip?: string
  items?: { description: string; amount: string; participants: { included: boolean; share: string }[] }[]
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

export function restoreDraft(bytes: string):
  | { ok: true; inputs: DraftInputs }
  | { ok: false; code: 'draft_unreadable'; originalBytes: string } {
  try {
    const draft = JSON.parse(bytes) as StoredDraft
    if (draft.schemaVersion !== 1) {
      return { ok: false, code: 'draft_unreadable', originalBytes: bytes }
    }

    return {
      ok: true,
      inputs: { ...draft.inputs, preTaxTotalUnits: BigInt(draft.inputs.preTaxTotalUnits) },
    }
  } catch {
    return { ok: false, code: 'draft_unreadable', originalBytes: bytes }
  }
}

export function saveDraft(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  inputs: DraftInputs,
): { ok: true } | { ok: false; priorBytes: string | null } {
  const priorBytes = storage.getItem('split-snap:v1:draft')

  try {
    storage.setItem('split-snap:v1:draft', serializeDraft(inputs))
    return { ok: true }
  } catch {
    return { ok: false, priorBytes }
  }
}
