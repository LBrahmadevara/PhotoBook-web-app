import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Upload from "./pages/Upload";
import PhotoBook from "./pages/PhotoBook";
import Modify from "./pages/Modify";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="d-flex title p-3">
          <div className="ml-4 pl-4 pr-4">
            <Link to="/">Photo Book</Link>
          </div>
          <div className="ml-4 pl-4">
            <Link to="/upload">Upload</Link>
          </div>
        </div>
        <Switch>
          <Route path="/upload" component={Upload} />
          <Route path="/edit/:id" component={Modify} />
          <Route path="/" component={PhotoBook} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
