import React, { Component } from 'react';
import { connect } from 'react-redux';
import { donationActions } from '../../store/actions/donation.actions';



class ProjectDetailPage extends Component {
  constructor(props) {
    super(props);

    const project_id = this.props.match.params.project_id;

    this.state = {
      submitted: false,
      amount: 0,
      project_id: project_id
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    const { submitted, amount } = this.state;
    const { loading, errors } = this.props;


    return (
      <div className="view-project-detail-page">
        <h1>ProjectDetailPage</h1>

        <form name="form" onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !amount ? ' has-error' : '')}>
            <label htmlFor="amount">Donation Amount</label>
            <input type="text" className="form-control" name="amount" value={amount} onChange={this.handleChange} />
            {
              this.errorsForField('amount')
            }
          </div>
          <div className="form-group">
            {!loading &&
              <input type="submit" className="form-control" name="donate" value="Donate" />
            }
            {loading &&
              <input type="submit" className="form-control" name="donate" value="Donating disabled" />
            }
          </div>
        </form>
      </div>
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

const connectedProjectDetailPage = connect(mapStateToProps)(ProjectDetailPage)
export { connectedProjectDetailPage as ProjectDetailPage }