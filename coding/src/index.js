import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// layouts

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
  
import Login from "views/auth/Login";

ReactDOM.render(
  // <BrowserRouter basename="/62011211041/">
    <BrowserRouter >
    <Switch>
      {/* add routes with layouts */}
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />
      {/* add routes without layouts */} 
      <Route path="/" exact component={Login} />
      <Route path="/auth/login" exact component={Login} />
      {/* add redirect for first page */}
      <Redirect from="*" to="/" /> 
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
