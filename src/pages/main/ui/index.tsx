import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { companiesActions, selectCompanies, selectSelectedCompanies } from "@/entities/companies/model";
import { Company, Employee } from "@/shared/typicode/models";
import { Column } from "@/shared/typicode";
import { employeesActions } from "@/entities/employees/model";
import { selectEmployees, selectSelectedEmployees } from "@/entities/employees/model/employees";

import "./styles.sass";
import { Table } from "@/widgets";

const MainPage = () => {
  // * @state
  /** Сотрудники для отображения в таблице */
  const [employees, setEmployees] = useState<Employee[]>([]);
  /** Компании для отображения в таблице */
  const [companies, setCompanies] = useState<Company[]>([]);

  // * @selectors
  /** Сотрудники */
  const employeesDefault = useSelector(selectEmployees);
  /** Компании */
  const companiesDefault = useSelector(selectCompanies);
  /** выбранные компании */
  const selectedCompanies = useSelector(selectSelectedCompanies);
  /** выбранные сотрудники */
  const selectedEmployee = useSelector(selectSelectedEmployees);

  // * @actions
  const dispatch = useDispatch();

  // * @handlers
  /**
   * Обработчик удаления строки
   * @param id - идентификатор строки
   */
  const handleDeleteCompany = (id: Company["id"]) => {
    dispatch(companiesActions["deleteCompany"](id));
  };

  /**
   * Обработчик выбора строки
   * @param id - идентификатор строки
   */
  const handleSelectCompany = (id: Company["id"][] | Company["id"]) => {
    dispatch(companiesActions["changeSelectedCompanies"](id));
  };

  /**
   * Обработчик сохранения строки
   * @param value - значение ячейки
   * @param rowId - идентификатор строки
   * @param columnKey - ключ столбца
   */
  const handleSaveCompany = (value: Company[keyof Company], row: Company["id"], column: keyof Company) => {
    dispatch(companiesActions["updateCompany"]({ rowId: row, column, value }));
  };

  /**
   * Обработчик удаления строки
   * @param id - идентификатор строки
   */
  const handleDeleteEmployee = (id: Employee["id"]) => {
    dispatch(employeesActions["deleteEmployee"](id));
  };

  /**
   * Обработчик выбора строки
   * @param id - идентификатор строки
   */
  const handleSelectEmployee = (id: Employee["id"][] | Employee["id"]) => {
    dispatch(employeesActions["changeSelectedEmployees"](id));
  };

  /**
   * Обработчик сохранения строки
   * @param value - значение ячейки
   * @param rowId - идентификатор строки
   * @param columnKey - ключ столбца
   */
  const handleSaveEmployee = (value: Employee[keyof Employee], row: Employee["id"], column: keyof Employee) => {
    dispatch(employeesActions["updateEmployee"]({ rowId: row, column, value }));
  };

  /**
   * Обработчик загрузки дополнительных компаний
   */
  const handleLoadMoreCompany = () => {
    dispatch(companiesActions["setMoreCompanies"]());
  };

  /**
   * Колонки таблицы компаний
   */
  const columnsCompanies: Column<Company>[] = [
    {
      key: "name",
      label: "Наименование",
      editable: true,
    },
    {
      key: "employeesCount",
      label: "Кол-во сотрудников",
      width: 100,
      editable: false,
    },
    {
      key: "address",
      label: "Адрес",
      editable: true,
    },
  ];

  /**
   * Колонки таблицы сотрудников
   */
  const columnsEmployees: Column<Employee>[] = [
    {
      key: "surname",
      label: "Фамилия",
      editable: true,
    },
    {
      key: "name",
      label: "Имя",
      editable: true,
    },
    {
      key: "companyName",
      label: "Компания",
      editable: true,
    },
    {
      key: "workPosition",
      label: "Должность",
      editable: true,
    },
  ];

  // * @effects
  useEffect(() => {
    setEmployees(
      employeesDefault
        .filter(employee => selectedCompanies.includes(employee.companyId))
        .sort((a, b) => a.companyName.localeCompare(b.companyName))
    );
  }, [selectedCompanies, companies]);

  useEffect(() => {
    if (employeesDefault.length > 0) {
      dispatch(companiesActions["setCountEmployees"](employeesDefault));
    }
  }, [employeesDefault]);

  useEffect(() => {
    if (companiesDefault.length > companies.length) {
      setTimeout(() => {
        dispatch(employeesActions.setEmployees(companiesDefault.slice(companies.length)));
      }, 100);
    }
    setCompanies(companiesDefault);
  }, [companiesDefault]);

  useEffect(() => {
    dispatch(companiesActions["setCompanies"]());
  }, []);

  return (
    <div className="table-container">
      <div className="table-container-banner">Список компаний</div>
      <div className="table-container-body">
        <div className="companies">
          <Table<Company>
            id="table-companies"
            isDeleteColumn
            rows={companies}
            columns={columnsCompanies}
            onSave={handleSaveCompany}
            onDelete={handleDeleteCompany}
            onSelect={handleSelectCompany}
            selectedRow={selectedCompanies}
            onLoadMore={handleLoadMoreCompany}
          />
        </div>
        {selectedCompanies.length > 0 && (
          <div className="employees">
            <Table<Employee>
              id="table-employees"
              rows={employees}
              isDeleteColumn
              columns={columnsEmployees}
              onDelete={handleDeleteEmployee}
              onSave={handleSaveEmployee}
              selectedRow={selectedEmployee}
              onSelect={handleSelectEmployee}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { MainPage };
