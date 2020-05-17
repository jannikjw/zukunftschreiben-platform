import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Project } from "./Project"
import { Grid, Segment } from 'semantic-ui-react'

const API_URL = process.env.REACT_APP_API_HOST + "/api";

class ProjectsPage extends Component {
  constructor(props) {
    super(props)

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getProjects = this.getProjects.bind(this);

    this.state = {
      projects: [],
    }
  }

  getProjects() {
    //gets Array of all posts
    const endpoint = API_URL + "/posts"; // 'api/posts

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => this.setState({ posts: data }))
      .catch((error) => {
        console.error('Fetch Error :-S', error)
      });

    const projects = [
      {
        "_id": { "$oid": "5ec103cfb467a43668855e15" },
        "status": "hidden",
        "likes": "0",
        "comments": [],
        "title": "Centerling News",
        "description": "cool stuff",
        "category": "Entrepreneurship",
        "startDate": { "$date": "2020-05-08T00:00:00Z" },
        "endDate": { "$date": "2020-05-30T00:00:00Z" },
        "author": "5eb6e884040d8aabb0eff4f7",
        "username": "jannikw",
        "createdAt": { "$date": "2020-05-17T09:28:47.167Z" },
        "updatedAt": { "$date": "2020-05-17T09:28:47.167Z" },
        "__v": "0"
      },
      {
        "_id": { "$oid": "5ebe9241f3526c051cdfceac" },
        "status": "hidden",
        "likes": "0",
        "comments": [],
        "title": "Test",
        "description": "A Test Project",
        "category": "Test",
        "startDate": { "$date": "2020-01-01T14:04:00Z" },
        "endDate": { "$date": "2020-01-01T15:04:00Z" },
        "author": "5ebe7980f3526c051cdfcea5",
        "username": "felanders",
        "createdAt": { "$date": "2020-05-15T12:59:45.550Z" },
        "updatedAt": { "$date": "2020-05-15T12:59:45.550Z" },
        "__v": "0"
      }
    ]


    this.setState({
      projects: projects
    })
  }

  componentDidMount() {
    this.getProjects();
  }

  render() {
    const { projects } = this.state

    return (
      <>
        <h1>ProjectsPage</h1>
        <Grid stackable columns={2}>
          {projects.map((project, index) =>
            <Grid.Column>
              <Segment>
                <Project
                  key={project._id}
                  project={project}
                  index={index}
                />
              </Segment>
            </Grid.Column>)
          }
        </Grid>
      </>
    )
  }
}



export { ProjectsPage }