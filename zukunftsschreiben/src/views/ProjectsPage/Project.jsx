import React, { Component } from "react";
import { Card, Image, Icon } from 'semantic-ui-react';
import { projectActions } from '../../store/actions';
import { likeActions } from "../../store/actions/like.actions";

class Project extends Component {
  constructor(props) {
    super(props)

    this.likeProject = this.likeProject.bind(this)

    function isLiked(project, userID) {
      return project.likes.includes(userID)
    }

    this.state = {
      isLiked: isLiked(this.props.project, this.props.userID),
      likes: this.props.project.likes.length
    }
  }

  likeProject() {
    //if users are not logged in but try to vote they are redirected to login page
    const { userID, project } = this.props
    const isLiked = this.state.isLiked

    // console.log("User: " + this.state.currentUser.username)
    if (!userID) {
      window.location = '/login'
    } else {

      try {
        if (isLiked) {
          //Vote has been voted up yet --> unvote
          this.props.dispatch(likeActions.unlikeProject())
            .then(this.setState({ isVoted: false, likes: this.state.likes - 1 }))
        } else {
          //Vote has been not voted up yet --> vote up
          this.props.dispatch(likeActions.likeProject())
            .then(this.setState({ isVoted: true, likes: this.state.likes + 1 }))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  render() {
    const { title, description, category, startDate, endDate, image } = this.props.project
    const likes = this.state.likes

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
          <button onClick={this.likeProject()}>
            <Icon name='like' />
            {likes}
          </button>
        </Card.Content>
      </Card>
    )
  }
}

export { Project }