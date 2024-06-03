/**
 * Функция для генерации данных
 * @param data - объект с типами данных
 * @param length - количество элементов в массиве
 * @returns {*}
 */
function getDataFaker<T>(data: () => T, length: number): T[] {
  const result = [];

  for (let i = 0; i < length; i++) {
    result.push(data());
  }

  return result;
}

export { getDataFaker };
