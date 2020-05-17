import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { authHeader } from "../../helpers";
import { Card, Image, Icon } from 'semantic-ui-react';

class Project extends Component {
  constructor(props) {
    super(props)

    this.likeProject = this.likeProject.bind(this)

    this.state = {
    }
  }




  likeProject() { }

  render() {
    const { title, description, likes, comments, category, startDate, endDate, image } = this.props.project

    return (
      <Card fluid>
        <Card.Content>
          <Image src={image || "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"} wrapped />
          <Card.Header>{title}</Card.Header>
          <Card.Meta>Project Duration</Card.Meta>
          <Card.Description>{description}</Card.Description>
          <Card.Description>Project Duration:</Card.Description>
          <Card.Description>Category: {category}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a onClick={this.likeProject()}>
            <Icon name='like' />
            {likes}
          </a>
        </Card.Content>
      </Card>
    )
  }
}

export { Project }