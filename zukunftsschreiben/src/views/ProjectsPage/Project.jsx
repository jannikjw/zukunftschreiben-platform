import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { authHeader } from "../../helpers";

class Project extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }


  render() {
    const { title, description, likes, comments, category, startDate, endDate } = this.props.project

    return (
      <div className="card">
        <table>
          <tr><h3>{title}</h3></tr>
          <tr>
            <td>likes {likes}</td>
            <td>Comments: {comments.length}</td>
          </tr>
          <tr><h4>Description</h4></tr>
          <tr><td>{description}</td></tr>
          <tr><td>Project Duration:</td></tr>
        </table>
      </div>
    )
  }
}

export { Project }