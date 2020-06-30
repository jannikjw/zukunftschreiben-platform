import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react'
import { projectActions } from '../../store/actions/project.actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './ThankYouPage.scss';


class ThankYouPage extends Component {
  componentDidMount() {
    this.props.dispatch(projectActions.getAll());
  }

  selectProject() {
    const project_id = this.props.match.params.project_id;
    const { projects } = this.props;
    if (!project_id || !projects) { return null };
    const project = projects.find(p => project_id === p._id)
    return project
  }

  render() {
    const project = this.selectProject();

    return (
      <div className="view-thank-you-page">
        <Grid stackable>
          <Grid.Column className='infoColumn'>
            <h1 className='projectTitle'>{project && project.title}</h1>
            <p>{project && project.description}</p>
          </Grid.Column>
          <Grid.Column className='donationColumn'>
            <Grid.Row>
              <Image src={(project && project.image) || "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"} wrapped />
            </Grid.Row>
            <div className="center">
              <Grid.Row>
                <h2>Vielen Dank fürs Spenden an unser Projekt <br /> {project && project.title}!</h2>
              </Grid.Row>
              <Grid.Row>
                <i className="huge check circle outline icon"></i>
              </Grid.Row>
              <Link to="/projekte"><button className="ui button">Zurück zu Projekten</button></Link>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { login, project } = state;
  return {
    user: login.user,
    projects: project.projects,
  };
}

const connectedThankYouPage = connect(mapStateToProps)(ThankYouPage)
export { connectedThankYouPage as ThankYouPage }