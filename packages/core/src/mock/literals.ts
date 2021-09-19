/**
 * Mock Logger Message Literal
 */
export function mlm(chunks: TemplateStringsArray, data: unknown): string {
  return `${chunks[0]}(${JSON.stringify(data)})`;
}

/**
 * Mock Logger Message Literal
 */
export function mlmk(chunks: TemplateStringsArray, klass: string, data: unknown): string {
  return `${klass}${chunks[0]}(${JSON.stringify(data)})`;
}
