import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/globals.css";
import "./styles/game.css";
import "./styles/cinematic.css";
import "./styles/components.css";
import "./styles/screens.css";
import "./styles/utilities.css";
import "./styles/authoring.css";
import "./styles/layout.css";
import "./styles/tailwind-shim.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
