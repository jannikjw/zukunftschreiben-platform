import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from "qs";
import { createProject } from '../../store/actions/project.actions'

import './CreateProjectPage.scss';

class CreateProjectPage extends React.Component {
  constructor(props) {
    super(props);

    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      title: query.title || "",
      description: query.description || "",
      category: query.category || "",
      status: query.status || "hidden",
      startDate: query.startDate || new Date(),
      endDate: query.endDate || new Date(),
      submitted: false,
      errors: {},
    };
  }

  validate() {
    let errors = {};
    let formIsValid = true;
    const { title, url } = this.state;

    if (!title) {
      formIsValid = false;
      errors["title"] = "Please enter a title.";
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    this.submit();
  }

  render() {
    const { title, url, submitted } = this.state;
    return (
      <div className={`view-create-project-page`}>
        <h2>Create a new Project!</h2>
        <form name="form" onSubmit={this.handleSubmit}>
          <div
            className={"form-group" + (submitted && !title ? " has-error" : "")}
          >
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={this.handleChange}
              className="form-control"
              name="title"
            />
            <div className="error">{this.state.errors.title}</div>
          </div>
        </form>
      </div>
    );
  }

  submit() {
    const { title, description, category, status, startDate, endDate } = this.state;
    const project = {
      title: title,
      description: description,
      category: category,
      status: status,
      startDate: startDate,
      endDate: endDate
    }


    if (this.validate()) {
      this.props.createProject(project)
    }
  }
}

const connectedCreateProjectPage = connect(null, { createProject })(CreateProjectPage);
export { connectedCreateProjectPage as CreateProjectPage };

