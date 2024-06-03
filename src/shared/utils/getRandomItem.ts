/**
 * Генерация случайного элемента из массива
 * @param list - массив
 */
const getRandomItem = <T>(list: T[]): T => {
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("list must be a non-empty array");
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index];
};

export { getRandomItem };
