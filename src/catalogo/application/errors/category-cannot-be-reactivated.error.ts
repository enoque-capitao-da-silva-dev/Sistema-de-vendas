export class CategoryCannotBeReactivatedError extends Error {
  constructor() {
    super('A categoria já está ativa');

    this.name = 'CategoryCannotBeReactivatedError';
  }
}
