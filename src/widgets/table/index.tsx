import React, { useEffect, useRef, useState } from "react";
import { CellText } from "@/entities/ui";
import EditableCell from "@/entities/ui/editCellText";
import { Column } from "@/shared/typicode";
import deleteIcon from "./deleteIcon.svg";

import "./style.sass";

type Row = {
  id: string;
};

/**
 * Компонент для отображения таблицы
 * @param {
 *   id - идентификатор таблицы
 *   rows - массив строк
 *   columns - массив колонок
 *   selectedRow - массив выделенных строк
 *   onDelete - функция для удаления строки
 *   onSave - функция для сохранения изменений
 *   onSelect - функция для выбора строки
 *   onLoadMore - функция для загрузки дополнительных строк
 *   isDeleteColumn - флаг для отображения колонки удаления
 * }
 */
interface Props<T extends Row> {
  rows: T[];
  id: string;
  columns: Column<T>[];
  selectedRow: T["id"][];
  onLoadMore?: () => void;
  isDeleteColumn?: boolean;
  onDelete: (rowId: T["id"]) => void;
  onSelect: (id: T["id"] | T["id"][]) => void;
  onSave: (value: T[keyof T], rowId: T["id"], columnKey: Column<T>["key"]) => void;
}

/**
 * Компонент для отображения таблицы
 * @param {
 *   rows - массив строк
 *   columns - массив колонок
 *   selectedRow - массив выделенных строк
 *   onDelete - функция для удаления строки
 *   onSave - функция для сохранения изменений
 *   onSelect - функция для выбора строки
 *   onLoadMore - функция для загрузки дополнительных строк
 *   isDeleteColumn - флаг для отображения колонки удаления
 *   id - идентификатор таблицы
 * }
 * @returns
 */
function Table<T extends Row>({
  id,
  rows,
  onSave,
  columns,
  onSelect,
  onDelete,
  onLoadMore,
  selectedRow,
  isDeleteColumn,
}: Props<T>): JSX.Element {
  // * @state
  /** Редактируемая ячейка */
  const [editableCell, setEditableCell] = useState<{ row: T["id"]; column: Column<T>["key"] } | null>(null);

  const listRef = useRef<HTMLElement | null>(null);

  // * @handlers
  /**
   * Обработчик выбора всех строк
   */
  const handleSelectAll = () => {
    onSelect(rows.map(row => row.id));
  };

  /**
   * Обработчик сброса выделения строк
   */
  const handleUnselectAll = () => {
    onSelect([]);
  };

  /**
   * Обработчик редактирования ячейки
   * @param editRow - объект с информацией о редактируемой ячейке
   */
  const handleEditableCell = (editRow: { row: T["id"]; column: Column<T>["key"] } | null) => {
    setEditableCell(editRow);
  };

  /**
   * Обработчик выбора строки
   * @param id - идентификатор строки
   */
  const handleRowSelect = (id: T["id"]) => {
    onSelect(id);
  };

  /**
   * Обработчик удаления строки
   * @param id - идентификатор строки
   */
  const handleRowDelete = (id: T["id"]) => {
    onDelete(id);
  };

  /**
   * Обработчик сохранения изменений в ячейке
   * @param value - значение ячейки
   * @param rowId - идентификатор строки
   * @param columnKey - ключ столбца
   */
  const handleSave = (value: T[keyof T], row: T["id"], column: Column<T>["key"]) => {
    onSave(value, row, column);
    handleEditableCell(null);
  };

  // * @effects
  useEffect(() => {
    const table = document.getElementById(id) as HTMLElement;
    const body = table.getElementsByClassName("table-body")[0] as HTMLElement;
    if (Math.abs(body.offsetHeight - body.scrollHeight) > 1) {
      const header = (table.getElementsByClassName("table-header")[0] as HTMLElement).getElementsByTagName("th");
      const headerTd = header[header.length - 1] as HTMLElement;
      headerTd.style.paddingRight = `6px`;
    }
  });

  const isLastItemBottomInViewport = (list: HTMLElement) => {
    const lastItem = (list.getElementsByTagName("tbody")[0] as HTMLElement).lastElementChild;

    if (!lastItem) {
      return false;
    }

    const rect = lastItem?.getBoundingClientRect();
    const containerRect = list.getBoundingClientRect();

    // Проверяем, находится ли нижняя граница последнего элемента в поле видимости списка
    return rect.bottom >= containerRect.top && rect.bottom <= containerRect.bottom;
  };

  useEffect(() => {
    if (onLoadMore) {
      const list = listRef?.current as HTMLElement;
      const handleScroll = () => {
        if (isLastItemBottomInViewport(list)) {
          onLoadMore();
        }
      };
      if (list) {
        list.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (list) {
          list.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [onLoadMore]);

  return (
    <div className="table" id={id}>
      <table className="table-header">
        <thead>
          <tr>
            <th className="checkbox-column">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={selectedRow.length === rows.length && rows.length > 0}
                  onChange={selectedRow.length === rows.length ? handleUnselectAll : handleSelectAll}
                />
                <div className="checkbox__checkmark"></div>
              </label>
            </th>
            {columns.map(column => (
              <th key={column.key as string} style={{ width: column.width ? `${column.width}px` : "auto" }}>
                {column.label}
              </th>
            ))}
            {!!isDeleteColumn && <th className="delete-column"></th>}
          </tr>
        </thead>
      </table>
      <div className="table-body" ref={listRef}>
        <table>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} aria-selected={selectedRow.includes(row.id)}>
                <td className="checkbox-column">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRow.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                    <div className="checkbox__checkmark"></div>
                  </label>
                </td>
                {columns.map(column =>
                  column.editable ? (
                    <EditableCell<T>
                      width={column?.width}
                      value={row[column.key as keyof T]}
                      key={(column.key as string) + row.id}
                      onBlur={value => handleSave(value, row.id, column.key)}
                      onClick={() => handleEditableCell({ row: row.id, column: column.key })}
                      isEditable={!!editableCell && editableCell.row === row.id && editableCell.column === column.key}
                    />
                  ) : (
                    <CellText key={(column.key as string) + row.id} width={column?.width}>
                      {row[column.key as keyof T] as string}
                    </CellText>
                  )
                )}
                {!!isDeleteColumn && (
                  <td className="delete-column">
                    <button onClick={() => handleRowDelete(row.id)} className="delete-icon" title="Удалить строку">
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Table };
