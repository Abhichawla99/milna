
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./frontend/styles/index.css";
import "./frontend/utils/analytics";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
