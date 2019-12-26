import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

export default class LoginUser extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeUserUsername = this.onChangeUserUsername.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.goToCreateUser = this.goToCreateUser.bind(this);
        this.changeLogin = this.changeLogin.bind(this);

        this.state = {
            userUsername: '',
            userPassword: '',
            userLoginFailed: false,
            userSubFailed: false,
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if(!this.state.userUsername.trim().length ||
           !this.state.userPassword.trim().length) {
            this.clearPopups();
            this.setState( {
                userSubFailed: true,
            });
            return;
        }

        const loginUser = {
            userUsername: this.state.userUsername,
            userPassword: this.state.userPassword,
        };

        axios.post(("https://mybugsquasher.herokuapp.com/") + '/bsDb/admin/login', loginUser)
            .then(res => {
                if(res.data.result === "Username Not Found") {
                    this.setState( {
                        userLoginFailed: true
                    });
                    return;
                }
                else if(res.data.result === "Password Incorrect") {
                    this.setState( {
                        userLoginFailed: true
                    });
                    return;
                }
                else {
                    this.changeLogin(res.data);
                    console.log("Successful login");
                    this.props.history.push('/'); 
                    return;
                }
            })
            .catch(err => {
                console.log(err);
            });

    }

    goToCreateUser(e) {
        this.props.history.push('/createUser'); 
    }

    clearPopups() {
        this.setState({
            userLoginFailed: false,
            userSubFailed: false,
        })
    }

    changeLogin(loginSuccess) {
        this.props.changeLoginState(loginSuccess);
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

    /**
     * Gives feedback if a user has been recently added/refused
     */
    addResponseForSubmission() {
        if(this.state.userLoginFailed) {
            return (
                <div className="alert alert-danger form-group" role="alert">
                    Login failed.  Invalid username/password.
                </div>
            );
        }
        else if(this.state.userSubFailed) {
            return (
                <div className="alert alert-danger form-group" role="alert">
                     Login failed.  Please leave no boxes blank.
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
                <h3>Login</h3>
                <form onSubmit={this.onSubmit}>
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
                    <div className="form-inline form-group">
                        <input type="submit" value="Login" className="btn btn-primary" />
                        {this.addResponseForSubmission()}
                    </div>
                </form>
                <form onSubmit={this.goToCreateUser}>
                    <div className="form-group">
                        <input type="submit" value="Create New Account" className="btn btn-secondary" />
                    </div>
                </form>
            </div>
        );
    }

}