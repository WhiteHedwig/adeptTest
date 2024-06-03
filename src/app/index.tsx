import { MainPage } from "@/pages/main";
import { withProviders } from "./providers";
import "./styles.css";

/**
 * Компонент для отображения страницы
 */
const App = withProviders(() => {
  return <MainPage />;
});

export default App;
