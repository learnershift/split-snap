export function trimToCodePointLimit(value: string, maximum: number): string {
  return Array.from(value.trim()).slice(0, maximum).join('')
}

export function sameParticipantName(left: string, right: string): boolean {
  return left.trim().normalize('NFC') === right.trim().normalize('NFC')
}
