import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Button, Progress } from 'semantic-ui-react';
import { likeActions } from "../store/actions/like.actions";
import { projectActions } from "../store/actions/project.actions";
import { connect } from 'react-redux';

import './Project.scss';

class Project extends Component {
  constructor(props) {
    super(props)

    this.likeProject = this.likeProject.bind(this)
  }

  likeProject() {
    //if users are not logged in but try to like they are redirected to login page
    const { loggedIn, project } = this.props

    if (!loggedIn) {
      window.location = '/login'
    } else {

      try {
        if (project.userHasLiked) {
          this.props.dispatch(likeActions.unlikeProject(project))
        } else {
          this.props.dispatch(likeActions.likeProject(project))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  deleteProject(id) {
    //if users are not logged in but try to vote they are redirected to login pag
    this.props.dispatch(projectActions.deleteProject(id))
  }

  colorForProgress() {
    const fundingLevelLowBoundary = 50;
    const fundingLevelAchievedBoundary = 100;
    const fundingLevelLowColor = "yellow";
    const fundingLevelOngoingColor = "olive";
    const fundingLevelAchievedColor = "green";

    const { percent } = this.props.project;

    if (percent < fundingLevelLowBoundary) return fundingLevelLowColor;
    if (percent < fundingLevelAchievedBoundary) return fundingLevelOngoingColor;
    return fundingLevelAchievedColor;

  }

  textForLabel() {
    const { percent, goal } = this.props.project;
    return `${percent}% von ${goal}€ Ziel erreicht`
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    const { project } = this.props;

    let startD = new Date(project.startDate)
    let endD = new Date(project.endDate)
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: 'numeric' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(startD)
    const [{ value: mo }, , { value: da }, , { value: ye }] = dateTimeFormat.formatToParts(endD)
    startD = `${day}.${month}.${year}`
    endD = `${da}.${mo}.${ye}`

    //TODO: The styling for the project view is not complete and should be closer
    //to the Zukunftschreiben CI
    //Past and Future projects should be in a separate section below the current
    //projects. The sorting for this would need to be facilitated by the backend, 
    //split up into different values in the response (i.e. arrays for current, past and present projects)

    //TODO: There should also be another detail view for each project where more information
    //is displayed and users can comment, give feedback and can be directed to the
    //organization hosting the project
    return (
      <Card fluid className={'component-project' + (!project.isOngoing ? ' non-current' : '')}>
        <Card.Content>
          <img alt="Projektfoto" src={project.image || "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"} />
          <Card.Header>{project.title}</Card.Header>
          <Card.Meta>Projektdauer: {startD + " - " + endD}</Card.Meta>
          <Card.Description>{project.description}</Card.Description>
          <Card.Description>Kategorie: {project.category}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button onClick={() => this.likeProject()}>
            {!project.userHasLiked &&
              <i className='like icon'></i>}
            {project.userHasLiked &&
              <i className='like icon filled'></i>}
            {project.likes}
          </Button>
        </Card.Content>
        <Card.Content>
          <h3>{Math.round(project.funding)}€</h3>
          <Progress className='progressBar' value={project.funding} total={project.goal} color={this.colorForProgress()}>{this.textForLabel()}</Progress>
          {project.isOngoing && <Link to={"/projekte/" + project._id}><Button>Spenden</Button></Link>}
          {this.props.isAdmin && <Link to={"/edit-project/" + project._id}><Button>Edit</Button></Link>}
          {this.props.isAdmin && <Button onClick={() => { this.deleteProject(project._id); this.sleep(1000).then(() => { window.location = "/" }) }}>Delete</Button>}
        </Card.Content>
      </Card>
    )
  }
}

function mapStateToProps(state) {
  const { loggedIn, user } = state.login;
  const { loading, errors, isAdmin } = state.project;
  return {
    user,
    loggedIn,
    loading,
    isAdmin,
    errors
  };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project }; 
