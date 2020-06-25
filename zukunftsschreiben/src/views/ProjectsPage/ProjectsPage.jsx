import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Project } from "../../components/Project"
import { Grid, Icon } from 'semantic-ui-react'

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
        <div className='topBar'>
          <h1>Zukunftschreiben mit unseren Projekten</h1>
          <h2>Sehen Sie unsere vergangenen und künftigen Projekte. <br /> Spenden Sie an aktuelle Projekte.</h2>
          <Icon name='chevron down' size='large' inverted className='scroll' />
        </div>
        <div className="project-wrapper">
          {projects &&
            <Grid stackable columns={2}>
              {this.renderProjects()}
            </Grid>
          }
        </div>
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