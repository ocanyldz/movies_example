import React from 'react';
import './App.scss';
import Movies from './Movies';
import Details from './Details';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route exact path="/" component={Movies} />
            <Route path="/details/:id" component={Details} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
