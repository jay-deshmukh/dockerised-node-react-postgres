import React from "react";
import ReactDOM from "react-dom";

import Offers from "./components/offers";
import ErrorBoundry from "./components/error-boundry";
import logo from "./images/logo.svg";
import "./styles/main.css";

const App = () => (
    <div>
        <img className="logo" src={logo} alt="tiger logo"/>
        <ErrorBoundry>
            <Offers />
        </ErrorBoundry>
    </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
