import React from "react";
import axios from "axios";

export default class CreateUser extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeUserFirstName = this.onChangeUserFirstName.bind(this);
        this.onChangeUserLastName = this.onChangeUserLastName.bind(this);
        this.onChangeUserUsername = this.onChangeUserUsername.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeUserConfirmPassword = this.onChangeUserConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

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
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if(!this.state.userFirstName.trim().length ||
           !this.state.userLastName.trim().length ||
           !this.state.userUsername.trim().length ||
           !this.state.userPassword.trim().length) {
            this.setState( {
                userRecentlyAdded: false,
                userSubFailed: true,
                passwordsNotMatch: false
            });
            return;
        }

        if(!(this.state.userPassword === this.state.userConfirmPassword)) {
            this.setState( {
                userRecentlyAdded: false,
                userSubFailed: false,
                passwordsNotMatch: true
            });
            return;
        }

        // TODO: Check passwords matching

        const newUser = {
            userFirstName: this.state.userFirstName,
            userLastName: this.state.userLastName,
            userUsername: this.state.userUsername,
            userPassword: this.state.userPassword,
            userTeams: this.state.userTeams,
            userAdmins: this.state.userAdmins
        };

        axios.post('http://localhost:4000/bsDb/user/add', newUser)
            .then(res => console.log(res.data));

        this.setState( {
            userFirstName: '',
            userLastName: '',
            userUsername: '',
            userPassword: '',
            userConfirmPassword: '',
            userTeams: [],
            userAdmins: [],
            userRecentlyAdded: true,
            userSubFailed: false,
            passwordsNotMatch: false
        });
    }

    onChangeUserFirstName(e) {
        this.setState({
            userFirstName: e.target.value,
            userRecentlyAdded: false,
            userSubFailed: false,
            passwordsNotMatch: false
        });
    }

    onChangeUserLastName(e) {
        this.setState({
            userLastName: e.target.value,
            userRecentlyAdded: false,
            userSubFailed: false,
            passwordsNotMatch: false
        });

    }

    onChangeUserUsername(e) {
        this.setState({
            userUsername: e.target.value,
            userRecentlyAdded: false,
            userSubFailed: false,
            passwordsNotMatch: false
        });
    }

    onChangeUserPassword(e) {
        this.setState({
            userPassword: e.target.value,
            userRecentlyAdded: false,
            userSubFailed: false,
            passwordsNotMatch: false
        });
    }

    onChangeUserConfirmPassword(e) {
        this.setState({
            userConfirmPassword: e.target.value,
            userRecentlyAdded: false,
            userSubFailed: false,
            passwordsNotMatch: false
        });
    }

    /**
     * Gives feedback if a user has been recently added/refused
     */
    addResponseForSubmission() {
        if(this.state.userRecentlyAdded) {
            return (
             <div className="alert alert-success" role="alert">
                 User successfully created!
             </div>
            );
        }
        else if(this.state.userSubFailed) {
            return (
            <div className="alert alert-danger" role="alert">
                 Submission failed.  Please leave no boxes blank.
             </div>
             );
        }
        else if(this.state.passwordsNotMatch) {
            return (
            <div className="alert alert-danger" role="alert">
                 Submission failed.  Passwords do not match.
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
                        <label>Username: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.userUsername}
                                onChange={this.onChangeUserUsername} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input  type="password"
                                className="form-control"
                                value={this.state.userPassword}
                                onChange={this.onChangeUserPassword} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password: </label>
                        <input  type="password"
                                className="form-control"
                                value={this.state.userConfirmPassword}
                                onChange={this.onChangeUserConfirmPassword} 
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Account" className="btn btn-primary" />
                    </div>
                    {this.addResponseForSubmission()}
                </form>
            </div>
        );
    }


}