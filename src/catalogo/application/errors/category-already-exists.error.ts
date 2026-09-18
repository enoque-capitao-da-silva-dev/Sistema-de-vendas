export class CategoryAlreadyExistsError
  extends Error
{
  constructor() {
    super('Categoria já cadastrada');
    this.name = 'CategoryAlreadyExistsError';
  }
}
