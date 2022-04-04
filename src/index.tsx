import React from "react";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
} else {
  throw new Error("container not found");
}
