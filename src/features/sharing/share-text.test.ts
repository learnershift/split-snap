import { expect, it } from 'vitest'

import { formatShareText } from './share-text'

it('V07-B01 formats exact reconstructable F1 F2 and F3 plaintext', () => {
  expect(formatShareText({
    label: 'USD', precision: 2, payerName: 'Ana', grandTotalUnits: 2954n,
    participants: [
      { name: 'Ana', allocationUnits: 748n, owedUnits: 0n },
      { name: 'Bo', allocationUnits: 1398n, owedUnits: 1398n },
      { name: 'Cy', allocationUnits: 808n, owedUnits: 808n },
    ],
    roundingRecipientName: 'Cy', roundingReason: 'largest discarded remainder',
  })).toBe('SplitSnap\nMonetary label: USD\nPrecision: 2\nPayer: Ana\nGrand total: USD 29.54\nAllocations:\n- Ana: USD 7.48; owes Ana: USD 0.00 (payer)\n- Bo: USD 13.98; owes Ana: USD 13.98\n- Cy: USD 8.08; owes Ana: USD 8.08\nTotal owed to Ana: USD 22.06\nRounding: Cy received +USD 0.01 because Cy had the largest discarded remainder.\n')

  expect(formatShareText({
    label: 'JPY', precision: 0, payerName: 'Dee', grandTotalUnits: 100n,
    participants: [
      { name: 'Dee', allocationUnits: 34n, owedUnits: 0n },
      { name: 'Eli', allocationUnits: 33n, owedUnits: 33n },
      { name: 'Fox', allocationUnits: 33n, owedUnits: 33n },
    ],
    roundingRecipientName: 'Dee', roundingReason: 'equal discarded remainders were tied and Dee appears first in visible participant order',
  })).toBe('SplitSnap\nMonetary label: JPY\nPrecision: 0\nPayer: Dee\nGrand total: JPY 100\nAllocations:\n- Dee: JPY 34; owes Dee: JPY 0 (payer)\n- Eli: JPY 33; owes Dee: JPY 33\n- Fox: JPY 33; owes Dee: JPY 33\nTotal owed to Dee: JPY 66\nRounding: Dee received +JPY 1 because equal discarded remainders were tied and Dee appears first in visible participant order.\n')

  expect(formatShareText({
    label: 'KWD', precision: 3, payerName: 'Gia', grandTotalUnits: 1065n,
    participants: [
      { name: 'Gia', allocationUnits: 533n, owedUnits: 0n },
      { name: 'Han', allocationUnits: 532n, owedUnits: 532n },
    ],
    roundingRecipientName: 'Gia', roundingReason: 'equal discarded remainders were tied and Gia appears first in visible participant order',
  })).toBe('SplitSnap\nMonetary label: KWD\nPrecision: 3\nPayer: Gia\nGrand total: KWD 1.065\nAllocations:\n- Gia: KWD 0.533; owes Gia: KWD 0.000 (payer)\n- Han: KWD 0.532; owes Gia: KWD 0.532\nTotal owed to Gia: KWD 0.532\nRounding: Gia received +KWD 0.001 because equal discarded remainders were tied and Gia appears first in visible participant order.\n')
})
