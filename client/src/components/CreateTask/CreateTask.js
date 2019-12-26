import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

export default class CreateTask extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeTaskDescription = this.onChangeTaskDescription.bind(this);
        this.onChangeTaskResponsible = this.onChangeTaskResponsible.bind(this);
        this.onChangeTaskPriority = this.onChangeTaskPriority.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            taskDescription: '',
            taskResponsible: '',
            taskPriority: 'Low',
            taskComplete: false,
            taskRecentlyAdded: false,
            taskSubFailed: false
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if(!this.state.taskDescription.trim().length ||
           !this.state.taskResponsible.trim().length) {
            this.setState( {
                taskRecentlyAdded: false,
                taskSubFailed: true
            });
            return;
        }

        const newTask = {
            taskDescription: this.state.taskDescription,
            taskResponsible: this.state.taskResponsible,
            taskPriority: this.state.taskPriority,
            taskComplete: this.state.taskComplete
        };
        axios.post('/task/add', newTask)
            .then(
                res => {
                    this.setState( {
                        taskDescription: '',
                        taskResponsible: '',
                        taskPriority: 'Low',
                        taskComplete: false,
                        taskRecentlyAdded: true,
                        taskSubFailed: false
                    });
            });
    }

    onChangeTaskDescription(e) {
        this.setState({
            taskDescription: e.target.value,
            taskRecentlyAdded: false,
            taskSubFailed: false
        });
    }

    onChangeTaskResponsible(e) {
        this.setState({
            taskResponsible: e.target.value,
            taskRecentlyAdded: false,
            taskSubFailed: false
        });
    }

    onChangeTaskPriority(e) {
        this.setState({
            taskPriority: e.target.value,
            taskRecentlyAdded: false,
            taskSubFailed: false
        });
    }

    /**
     * Gives feedback if a task has been recently added/refused
     */
    addResponseForSubmission() {
       if(this.state.taskRecentlyAdded) {
           return (
            <div className="alert alert-success" role="alert">
                Task successfully submitted!
            </div>
           );
       }
       else if(this.state.taskSubFailed) {
           return (
           <div className="alert alert-danger" role="alert">
                Submission failed.  Please leave no boxes blank.
            </div>
            );
       }
       else {
           return;
       }        
    }

    /**
     * Returns a form-check-input object for each of the possible priorities for the tasks.
     */
    getPriorityListOptions() {
        var priorities = ["Low", "Medium", "High"];
        var endOut = [];
        
        for (var i = 0; i < priorities.length; i++) {
            endOut.push(
                <div key={priorities[i]} className="form-check form-check-inline">
                    <input className="form-check-input"
                            type="radio"
                            name="priorityOptions"
                            id={"priority" + priorities[i]}
                            value={priorities[i]}
                            checked={this.state.taskPriority === priorities[i]}
                            onChange={this.onChangeTaskPriority}
                            />
                    <label className="form-check-label">{priorities[i]}</label>
                </div>
            );
        }
        return endOut;
    }

    render() {
        return (
            <div style={{marginTop: 15}}>
                <h3>Create New Task</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Description: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.taskDescription}
                                onChange={this.onChangeTaskDescription} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Responsible: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.taskResponsible}
                                onChange={this.onChangeTaskResponsible} 
                                />
                    </div>
                    <div className="form-group">
                        {this.getPriorityListOptions()}
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Task" className="btn btn-primary" />
                    </div>
                    {this.addResponseForSubmission()}
                </form>

            </div>
        );
    }
}