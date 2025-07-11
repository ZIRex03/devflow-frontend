import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@styles/index.scss";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./features/store/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
