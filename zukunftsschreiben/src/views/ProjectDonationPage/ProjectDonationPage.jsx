import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { donationActions } from '../../store/actions/donation.actions';
import { projectActions } from '../../store/actions/project.actions';
import { PaymentProgress } from '../../components/PaymentProgress';
import { Grid, Image, Icon, Form, Radio, Button } from 'semantic-ui-react'
import './ProjectDonationPage.scss';


class ProjectDonationPage extends Component {
  constructor(props) {
    super(props);

    const project_id = this.props.match.params.project_id;

    this.state = {
      submitted: false,
      amount: 0,
      period: "",
      project_id: project_id
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { amount } = this.state;
    const { dispatch } = this.props;
    if (this.handleLocalErrors()) {
      dispatch(donationActions.donateToProject(this.props.project, amount));
    }
  }

  handleRadio(e, { value }) {
    this.setState({ value })
  }

  componentDidMount() {
    this.props.dispatch(projectActions.getAll());
  }

  selectProject() {
    const { projects } = this.props;
    const { project_id } = this.state;
    console.log(projects)
    if (!projects || !project_id) { return null }
    return projects.find(p => project_id === p._id)
  }

  render() {
    const project = this.selectProject();

    return (
      <div className="view-project-detail-page">
        <Grid stackable>
          <Grid.Row>
            <PaymentProgress activeStep='1' />
          </Grid.Row>
          <Grid.Column className='infoColumn'>
            <h1 className='projectTitle'>{project && project.title}</h1>
            <p>{project && project.description}</p>
          </Grid.Column>
          <Grid.Column className='donationColumn'>
            <Grid.Row>
              <Image src={(project && project.image) || "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"} wrapped />
            </Grid.Row>
            <Grid.Row>
              <Form size='large'>
                <label className='form-group' htmlFor="amount">Bitte wählen Sie Ihren Spendenbetrag aus</label>
                <Form.Group inline>
                  <Form.Input placeholder='5' width={5} />
                  <Icon name='euro' />
                </Form.Group>
                <Form.Field>
                  Bitte wählen Sie Ihren Spendenrhythmus aus
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='einmalig'
                    name='radioGroup'
                    value='einmalig'
                    checked={this.state.value === 'einmalig'}
                    onChange={this.handleRadio}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='monatlich'
                    name='radioGroup'
                    value='monatlich'
                    checked={this.state.value === 'monatlich'}
                    onChange={this.handleRadio}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='jährlich'
                    name='radioGroup'
                    value='jährlich'
                    checked={this.state.value === 'jährlich'}
                    onChange={this.handleRadio}
                  />
                </Form.Field>
                <Link to={"/projekte/" + project._id + "/anschrift"}><Button>Weiter</Button></Link>
              </Form>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div >
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

const connectedProjectDonationPage = connect(mapStateToProps)(ProjectDonationPage)
export { connectedProjectDonationPage as ProjectDonationPage }