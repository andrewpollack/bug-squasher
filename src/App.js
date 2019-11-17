import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import logo from "./imgs/logo.png"
import TaskList from "./components/TaskList/TaskList"
import EditTask from "./components/EditTask/EditTask"
import CreateTask from "./components/CreateTask/CreateTask"
import CreateUser from "./components/CreateUser/CreateUser"



function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <a className="navbar-brand" href="/">
            <img src={logo} width="40" height="40" alt="Squash Those Bugs!" />
          </a>
          <Link to="/" className="navbar-brand">Bug Squasher</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">Tasks</Link>
              </li>
              <li className="navbar-item">
                <Link to="/createTask" className="nav-link">Create Task</Link>
              </li>
              <li className="navbar-item">
                <Link to="/createUser" className="nav-link">Create User</Link>
              </li>
            </ul>
          </div>

        </nav>

        <Route path="/" exact component={TaskList} />
        <Route path="/edit/:id" component={EditTask} />
        <Route path="/createTask" component={CreateTask} />
        <Route path="/createUser" component={CreateUser} />
      </div>
    </Router>
    
  );
}

export default App;
