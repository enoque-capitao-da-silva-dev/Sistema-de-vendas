import { CategoryStatus } from "../../domain/enums/category-status.enum";

export interface CreateCategoryOutput {
  id: string;
  nome: string;
  descricao: string | null;
  status: CategoryStatus;
}