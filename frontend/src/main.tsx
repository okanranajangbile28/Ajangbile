import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import "./index.css";
import "react-phone-input-2/lib/style.css";

import App from "./App/App";
import store from "./App/store";
import { Provider } from "react-redux";

import { TranslationProvider } from "./translation/TranslationContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </Provider>
  </StrictMode>,
);
