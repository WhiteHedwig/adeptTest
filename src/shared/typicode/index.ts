import { CompaniesState, EmployeesState } from "./models";

export type RootState = {
  companies: CompaniesState;
  employees: EmployeesState;
};

/**
 * Интерфейс колонки таблицы
 * key - ключ столбца
 * label - название столбца
 * editable - флаг для редактирования столбца
 * width - ширина столбца
 */
export interface Column<T> {
  key: keyof T;
  label: string;
  width?: number;
  editable?: boolean;
}
