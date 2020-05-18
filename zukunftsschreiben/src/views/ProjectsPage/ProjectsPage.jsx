import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Project } from "./Project"
import { Grid } from 'semantic-ui-react'

import { projectActions } from '../../store/actions';

class ProjectsPage extends Component {
  constructor(props) {
    super(props)

  }


  componentDidMount() {
    this.props.dispatch(projectActions.getAll());
  }

  renderProjects() {
    const { projects } = this.props;

    if (!projects) return '';
    if (!projects.length > 0) return '';
    return projects
      .map((project, index) => <Grid.Column><Project
        key={project._id}
        project={project}
        index={index}
      /></Grid.Column>
      )
  }

  render() {
    const { projects } = this.props
    console.log(projects)
    return (
      <>
        <h1>ProjectsPage</h1>
        {projects &&
          <Grid stackable columns={2}>
            {this.renderProjects()}
          </Grid>
        }
      </>
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