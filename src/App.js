import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
    axios.post("/admin/logout", "").then((response) =>{
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
        {console.log("ASDF" + this.state.loginState)}
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
                  <Link to="/createUser" className="nav-link">Create Account</Link>
                </li>
              </ul>
                {this.state.loginId ? 
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
                </ul>}
            </div>
  
          </nav>
  
          <Route path="/" exact component={TaskList} />
          <Route path="/edit/:id" component={EditTask} />
          <Route path="/createTask" component={CreateTask} />
          <Route path="/createUser" component={CreateUser} />
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