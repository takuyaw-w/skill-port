export function uniqueEmail(prefix: string) {
  return `${prefix}-${globalThis.crypto.randomUUID()}@example.com`;
}
