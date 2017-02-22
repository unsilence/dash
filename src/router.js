import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';

import Users from "./routes/Users.js";

import Customers from "./routes/Customers.js";

import Receives from "./routes/Receives.js";

import Orders from "./routes/Orders.js";

import Buys from "./routes/Buys.js";

import Reports from "./routes/Reports.js";
import Login from "./routes/login.js";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/users" component={Users} />
      <Route path="/customers" component={Customers} />
      <Route path="/receives" component={Receives} />
      <Route path="/orders" component={Orders} />
      <Route path="/buys" component={Buys} />
      <Route path="/reports" component={Reports} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default RouterConfig;
