export type TValidationErrors = Record<string, string>;

export interface IItemsPagination<T> {
  page: number;
  items: T;
  size: number;
  currentPage: number;
  totalPage: number;
}
