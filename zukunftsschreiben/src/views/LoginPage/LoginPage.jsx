import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../store/actions';
import { authConstants } from '../../store/constants';

import qs from 'qs';

import './LoginPage.scss';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

    this.state = {
      redirect: query.redirect || '/',
      email: query.email || '',
      password: '',
      submitted: false
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
    const { email, password, redirect } = this.state;
    const { dispatch } = this.props;
    if (this.handleLocalErrors()) {
      dispatch(authActions.login(email, password, redirect));
    }
  }

  handleLocalErrors() {
    const { email, password } = this.state;
    const { dispatch } = this.props;

    let validationErrors = [];

    if (!email) {
      validationErrors.push({
        value: email,
        msg: 'Email is required.',
        param: 'email',
        location: 'local'
      })
    }

    if (!password) {
      validationErrors.push({
        value: password,
        msg: 'Password is required.',
        param: 'password',
        location: 'local'
      })
    }

    if (validationErrors.length > 0) {
      function failure(error) { return { type: authConstants.LOGIN_REQUEST_FAILED, error } }
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
    const { errors } = this.props;

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

  showFieldIndepenentErrorMessage() {
    const { errors } = this.props;
    // only show the field-independet error message, if the are none related to a specific field
    return errors && errors.message && (!errors.data || !errors.data.length);
  }

  render() {
    const { loading, errors } = this.props;
    const { email, password, submitted } = this.state;
    return (
      <div className="view-login-page">
        <iframe
          class="elementor-background-video-embed"
          frameborder="0" allowfullscreen="1"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          title="YouTube video player"
          width="640"
          height="360"
          src="https://www.youtube.com/embed/4SmmLpabd8Y?controls=0&amp;rel=0&amp;playsinline=1&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fzukunftschreiben.org&amp;widgetid=1"
          id="widget2"
        ></iframe>
        <div className="wrapper">
          <div className="login-container">
            <h2>Anmelden</h2>
            <form name="form" onSubmit={this.handleSubmit}>
              <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                <label htmlFor="email">E-Mail</label>
                <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                {
                  this.errorsForField('email')
                }
              </div>
              <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                <label htmlFor="password">Passwort</label>
                <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                {
                  this.errorsForField('password')
                }
                <p>
                  {email &&
                    <Link to={`/forgot-password?email=${email}`}>Vergessen?</Link>
                  }
                  {!email &&
                    <Link to={`/forgot-password`}>Vergessen?</Link>
                  }
                </p>
              </div>
              <div className="form-group">
                {!loading &&
                  <input type="submit" className="form-control" name="login" value="Login" />
                }
                {loading &&
                  <input type="submit" className="form-control" name="login" value="Anmelden..." disabled />
                }
              </div>
            </form>
            <div className="error-container">
              {this.showFieldIndepenentErrorMessage() &&
                <div className="error">{errors.message}</div>
              }
            </div>
            <hr />
            <div className="link-group">
              <p>
                <Link to="/register">Neu bei Zukunftschreiben? Jetzt Anmelden!</Link>
              </p>
              <p>
                {email &&
                  <Link to={`/verify?email=${email}`}>Musst Du Deinen Account noch bestätigen?</Link>
                }
                {!email &&
                  <Link to={`/verify`}>Musst Du Deinen Account noch bestätigen?</Link>
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loading, errors } = state.login;
  return {
    loading,
    errors
  };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 