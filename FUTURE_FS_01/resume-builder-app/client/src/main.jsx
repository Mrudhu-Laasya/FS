import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import EditProvider from "./context/EditProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EditProvider>
      <App />
    </EditProvider>
  </StrictMode>,
);
