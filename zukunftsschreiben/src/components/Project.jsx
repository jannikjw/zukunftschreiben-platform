import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, Image, Icon, Button, Progress } from 'semantic-ui-react';
import { likeActions } from "../store/actions/like.actions";
import { donationActions } from "../store/actions/donation.actions";
import { projectActions } from "../store/actions/project.actions";
import { connect } from 'react-redux';

import './Project.scss';

class Project extends Component {
  constructor(props) {
    super(props)

    this.likeProject = this.likeProject.bind(this)
    this.incrementFunding = this.incrementFunding.bind(this)
  }

  likeProject() {
    //if users are not logged in but try to vote they are redirected to login page
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

  incrementFunding(amount) {
    const { loggedIn, project } = this.props

    if (!loggedIn) {
      window.location = '/login'
    } else {

      try {
        this.props.dispatch(donationActions.donateToProject(project, amount))
      } catch (err) {
        console.error(err)
      }
    }
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

    return (
      <Card fluid className={'component-project' + (!project.isOngoing ? ' non-current' : '')}>
        <Card.Content>
          <Image src={project.image || "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"} wrapped />
          <Card.Header>{project.title}</Card.Header>
          <Card.Meta>Project Duration: {startD + " - " + endD}</Card.Meta>
          <Card.Description>{project.description}</Card.Description>
          <Card.Description>Category: {project.category}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button onClick={() => this.likeProject()}>
            <Icon name='like' />
            {project.likes}
          </Button>
        </Card.Content>
        <Card.Content>
          <h3>{Math.round(project.funding)}€</h3>
          <Progress className='progressBar' value={project.funding} total={project.goal} color={this.colorForProgress()}>{this.textForLabel()}</Progress>
          <Button onClick={() => this.incrementFunding(10.50)}>Donate</Button>
          {project.isOngoing && <Link to={"/projekte/" + project._id}><Button>More</Button></Link>}
          {this.props.isAdmin && <Link to={"/edit-project/" + project._id}><Button>Edit</Button></Link> }
          {this.props.isAdmin && <Button onClick={() => { this.deleteProject(project._id); this.sleep(1000).then(()=> {window.location = "/"})} }>Delete</Button>}
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
