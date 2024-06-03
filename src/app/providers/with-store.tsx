import { Provider } from "react-redux";
import store from "../store";

/**
 * Функция для получения Redux store
 */
export const withStore = (component: () => React.ReactNode) => () => <Provider store={store}>{component()}</Provider>;
