import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Project } from "./Project"
import { Grid } from 'semantic-ui-react'

import { projectActions } from '../../store/actions';
import './ProjectsPage.scss';


class ProjectsPage extends Component {
  componentDidMount() {
    this.props.dispatch(projectActions.getAll());
  }

  renderProjects() {
    const { projects, user } = this.props;

    if (!projects) return '';
    if (!projects.length > 0) return '';
    return projects
      .map((project) => <Grid.Column key={project._id}>
        <Project
          key={project._id}
          project={project}
        /></Grid.Column>
      )
  }

  render() {
    const { projects } = this.props
    return (
      <div className="view-projects-page">
        <h1>ProjectsPage</h1>
        {projects &&
          <Grid stackable columns={2}>
            {this.renderProjects()}
          </Grid>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { login, project } = state;
  return {
    user: login.user,
    projects: project.projects
  };
}

const connectedProjectsPage = connect(mapStateToProps)(ProjectsPage)
export { connectedProjectsPage as ProjectsPage }