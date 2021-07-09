import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { DevLogger } from "./dev/logger";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <DevLogger />
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
