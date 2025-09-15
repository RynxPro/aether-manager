import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ModsProvider } from "./hooks/useMods";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ModsProvider>
      <App />
    </ModsProvider>
  </React.StrictMode>
);
