import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Upload from "./pages/Upload";

function App() {
  // let [time, setTime] = useState(0);
  // let [date, setDate] = useState("");

  // useEffect(() => {
  //   fetch("/time")
  //     .then((res) => res.json())
  //     .then((data) => setTime(data.time));
  //   fetch("/date")
  //     .then((res) => res.json())
  //     .then((data) => setDate(data.date));
  // }, []);
  return (
    <div className="App">
      <Router>
        <div className="d-flex title p-3">
          <div className="ml-3">
            <Link to="/">Upload</Link>
          </div>
          <div className="ml-4">
            <Link to="/main">Photo Book</Link>
          </div>
          <div className="ml-4">
            <Link to="/modify">Edit</Link>
          </div>
        </div>
        <Switch>
          <Route path="/" component={Upload} />
        </Switch>
      </Router>
      {/*
        <p>Current time is {time}.</p>
        <p>Date is {date}</p>*/}
    </div>
  );
}

export default App;
