import { Company, Employee } from "@/shared/typicode/models";
import { customFaker, getDataFaker } from "@/shared/utils";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/shared/typicode";
import { CompaniesState } from "@/shared/typicode/models";

/**
 * Начальная состояние Redux slice для компаний
 */
const initialState: CompaniesState = {
  companies: [],
  selectedCompanies: [],
};

/**
 * Создание компании
 */
const createCompany = () => ({
  id: customFaker.string.uuid(),
  name: customFaker.company.name(),
  employeesCount: null,
  address: customFaker.location.streetAddress(),
});

/**
 * Создание Redux slice для компаний
 */
const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    /**
     * Создание компаний
     */
    setCompanies: state => {
      const newCompanies = getDataFaker<Company>(createCompany, 40);
      state.companies = newCompanies;
    },
    /**
     * Создание новых компаний
     */
    setMoreCompanies: state => {
      state.companies = state.companies.concat(getDataFaker<Company>(createCompany, 20));
    },
    /**
     * Обновление компании
     */
    updateCompany: (
      state,
      action: { payload: { rowId: Company["id"]; column: keyof Company; value: Company[keyof Company] } }
    ) => {
      const { rowId, column, value } = action.payload;
      state.companies = state.companies.map(row => {
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
     * Смена выделенных компаний
     */
    changeSelectedCompanies: (state, action) => {
      if (typeof action.payload === "string") {
        if (state.selectedCompanies.includes(action.payload)) {
          state.selectedCompanies = state.selectedCompanies.filter(id => id !== action.payload);
        } else {
          state.selectedCompanies.push(action.payload);
        }
      } else {
        state.selectedCompanies = action.payload;
      }
    },
    /**
     * Удаление компании
     */
    deleteCompany: (state, action) => {
      state.companies = state.companies.filter(row => row.id !== action.payload);
    },
    /**
     * Установка количества сотрудников
     */
    setCountEmployees: (state, action) => {
      const companiesIds: Company["id"][] = action.payload.map((employee: Employee) => employee.companyId);
      const companyByEmployeesCount: { [key: Company["id"]]: number } = {};
      companiesIds.forEach(id => {
        if (companyByEmployeesCount[id] === undefined) {
          companyByEmployeesCount[id] = 1;
        } else {
          companyByEmployeesCount[id] += 1;
        }
      });
      state.companies = state.companies.map(company => ({
        ...company,
        employeesCount: companyByEmployeesCount[company.id] || 0,
      }));
    },
  },
});

// * @selectors
/**
 * Получение store
 */
const companiesSelector = (state: RootState) => state.companies;
/**
 * Получение массива компаний
 */
export const selectCompanies = (state: RootState) => companiesSelector(state).companies;
/**
 * Получение массива выделенных компаний
 */
export const selectSelectedCompanies = (state: RootState) => companiesSelector(state).selectedCompanies;

// * @actions
/**
 * Экшены компаний
 */
export const companiesActions = companiesSlice.actions;

export default companiesSlice.reducer;
