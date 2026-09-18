export class CategoryAlreadyActiveError
  extends Error
{
  constructor() {
    super('A categoria já está ativa');
  }
}