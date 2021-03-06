import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';


import { history } from './helpers';
import { authActions } from './store/actions';

import { PrivateRoute } from './components/PrivateRoute';
import { Navbar } from './components/Navbar';

import { RegisterPage } from './views/RegisterPage';
import { VerifyPage } from './views/VerifyPage';
import { RequestVerificationCodePage } from './views/RequestVerificationCodePage';
import { LoginPage } from './views/LoginPage';
import { LogoutPage } from './views/LogoutPage';
import { ProfilePage } from './views/ProfilePage';
import { ForgotPasswordPage } from './views/ForgotPasswordPage';
import { ResetPasswordPage } from './views/ResetPasswordPage';
import { ProjectsPage } from './views/ProjectsPage';
import { CreateProjectPage } from './views/CreateProjectPage';
import { EditProjectPage } from './views/EditProjectPage';
import { ProjectDonationPage } from './views/ProjectDonationPage';
import { ProjectAddressPage } from './views/ProjectAddressPage';
import { ThankYouPage } from './views/ThankYouPage';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch, user } = this.props;

    // On initial page load we don't know whether the JWT stores
    // in the localStorage of the browser is still valid. 
    // To test the JWT, we try to get the current user. 
    //     -> If this fails, it will automatically remove the user and reload the page.
    //     -> If it succeeds, we will can unlock the application
    if (user) {
      dispatch(authActions.getUser())
    }

  }

  shouldShowApplication() {
    const { initialLoadHappened, user } = this.props;
    return !user || initialLoadHappened;
  }

  //TODO: Styling of ProjectAddressPage and ProjectDonationPage should be unified
  //by refactoring to a shared style sheet if possible
  render() {
    return (
      <div className="container">
        <Router history={history}>
          <Navbar />
          <Switch>
            {this.shouldShowApplication() &&
              <div>
                <Route exact path="/" component={ProjectsPage} />
                <Route exact path="/projekte" component={ProjectsPage} />
                <Route exact path="/projekte/:project_id" component={ProjectDonationPage} />
                <PrivateRoute exact path="/projekte/:project_id/anschrift" component={ProjectAddressPage} />
                <PrivateRoute exact path="/projekte/:project_id/thanks" component={ThankYouPage} />

                <Route path="/register" component={RegisterPage} />
                <Route path="/verify" component={VerifyPage} />
                <Route path="/request-code" component={RequestVerificationCodePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/logout" component={LogoutPage} />
                <Route path="/forgot-password" component={ForgotPasswordPage} />
                <Route path="/reset-password" component={ResetPasswordPage} />
                <PrivateRoute path="/profile" component={ProfilePage} />
                <PrivateRoute path="/create-project" component={CreateProjectPage} />
                <PrivateRoute path="/edit-project/:id" component={EditProjectPage} />
              </div>
            }
          </Switch>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user, initialLoadHappened } = state.login;
  return {
    user,
    initialLoadHappened
  };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
