import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Users from "./routes/Users.js";
import Attributes from "./routes/Attributes";
import Countrys from "./routes/Countrys";
import Orders from "./routes/Orders.js";
import Categorys from "./routes/Categorys";
import Colors from "./routes/Color.js";
import Serials from "./routes/Serials";
import Brands from "./routes/Brands.js";
import Cases from "./routes/Cases.js";
import Login from "./routes/login.js";
import Product from "./routes/Product";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/brands" component={Brands} />
      <Route path="/cases" component={Cases} />
      <Route path="/users" component={Users} />
      <Route path="/attributes" component={Attributes} />
      <Route path="/countrys" component={Countrys} />
      <Route path="/products" component={Product} />
      <Route path="/categorys" component={Categorys} />
      <Route path="/colors" component={Colors} />
      <Route path="/serials" component={Serials} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default RouterConfig;
