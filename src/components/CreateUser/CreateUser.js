import React from "react";
import axios from "axios";
import "./CreateUser.css";
axios.defaults.withCredentials = true;


export default class CreateUser extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeUserFirstName = this.onChangeUserFirstName.bind(this);
        this.onChangeUserLastName = this.onChangeUserLastName.bind(this);
        this.onChangeUserUsername = this.onChangeUserUsername.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeUserConfirmPassword = this.onChangeUserConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.goToLoginUser = this.goToLoginUser.bind(this);
        this.changeLogin = this.changeLogin.bind(this);

        this.state = {
            userFirstName: '',
            userLastName: '',
            userUsername: '',
            userPassword: '',
            userConfirmPassword: '',
            userTeams: [],
            userAdmins: [],
            userRecentlyAdded: false,
            userSubFailed: false,
            passwordsNotMatch: false,
            userNameTaken: false,
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if(!this.state.userFirstName.trim().length ||
           !this.state.userLastName.trim().length ||
           !this.state.userUsername.trim().length ||
           !this.state.userPassword.trim().length) {
            this.clearPopups();
            this.setState( {
                userSubFailed: true,
            });
            return;
        }

        if(!(this.state.userPassword === this.state.userConfirmPassword)) {
            this.clearPopups();
            this.setState( {
                passwordsNotMatch: true
            });
            return;
        }

        const newUser = {
            userFirstName: this.state.userFirstName,
            userLastName: this.state.userLastName,
            userUsername: this.state.userUsername,
            userPassword: this.state.userPassword,
            userTeams: this.state.userTeams,
            userAdmins: this.state.userAdmins
        };

        axios.post('http://localhost:4000/bsDb/user/add', newUser)
            .then(res => {
                console.log(res.data.user);
                if(res.data.user === "Username Taken") {
                    this.setState( {
                        userNameTaken: true
                    });
                    return;
                }
                else {
                    this.changeLogin(res.data);
                    console.log("Successful login");
                    this.props.history.push('/'); 
                    return;
                }
            });
    }

    changeLogin(loginSuccess) {
        console.log(loginSuccess)
        this.props.changeLoginState(loginSuccess);
    }


    goToLoginUser(e) {
        this.props.history.push('/userLogin'); 
    }

    clearPopups() {
        this.setState({
            userRecentlyAdded: false,
            userSubFailed: false,
            passwordsNotMatch: false,
            userNameTaken: false
        })
    }

    onChangeUserFirstName(e) {
        this.clearPopups();
        this.setState({
            userFirstName: e.target.value,
        });
    }

    onChangeUserLastName(e) {
        this.clearPopups();
        this.setState({
            userLastName: e.target.value,
        });

    }

    onChangeUserUsername(e) {
        this.clearPopups();
        this.setState({
            userUsername: e.target.value,
        });
    }

    onChangeUserPassword(e) {
        this.clearPopups();
        this.setState({
            userPassword: e.target.value,
        });
    }

    onChangeUserConfirmPassword(e) {
        this.clearPopups();
        this.setState({
            userConfirmPassword: e.target.value,
        });
    }

    /**
     * Gives feedback if a user has been recently added/refused
     */
    addResponseForSubmission() {
        if(this.state.userRecentlyAdded) {
            return (
             <div className="alert alert-success form-group" role="alert">
                 User successfully created!
             </div>
            );
        }
        else if(this.state.userSubFailed) {
            return (
            <div className="alert alert-danger form-group" role="alert">
                 Submission failed.  Please leave no boxes blank.
             </div>
             );
        }
        else if(this.state.passwordsNotMatch) {
            return (
            <div className="alert alert-danger form-group" role="alert">
                 Submission failed.  Passwords do not match.
             </div>
             );
        }
        else if(this.state.userNameTaken) {
            return (
            <div className="alert alert-danger form-group" role="alert">
                 Submission failed.  Username taken.
             </div>
             );
        }
        else {
            return;
        }        
     }

    render() {
        return(
            <div style={{marginTop: 15}}>
                <h3>Create New Account</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>First Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.userFirstName}
                                onChange={this.onChangeUserFirstName} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.userLastName}
                                onChange={this.onChangeUserLastName} 
                        />
                    </div>
                    <div className="form-group">
                        <label className = {this.state.userNameTaken ? "errorLit" : ""}>Username: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.userUsername}
                                onChange={this.onChangeUserUsername} 
                        />
                    </div>
                    <div className="form-group">
                        <label className = {this.state.passwordsNotMatch ? "errorLit" : ""}>Password: </label>
                        <input  type="password"
                                className="form-control"
                                value={this.state.userPassword}
                                onChange={this.onChangeUserPassword} 
                        />
                    </div>
                    <div className="form-group">
                        <label className = {this.state.passwordsNotMatch ? "errorLit" : ""} >Confirm Password: </label>
                        <input  type="password"
                                className="form-control"
                                value={this.state.userConfirmPassword}
                                onChange={this.onChangeUserConfirmPassword} 
                        />
                    </div>
                    <div className="form-inline form-group">
                        <input type="submit" value="Create Account" className="btn btn-primary" />
                        {this.addResponseForSubmission()}
                    </div>
                </form>
                <form onSubmit={this.goToLoginUser}>
                    <div className="form-group">
                        <input type="submit" value="Back to Login" className="btn btn-secondary" />
                    </div>
                </form>
            </div>
        );
    }


}