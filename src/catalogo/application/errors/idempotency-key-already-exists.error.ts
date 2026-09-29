export class IdempotencyKeyAlreadyExistsError extends Error {
  constructor() {
    super('A chave de idempotência já foi utilizada.');
    this.name = 'IdempotencyKeyAlreadyExistsError';
  }
}