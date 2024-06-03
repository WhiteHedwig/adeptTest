import { Faker, ru } from "@faker-js/faker";

/**
 * Локализация Faker для русского языка
 */
const customFaker = new Faker({
  locale: [ru],
});

export { customFaker };
