import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import reportWebVitals from "./reportWebVitals";

import ReactGA from "react-ga";

ReactGA.initialize("UA-189817839-1");
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
