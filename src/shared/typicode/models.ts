/**
 * Структура компании
 * id - идентификатор компании
 * name - название компании
 * employeesCount - количество сотрудников
 * address - адрес
 */
export type Company = {
  id: string;
  name: string;
  employeesCount: number | null;
  address: string;
};

/**
 * Структура slice для компаний
 */
export type CompaniesState = {
  companies: Company[];
  selectedCompanies: string[];
};

/**
 * Структура сотрудника
 * id - идентификатор сотрудника
 * name - имя сотрудника
 * surname - фамилия сотрудника
 * companyId - идентификатор компании
 * companyName - название компании
 * workPosition - работа позиция
 */
export type Employee = {
  id: string;
  name: string;
  surname: string;
  companyId: string;
  companyName: string;
  workPosition: string;
};

/**
 * Структура slice для сотрудников
 */
export type EmployeesState = {
  employees: Employee[];
  selectedEmployees: string[];
};
