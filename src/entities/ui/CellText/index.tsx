type CellTextProps = {
  width?: number;
  onClick?: () => void;
  children: React.ReactNode;
};

/**
 * Компонент для отображения текста
 * @param props - {
 *   onClick - функция для вызова при нажатии на элемент
 *   children - текст
 *   width - ширина элемента
 * }
 * @returns
 */
const CellText = ({ onClick, children, width }: CellTextProps) => {
  return (
    <td onDoubleClick={onClick} style={{ width: width ? `${width}px` : "auto" }}>
      {children}
    </td>
  );
};

export { CellText };
