import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Main, Admin, Hospital, Dashboard, Manufacturer, Public } from ".";

class App extends Component {

  render() {
    return (
      <div className="App" style={{height:"100vh", width:"100vw"}}>
        <Router>
          <Switch>
            <Route path="/" exact component={() => <Main />} />
            <Route path="/Admin" exact component={() => <Admin />} />
            <Route path="/Hospital" exact component={() => <Hospital />} />
            <Route path="/Manufacturer" exact component={() => <Manufacturer />} />
            <Route path="/Public" exact component={() => <Public />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;