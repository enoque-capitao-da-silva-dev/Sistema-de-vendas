export class MyCustomError extends Error {
  constructor(msg: string, public readonly code: number = 400) {
    super(msg);
  }
}