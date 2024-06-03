import { Company, Employee } from "@/shared/typicode/models";
import { customFaker, getDataFaker, getRandomItem } from "@/shared/utils";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/shared/typicode";
import { EmployeesState } from "@/shared/typicode/models";

/**
 * Начальная состояние Redux slice для сотрудников
 */
const initialState: EmployeesState = {
  employees: [],
  selectedEmployees: [],
};

/**
 * Создание сотрудника
 */
const createEmployee = (companies: { id: Company["id"]; name: Company["name"] }[]) => {
  const company = getRandomItem(companies);
  return {
    id: customFaker.string.uuid(),
    companyId: company.id,
    companyName: company.name,
    name: customFaker.person.firstName(),
    surname: customFaker.person.lastName(),
    workPosition: customFaker.person.jobType(),
  };
};

/**
 * Создание Redux slice для сотрудников
 */
const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    /**
     * Создание сотрудников
     */
    setEmployees: (state, action: { payload: Company[] }) => {
      const companies = action.payload.map(company => ({ id: company.id, name: company.name }));
      state.employees = state.employees.concat(getDataFaker<Employee>(() => createEmployee(companies), 80));
    },
    /**
     * Обновление сотрудника
     */
    updateEmployee: (
      state,
      action: { payload: { rowId: Employee["id"]; column: keyof Employee; value: Employee[keyof Employee] } }
    ) => {
      const { rowId, column, value } = action.payload;
      state.employees = state.employees.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            [column]: value,
          };
        }
        return row;
      });
    },
    /**
     * Изменение выделенных сотрудников
     */
    changeSelectedEmployees: (state, action) => {
      if (typeof action.payload === "string") {
        if (state.selectedEmployees.includes(action.payload)) {
          state.selectedEmployees = state.selectedEmployees.filter(id => id !== action.payload);
        } else {
          state.selectedEmployees.push(action.payload);
        }
      } else {
        state.selectedEmployees = action.payload;
      }
    },
    /**
     * Удаление сотрудника
     */
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(row => row.id !== action.payload);
    },
  },
});

// * @selectors
/**
 * Получение store
 */
const employeesSelector = (state: RootState) => state.employees;
/**
 * Получение массива сотрудников
 */
export const selectEmployees = (state: RootState) => employeesSelector(state).employees;
/**
 * Получение массива выделенных сотрудников
 */
export const selectSelectedEmployees = (state: RootState) => employeesSelector(state).selectedEmployees;

// * @actions
/**
 * Экшены для сотрудников
 */
export const employeesActions = employeesSlice.actions;

export default employeesSlice.reducer;
