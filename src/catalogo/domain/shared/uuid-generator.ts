import { IdGenerator } from "./id-generator";

export class UuidGenerador implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}