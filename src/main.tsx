import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ModsProvider } from "./hooks/useMods";
import { StatsProvider } from "./hooks/useStats";
import { PresetsProvider } from "./hooks/usePresets";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StatsProvider>
      <ModsProvider>
        <PresetsProvider>
          <App />
          <Toaster position="bottom-right" toastOptions={{
            style: { background: "#1a1b26", color: "#e5e7eb", border: "1px solid #2a2b3a" },
            success: { iconTheme: { primary: "#8b5cf6", secondary: "#1a1b26" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#1a1b26" } }
          }} />
        </PresetsProvider>
      </ModsProvider>
    </StatsProvider>
  </React.StrictMode>
);
