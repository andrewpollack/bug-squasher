import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TaskList.css"

const Task = props => (
    <tr>
        <td className={props.task.taskComplete ? "completed" : ""}>{props.task.taskDescription}</td>
        <td className={props.task.taskComplete ? "completed" : ""}>{props.task.taskResponsible}</td>
        <td className={props.task.taskComplete ? "completed" : ""}>{props.task.taskPriority}</td>
        <td>
            <Link to={"/edit/" + props.task._id}>Edit</Link>
        </td>
    </tr>
)

export default class TaskList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };
    }

    componentDidMount() {
        this._isMounted = true;

        axios.get("http://localhost:4000/tasks")
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        tasks: response.data
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
      }

    componentDidUpdate() {
        axios.get("http://localhost:4000/tasks")
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        tasks: response.data
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    getTaskList() {
        return this.state.tasks.map(function(currTask, i) {
            return <Task task={currTask} key={i} />
        });
    }

    render() {
        return (
            <div>
                <h3>Task List</h3>
                <table className="table table-striped" style={{ marginTop: 20}}>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.getTaskList() }
                    </tbody>
                </table>
            </div>
        );
    }
}