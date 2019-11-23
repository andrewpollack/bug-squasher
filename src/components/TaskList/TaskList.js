import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TaskList.css"
import { thisExpression } from "@babel/types";
axios.defaults.withCredentials = true;

/* 
const Task = props => (
    <tr>
        <td className={props.task.taskComplete ? "completed" : ""}>{props.task.taskDescription}</td>
        <td className={props.task.taskComplete ? "completed" : ""}>{props.task.taskResponsible}</td>
        <td className={props.task.taskComplete ? "completed" : ""}>{props.task.taskPriority}</td>
        <td>
            <Link to={"/edit/" + props.task._id}>Edit</Link>
        </td>
    </tr>
)*/

export default class TaskList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            loaded: false
        };
    }

    componentDidMount() {
        this._isMounted = true;

        axios.get("http://localhost:4000/bsDb/task/list")
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        tasks: response.data,
                        loaded: true 
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

    
    componentDidUpdate(prevProps, prevState) {
        if(this.state !== prevState) {
            axios.get("http://localhost:4000/bsDb/task/list")
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
    }

    getTaskList() {
        var priorities = ["High", "Medium", "Low"];
        var endOut = [];
        
        for (var j = 0; j < priorities.length; j++ ) {
            for (var i = 0; i < this.state.tasks.length; i++) {
                var currTask = this.state.tasks[i];
                if(currTask.taskPriority === priorities[j]) {
                    endOut.push(
                        <tr className={priorities[j]} 
                            key={this.state.tasks[i]._id}
                            >
                            <td className={currTask.taskComplete ? "completed" : ""}
                            >{currTask.taskDescription}</td>
                            <td className={currTask.taskComplete ? "completed" : ""}>{currTask.taskResponsible}</td>
                            <td className={currTask.taskComplete ? "completed" : ""}>{currTask.taskPriority}</td>
                            <td>
                                <Link to={"/edit/" + currTask._id}>Edit</Link>
                            </td>
                        </tr>
                    );
                }
            }
        }
        if(this.state.loaded && endOut.length == 0) {
            endOut.push(
                <tr key="No tasks here">
                    <td>
                        You're all caught up!  Click "Create Tasks" at the top to make more!
                    </td>
                </tr>
            );
        }
        return endOut;

        //return this.state.tasks.map(function(currTask, i) {
        //   return <Task task={currTask} key={i} />
        //});
    }

    render() {
        return (
            <div style={{marginTop: 15}}>
                <h3>Task List</h3>
                <table className="table" style={{ marginTop: 20}}>
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