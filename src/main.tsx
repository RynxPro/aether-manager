import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ModsProvider } from "./hooks/useMods";
import { StatsProvider } from "./hooks/useStats";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StatsProvider>
      <ModsProvider>
        <App />
      </ModsProvider>
    </StatsProvider>
  </React.StrictMode>
);
