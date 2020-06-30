import React, { Component } from 'react';
import { connect } from 'react-redux';
import { donationActions } from '../../store/actions/donation.actions';
import { projectActions } from '../../store/actions/project.actions';
import { PaymentProgress } from '../../components/PaymentProgress';
import { Grid, Image, Icon, Form, Radio } from 'semantic-ui-react'
import './ProjectDonationPage.scss';
import { projectConstants } from '../../store/constants';


class ProjectDonationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      amount: 5,
      period: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
  }

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

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    //TODO: The donatoin should of course only really happen after the Stripe/Paypal
    //API have succeeded
    e.preventDefault();
    this.setState({ submitted: true });
    const { amount } = this.state;
    const { dispatch, loading } = this.props;
    const project = this.selectProject();
    if (this.handleLocalErrors()) {
      dispatch(donationActions.donateToProject(project, amount))
    }
    if (!loading) {
      window.location = "/projekte/" + (project && project._id) + "/anschrift"
    }
  }

  handleLocalErrors() {
    const { amount, period } = this.state;
    const { dispatch, user } = this.props;

    let validationErrors = [];

    if (!user) {
      function failure(error) { return { type: projectConstants.GET_POSTS_REQUEST_FAILED, error } }
      dispatch(failure({
        status: 0,
        message: 'Bitte melde Dich an, um zu spenden.',
        data: null
      }));
      return false
    }

    if (amount < 5) {
      validationErrors.push({
        value: amount,
        msg: 'Spende bitte mindestens 5 Euro',
        param: 'amount',
        location: 'local'
      })
    }

    if (!period) {
      validationErrors.push({
        value: period,
        msg: 'Gib bitte an, ob Du nur jetzt oder auch in Zukunft spenden möchtest',
        param: 'period',
        location: 'local'
      })
    }

    if (validationErrors.length > 0) {
      function failure(error) { return { type: projectConstants.GET_PROJECTS_REQUEST_FAILED, error } }
      dispatch(failure({
        status: 0,
        message: 'Local Validation Error.',
        data: validationErrors
      }));
      return false
    }

    return true;
  }

  errorsForField(name) {
    const { errors } = this.props

    if (!errors) {
      return '';
    }
    if (!errors.data) {
      return '';
    }
    if (!errors.data.length > 0) {
      return '';
    }
    return errors.data
      .filter(e => e.param === name)
      .map(e => <div className="error" key={e.msg}>{e.msg}</div>)
  }

  handleRadio(e, { value }) {
    this.setState({ value })
    this.setState({ period: value })
  }

  render() {
    const project = this.selectProject;
    const { loading } = this.props;
    const { amount } = this.state;

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
              <Form size='large' onSubmit={this.handleSubmit}>
                <label className='form-group' htmlFor="amount">Bitte wählen Sie Ihren Spendenbetrag aus</label>
                <Form.Group inline>
                  <div class='four wide field'>
                    <input type="number" className="form-control" name="amount" value={amount} onChange={this.handleChange} />
                  </div>
                  <Icon name='euro' />
                  {this.errorsForField("amount")}
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
                  {this.errorsForField("period")}
                </Form.Field>
                <div>
                  {!loading &&
                    <input type="submit" className="ui button" name="donate" value="Spenden" />
                  }
                  {loading &&
                    <input type="submit" className="ui button" name="donate" value="Spenden..." disabled />
                  }
                </div>
              </Form>
            </Grid.Row>
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
    loading: project.loading,
    errors: project.errors
  };
}

const connectedProjectDonationPage = connect(mapStateToProps)(ProjectDonationPage)
export { connectedProjectDonationPage as ProjectDonationPage }