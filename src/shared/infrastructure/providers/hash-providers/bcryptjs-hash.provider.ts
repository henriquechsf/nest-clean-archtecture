import { HashProvider } from "@/shared/application/providers/hash-provider";
import { compare, hash } from "bcryptjs";

export class BcryptjsHashProvider implements HashProvider {
  async generateHash(value: string): Promise<string> {
    return hash(value, 6)
  }

  async compareHash(value: string, hash: string): Promise<boolean> {
    return compare(value, hash)
  }
}
