import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "../../entities/companies/model/companies";
import employeesReducer from "../../entities/employees/model/employees";

/**
 * Создание Redux store
 */
const store = configureStore({
  reducer: {
    companies: companiesReducer,
    employees: employeesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true,
    }),
  // devTools: process.env.NODE_ENV !== "production",
});

export default store;
