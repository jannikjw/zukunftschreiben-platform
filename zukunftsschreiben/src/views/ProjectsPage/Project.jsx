import React, { Component } from "react";
import { Card, Image, Icon, Button, Progress } from 'semantic-ui-react';
import { likeActions } from "../../store/actions/like.actions";
import { donationActions } from "../../store/actions/donation.actions";
import { connect } from 'react-redux';

const goal = 1000;

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

  renderProgress() {
    const { funding } = this.props.project

    if (funding < 40)
      return "yellow";
    else if (funding < 100)
      return "olive";
    else
      return "green";
  }

  renderLabel() {
    const { funding } = this.props.project;
    const percent = Math.ceil(funding / goal * 100)
    return `${percent}% von ${goal}€ Ziel erreicht`
  }

  render() {
    const { title, description, likes, category, startDate, endDate, image, funding } = this.props.project
    let startD = new Date(startDate)
    let endD = new Date(endDate)
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: 'numeric' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(startD)
    const [{ value: mo }, , { value: da }, , { value: ye }] = dateTimeFormat.formatToParts(endD)
    startD = `${day}.${month}.${year}`
    endD = `${da}.${mo}.${ye}`

    return (
      <Card fluid>
        <Card.Content>
          <Image src={image || "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"} wrapped />
          <Card.Header>{title}</Card.Header>
          <Card.Meta>Project Duration: {startD + " - " + endD}</Card.Meta>
          <Card.Description>{description}</Card.Description>
          <Card.Description>Category: {category}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button onClick={() => this.likeProject()}>
            <Icon name='like' />
            {likes}
          </Button>
        </Card.Content>
        <Card.Content>
          <h3>{Math.round(funding)}€</h3>
          <Progress value={funding} total={goal} color={this.renderProgress()}>{this.renderLabel()}</Progress>
          <Button onClick={() => this.incrementFunding(10.50)}>Press to pay 10.50</Button>
        </Card.Content>
      </Card>
    )
  }
}

function mapStateToProps(state) {
  const { loggedIn, user } = state.login;
  return {
    user,
    loggedIn,
  };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project }; 
