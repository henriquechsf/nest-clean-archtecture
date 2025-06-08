export interface HashProvider {
  generateHash(value: string): Promise<string>
  compareHash(value: string, hash: string): Promise<boolean>
}
