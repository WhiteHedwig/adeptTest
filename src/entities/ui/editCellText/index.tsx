import React, { useState } from "react";
import { CellText } from "../CellText";

import "./style.sass";

interface EditableCellProps<T> {
  value: T[keyof T];
  width?: number;
  isEditable: boolean;
  onClick: () => void;
  onBlur: (value: T[keyof T]) => void;
}

/**
 * Компонент для редактирования ячейки
 * @param props - {
 *   value - значение ячейки
 *   width - ширина ячейки
 *   isEditable - флаг для отображения редактирования
 *   onClick - функция для вызова при нажатии на элемент
 *   onBlur - функция для вызова при нажатии на Enter
 * }
 * @returns
 */
function EditableCell<T>({ value, onClick, onBlur, isEditable, width }: EditableCellProps<T>): JSX.Element {
  // * @state
  /** Значение редактируемой ячейки */
  const [inputValue, setInputValue] = useState<T[keyof T] | string>(value);

  // * @handlers
  /**
   * Обработчик сброса фокуса
   */
  const handleInputBlur = () => {
    onBlur(inputValue as T[keyof T]);
  };

  return isEditable ? (
    <CellText width={width}>
      <input
        type="text"
        autoFocus
        className="editable-cell"
        value={inputValue as string}
        onChange={e => setInputValue(e.target.value)}
        onBlur={handleInputBlur}
      />
    </CellText>
  ) : (
    <CellText onClick={onClick} width={width}>
      {value as string}
    </CellText>
  );
}

export default EditableCell;
