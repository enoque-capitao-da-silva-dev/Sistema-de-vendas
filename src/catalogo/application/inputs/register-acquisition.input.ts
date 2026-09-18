/*export interface RegisterAcquisitionInput {
  produtoId: string;
  quantidade: number;
  referenciaId?: string | null;
}*/

export interface RegisterAcquisitionInput {
  productId: string;
  quantity: number;
  referenceId?: string | null;
  reason?: string | null;
}