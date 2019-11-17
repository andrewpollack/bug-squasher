import React from "react";
import axios from "axios";

export default class EditTask extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeTaskDescription = this.onChangeTaskDescription.bind(this);
        this.onChangeTaskResponsible = this.onChangeTaskResponsible.bind(this);
        this.onChangeTaskPriority = this.onChangeTaskPriority.bind(this);
        this.onChangeTaskCompleted = this.onChangeTaskCompleted.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            taskDescription: '',
            taskResponsible: '',
            taskPriority: '',
            taskComplete: false,
            deleteTask: false,
        }
        
    }

    onSubmit(e) {
        e.preventDefault();

        if(this.state.deleteTask) {
            axios.delete('http://localhost:4000/tasks/delete/'+this.props.match.params.id)
            .then(res => console.log(res.data));
            this.props.history.push('/');  
            return;     
        }

        if(!this.state.taskDescription.trim().length ||
           !this.state.taskResponsible.trim().length) {
            this.setState( {
                taskRecentlyAdded: false,
                taskSubFailed: true
            });
            return;
        }

        const updatedTask = {
            taskDescription: this.state.taskDescription,
            taskResponsible: this.state.taskResponsible,
            taskPriority: this.state.taskPriority,
            taskComplete: this.state.taskComplete
        };
        axios.post('http://localhost:4000/tasks/update/'+this.props.match.params.id, updatedTask)
            .then(res => console.log(res.data));

        this.props.history.push('/'); 
        return;       
    }

    componentDidMount() {
        axios.get('http://localhost:4000/tasks/' + this.props.match.params.id)
            .then(response => {
                this.setState( {
                    taskDescription: response.data.taskDescription,
                    taskResponsible: response.data.taskResponsible,
                    taskPriority: response.data.taskPriority,
                    taskComplete: response.data.taskComplete,
                })
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    onChangeTaskDescription(e) {
        this.setState({
            taskDescription: e.target.value,
        });
    }

    onChangeTaskResponsible(e) {
        this.setState({
            taskResponsible: e.target.value,
        });
    }

    onChangeTaskPriority(e) {
        this.setState({
            taskPriority: e.target.value,
        });
    }

    onChangeTaskCompleted(e) {
        this.setState({
            taskComplete: !this.state.taskComplete,
        });
    }

    deleteClick() {
        this.setState({
            deleteTask: true,
        });
    }

    /**
     * Returns a form-check-input object for each of the possible priorities for the tasks.
     */
    getPriorityListOptions() {
        var priorities = ["Low", "Medium", "High", "Very High"];
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
            <div>
                <h3>Update Task:</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Description: </label>
                        <input type="text"
                               className="form-control"
                               value={this.state.taskDescription}
                               onChange={this.onChangeTaskDescription}
                               />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input type="text"
                               className="form-control"
                               value={this.state.taskResponsible}
                               onChange={this.onChangeTaskResponsible}
                               />
                    </div>
                    <div className="form-group">
                        {this.getPriorityListOptions()}
                    </div>
                    <div className="form-check">
                        <input type="checkbox"
                               className="form-check-input"
                               id="completedCheckbox"
                               name="completedCheckbox"
                               onChange={this.onChangeTaskCompleted}
                               checked={this.state.taskComplete}
                               value={this.state.taskComplete}
                               />
                        <label className="form-check-label" htmlFor="completedCheckbox">
                            Completed
                        </label>
                    </div>
                    <br />
                    <div className="form-row">
                        <div className="col-auto">
                            <input type="submit" value="Update Task" className="btn btn-primary" />
                        </div>
                        <div className="col-auto">
                            <input type="submit" value="Delete Task" className="btn btn-danger" onClick={this.deleteClick.bind(this)} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}