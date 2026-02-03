import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Convierte valores como '/' o './' en '/'
const resolvedBase = new URL(
  import.meta.env.BASE_URL || "/",
  window.location.href,
).pathname;
const basename = resolvedBase === "/" ? undefined : resolvedBase;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
