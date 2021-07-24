/**
 * Mock Logger Message Literal
 */
export function mlm(chunks: TemplateStringsArray, data: unknown): string {
  return `${chunks[0]}(${JSON.stringify(data)})`;
}
