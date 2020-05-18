import React, { Component } from "react";
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