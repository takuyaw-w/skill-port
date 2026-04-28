export function formatEmployeeName(input: { familyName: string; givenName: string }) {
  return `${input.familyName} ${input.givenName}`;
}
