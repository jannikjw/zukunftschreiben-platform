import React, { Component } from "react";
import { Card, Image, Icon, Button } from 'semantic-ui-react';
import { likeActions } from "../../store/actions/like.actions";
import { connect } from 'react-redux';

class Project extends Component {
  constructor(props) {
    super(props)

    this.likeProject = this.likeProject.bind(this)
  }

  likeProject() {
    //if users are not logged in but try to vote they are redirected to login page
    const { userID, project } = this.props

    if (!userID) {
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

  render() {
    const { title, description, likes, category, startDate, endDate, image } = this.props.project

    return (
      <Card fluid>
        <Card.Content>
          <Image src={image || "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"} wrapped />
          <Card.Header>{title}</Card.Header>
          <Card.Meta>Project Duration: {startDate.substring(0, 10) + "-" + endDate.substring(0, 10)}</Card.Meta>
          <Card.Description>{description}</Card.Description>
          <Card.Description>Category: {category}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button onClick={() => this.likeProject()}>
            <Icon name='like' />
            {likes}
          </Button>
        </Card.Content>
      </Card>
    )
  }
}

function mapStateToProps(state) {
  const { loggedIn, user } = state.login;
  return {
    user,
    loggedIn
  };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project }; 
