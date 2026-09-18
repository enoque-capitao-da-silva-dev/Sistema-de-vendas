import { CategoryStatus } from "../../domain/enums/category-status.enum";

export interface ListCategoriesInput {
  status: CategoryStatus;
}