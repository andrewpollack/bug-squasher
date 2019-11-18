import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import logo from "./imgs/logo.png"
import TaskList from "./components/TaskList/TaskList"
import EditTask from "./components/EditTask/EditTask"
import CreateTask from "./components/CreateTask/CreateTask"
import CreateUser from "./components/CreateUser/CreateUser"
import UserLogin from "./components/UserLogin/UserLogin"

import axios from "axios";


class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginId: "",
      loginUsername: "",
    };

    this.updateLoginState = this.updateLoginState.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  updateLoginState(newLogin) {
    this.setState({
      loginId: newLogin._id,
      loginUsername: newLogin.username
    });
  }

  logoutUser(e) {
    e.preventDefault();

    const loginUser = {
      loginId: this.state.loginId,
    };

    axios.post("http://localhost:4000/bsDb/admin/logout", loginUser)
    .then(response => {
      if(response) {
        this.setState({
          loginId: "",
          loginUsername: ""
        });
        return;
      }
    }).catch(() => {
      console.log("error");
    });
  }

  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <a className="navbar-brand" href="/">
              <img src={logo} width="40" height="40" alt="Squash Those Bugs!" />
            </a>
            <Link to="/" className="navbar-brand">Bug Squasher</Link>
            <div className="collapse navbar-collapse">
              { this.state.loginId ? 
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Tasks</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/createTask" className="nav-link">Create Task</Link>
                </li>
              </ul> :
                <ul className="navbar-nav mr-auto" />
              }

                {
                this.state.loginId ? 
                <form className="form-inline my-2 my-lg-0" onSubmit={this.logoutUser}>
                  <ul className="navbar-nav  nav-pills">
                    <li className="navbar-item">
                      <span className="navbar-text">Username: "{this.state.loginUsername}" </span>
                    </li>
                    <button className="btn btn-link nav-link"  type="submit">Logout</button>
                  </ul>
                </form>
                :
                <ul className="navbar-nav">
                  <li className="navbar-item">
                    <Link to="/userLogin" className="nav-link">Login</Link>
                  </li>
                </ul>
                }

            </div>
  
          </nav>
          <Route path="/" exact>
              {this.state.loginId ? <TaskList /> : <Redirect to="/userLogin" />}
          </Route> 
          <Route path="/edit/:id">
            {this.state.loginId ? <EditTask /> : <Redirect to="/userLogin" />}
          </Route> 
          <Route path="/createTask">
            {this.state.loginId ? <CreateTask /> : <Redirect to="/userLogin" />}
          </Route> 
          <Route path="/createUser" 
                render={props => <CreateUser {...props} changeLoginState={this.updateLoginState} />}
                />
          <Route path="/userLogin" 
                 render={props => <UserLogin {...props} changeLoginState={this.updateLoginState} />}
                 />
        </div>
      </Router>
      
    );
  }
}



function App() {

  return (
    <MainPage />
  );
}

export default App;